import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MercadoPagoService } from '@/lib/mercadopago';
import { calculateShippingOptions } from '@/lib/shipping';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      identification,
      shippingAddress,
      shippingOptionId,
      paymentMethod,
      cardData,
      couponCode,
      notes,
      items,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'O carrinho está vazio' },
        { status: 400 }
      );
    }

    if (!identification?.name || !identification?.email || !identification?.cpf) {
      return NextResponse.json(
        { error: 'Dados de identificação incompletos' },
        { status: 400 }
      );
    }

    if (!shippingAddress?.zipCode || !shippingAddress?.street || !shippingAddress?.number) {
      return NextResponse.json(
        { error: 'Endereço de entrega incompleto' },
        { status: 400 }
      );
    }

    // 1. Validar e recalcular preços reais dos produtos no banco de dados (Segurança Backend)
    const productIds = items.map((i: { productId: string }) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
      include: { variants: true },
    });

    const dbProductsMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const verifiedOrderItems: {
      productId: string;
      variantId?: string | null;
      productName: string;
      productImage: string;
      variantName?: string | null;
      price: number;
      quantity: number;
      total: number;
    }[] = [];

    for (const item of items) {
      const dbProd = dbProductsMap.get(item.productId);
      if (!dbProd) {
        return NextResponse.json(
          { error: `Produto ${item.name || item.productId} não está mais disponível` },
          { status: 400 }
        );
      }

      let unitPrice = dbProd.price;
      let variantName = item.variantName || null;

      if (item.variantId) {
        const variant = dbProd.variants.find((v) => v.id === item.variantId);
        if (variant) {
          unitPrice += variant.priceAdjustment || 0;
          variantName = `Cor: ${variant.colorName || variant.name}`;
        }
      }

      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      verifiedOrderItems.push({
        productId: dbProd.id,
        variantId: item.variantId || null,
        productName: dbProd.name,
        productImage: item.image || (dbProd as unknown as { images?: { url: string }[] }).images?.[0]?.url || '',
        variantName,
        price: unitPrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // 2. Validar Frete
    const shippingOptions = calculateShippingOptions(
      shippingAddress.zipCode,
      calculatedSubtotal
    );
    const selectedShipping =
      shippingOptions.find((o) => o.id === shippingOptionId) || shippingOptions[0];
    const shippingCost = selectedShipping.price;

    // 3. Validar Cupom de Desconto
    let discountAmount = 0;
    let validatedCoupon = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim(), active: true },
      });

      if (coupon && (!coupon.minOrderValue || calculatedSubtotal >= coupon.minOrderValue)) {
        validatedCoupon = coupon;
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = Math.min(coupon.discountValue, calculatedSubtotal);
        }
      }
    }

    // Desconto especial de 5% no Pix se selecionado
    let pixDiscount = 0;
    if (paymentMethod === 'PIX') {
      pixDiscount = ((calculatedSubtotal - discountAmount) * 5) / 100;
    }

    const totalDiscount = discountAmount + pixDiscount;
    const finalTotal = Math.max(0, calculatedSubtotal - totalDiscount + shippingCost);

    // 4. Gerar número de pedido único sequencial (ex: EXM-10236)
    const orderCount = await prisma.order.count();
    const orderNumber = `EXM-${10235 + orderCount + 1}`;

    // 5. Transação no Prisma para garantir consistência e baixa no estoque
    const newOrder = await prisma.$transaction(async (tx) => {
      // Baixa no estoque
      for (const item of verifiedOrderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Criar o Pedido
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: (session?.user as unknown as { id?: string })?.id || null,
          guestName: identification.name,
          guestEmail: identification.email,
          guestPhone: identification.phone,
          guestCpf: identification.cpf,
          status: paymentMethod === 'CREDIT_CARD' ? 'PAID' : 'PENDING',
          paymentMethod,
          paymentStatus: paymentMethod === 'CREDIT_CARD' ? 'APPROVED' : 'PENDING',
          subtotal: calculatedSubtotal,
          discount: totalDiscount,
          shippingCost,
          total: finalTotal,
          carrierName: selectedShipping.carrier,
          shippingService: selectedShipping.name,
          couponCode: validatedCoupon ? validatedCoupon.code : null,
          shippingAddress: JSON.stringify(shippingAddress),
          notes: notes || null,
          items: {
            create: verifiedOrderItems,
          },
          statusHistory: {
            create: [
              {
                status: 'PENDING',
                note: 'Pedido realizado na loja OutdoorStyle',
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      // Atualizar uso do cupom se aplicável
      if (validatedCoupon) {
        await tx.coupon.update({
          where: { id: validatedCoupon.id },
          data: {
            currentUses: { increment: 1 },
          },
        });
      }

      return order;
    });

    // 6. Processar Pagamento Mercado Pago
    let paymentResult: unknown = null;

    if (paymentMethod === 'PIX') {
      const pix = await MercadoPagoService.createPixPayment({
        orderNumber: newOrder.orderNumber,
        amount: finalTotal,
        payer: {
          name: identification.name,
          email: identification.email,
          cpf: identification.cpf,
        },
      });

      await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          paymentMethod: 'PIX',
          status: 'PENDING',
          transactionId: pix.paymentId,
          qrCode: pix.qrCode,
          qrCodeBase64: pix.qrCodeBase64,
          copyPastePix: pix.copyPastePix,
          amount: finalTotal,
        },
      });

      paymentResult = pix;
    } else if (paymentMethod === 'CREDIT_CARD') {
      const card = await MercadoPagoService.processCardPayment({
        orderNumber: newOrder.orderNumber,
        amount: finalTotal,
        cardNumber: cardData?.cardNumber || '4242424242424242',
        cardHolder: cardData?.cardHolder || identification.name,
        cardExpiration: cardData?.cardExpiration || '12/28',
        cardCvv: cardData?.cardCvv || '123',
        installments: cardData?.installments || 1,
        payer: {
          name: identification.name,
          email: identification.email,
          cpf: identification.cpf,
        },
      });

      await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          paymentMethod: 'CREDIT_CARD',
          status: 'APPROVED',
          transactionId: card.paymentId,
          installments: card.installments,
          cardLastFour: card.cardLastFour,
          cardBrand: card.cardBrand,
          amount: finalTotal,
          paidAt: new Date(),
        },
      });

      await prisma.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: 'PAID',
          note: `Pagamento de R$ ${finalTotal.toFixed(2)} aprovado no cartão de crédito (${card.cardBrand} em ${card.installments}x)`,
        },
      });

      paymentResult = card;
    }

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
        status: newOrder.status,
      },
      payment: paymentResult,
    });
  } catch (error) {
    console.error('Erro ao processar checkout:', error);
    return NextResponse.json(
      { error: 'Não foi possível finalizar o pedido. Tente novamente.' },
      { status: 500 }
    );
  }
}

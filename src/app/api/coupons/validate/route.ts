import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Código de cupom obrigatório' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: 'Cupom inválido ou expirado' }, { status: 404 });
    }

    // Validação de limite de uso
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ error: 'Cupom atingiu o limite de utilizações' }, { status: 400 });
    }

    // Validação de data
    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json({ error: 'Cupom ainda não está ativo' }, { status: 400 });
    }
    if (coupon.validUntil && now > coupon.validUntil) {
      return NextResponse.json({ error: 'Cupom expirado' }, { status: 400 });
    }

    // Validação de valor mínimo
    const orderSubtotal = Number(subtotal) || 0;
    if (coupon.minOrderValue > 0 && orderSubtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          error: `Este cupom é válido apenas para pedidos acima de R$ ${coupon.minOrderValue.toFixed(2)}`,
        },
        { status: 400 }
      );
    }

    // Calcular desconto
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderSubtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, orderSubtotal);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
      },
      discountAmount,
    });
  } catch (error) {
    console.error('Erro na validação do cupom:', error);
    return NextResponse.json(
      { error: 'Erro ao validar cupom de desconto' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoService } from '@/lib/mercadopago';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-signature');
    const { searchParams } = new URL(req.url);
    const dataId = searchParams.get('data.id') || searchParams.get('id');
    const type = searchParams.get('type') || searchParams.get('topic');

    // Validação de segurança
    if (!MercadoPagoService.verifyWebhookSignature(signature, dataId)) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    }

    if (type === 'payment' && dataId) {
      // Buscar pagamento pelo transactionId ou dataId
      const payment = await prisma.payment.findFirst({
        where: {
          OR: [{ transactionId: dataId }, { id: dataId }],
        },
        include: { order: true },
      });

      if (payment && payment.status !== 'APPROVED') {
        // Atualizar status para aprovado
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'APPROVED',
              paidAt: new Date(),
            },
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: {
              status: 'PAID',
              paymentStatus: 'APPROVED',
            },
          }),
          prisma.orderStatusHistory.create({
            data: {
              orderId: payment.orderId,
              status: 'PAID',
              note: 'Pagamento aprovado via Webhook oficial Mercado Pago',
            },
          }),
        ]);

        console.log(`[Webhook MP] Pedido ${payment.order.orderNumber} atualizado para PAGO`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook do Mercado Pago:', error);
    return NextResponse.json({ error: 'Erro interno no processamento' }, { status: 500 });
  }
}

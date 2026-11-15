import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoService } from '@/lib/mercadopago';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-signature');
    const requestId = req.headers.get('x-request-id');
    const { searchParams } = new URL(req.url);

    let body: {
      type?: string;
      topic?: string;
      action?: string;
      data?: { id?: string | number };
    } = {};

    try {
      body = await req.json();
    } catch {
      // Caso o webhook venha apenas via query string
    }

    const dataId = String(
      searchParams.get('data.id') ||
        searchParams.get('id') ||
        body?.data?.id ||
        ''
    ).trim();

    const type =
      searchParams.get('type') ||
      searchParams.get('topic') ||
      body?.type ||
      body?.topic ||
      (body?.action?.startsWith('payment.') ? 'payment' : '');

    // Validação de assinatura HMAC SHA256
    if (!MercadoPagoService.verifyWebhookSignature(signature, requestId, dataId)) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    }

    if (type === 'payment' && dataId) {
      let mpStatus = 'approved';
      let externalRef: string | undefined;

      // Se as credenciais reais do Mercado Pago estiverem ativas, consulta o status real na API do MP
      if (MercadoPagoService.isProductionConfigured()) {
        const mpPayment = await MercadoPagoService.getPaymentById(dataId);
        if (mpPayment) {
          mpStatus = mpPayment.status || 'pending';
          externalRef = mpPayment.external_reference || undefined;
        }
      }

      // Localizar pagamento pelo transactionId, id ou pelo pedido (external_reference)
      const payment = await prisma.payment.findFirst({
        where: {
          OR: [
            { transactionId: dataId },
            { id: dataId },
            ...(externalRef ? [{ order: { orderNumber: externalRef } }] : []),
          ],
        },
        include: { order: true },
      });

      if (payment) {
        if (mpStatus === 'approved' && payment.status !== 'APPROVED') {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: 'APPROVED',
                transactionId: dataId,
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
                note: `Pagamento confirmado via Webhook Oficial Mercado Pago (ID #${dataId})`,
              },
            }),
          ]);

          console.log(`[Webhook MP] Pedido ${payment.order.orderNumber} atualizado para PAGO`);
        } else if (
          (mpStatus === 'rejected' || mpStatus === 'cancelled') &&
          payment.status !== 'REJECTED'
        ) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'REJECTED' },
            }),
            prisma.order.update({
              where: { id: payment.orderId },
              data: { paymentStatus: 'REJECTED' },
            }),
            prisma.orderStatusHistory.create({
              data: {
                orderId: payment.orderId,
                status: 'CANCELLED',
                note: `Pagamento recusado ou cancelado no Mercado Pago (Status: ${mpStatus})`,
              },
            }),
          ]);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook do Mercado Pago:', error);
    return NextResponse.json({ error: 'Erro interno no processamento' }, { status: 500 });
  }
}

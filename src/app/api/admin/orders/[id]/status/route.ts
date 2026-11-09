import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;

    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const { status, trackingCode, carrierName, note } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id: params.id },
        data: {
          status: status || order.status,
          trackingCode: trackingCode !== undefined ? trackingCode : order.trackingCode,
          carrierName: carrierName !== undefined ? carrierName : order.carrierName,
        },
      });

      if (status && status !== order.status) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status,
            note: note || `Status alterado para ${status} pelo administrador`,
          },
        });
      }

      return ord;
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    );
  }
}

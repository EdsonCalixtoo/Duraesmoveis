import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;

    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const [totalOrders, totalCustomers, orders] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        include: { items: true },
      }),
    ]);

    const validOrders = orders.filter((o) => o.status !== 'CANCELLED');
    const revenueFromOrders = validOrders.reduce((sum, o) => sum + o.total, 0);
    const averageTicket = validOrders.length > 0 ? revenueFromOrders / validOrders.length : 0;

    const salesByDayMap = new Map<string, number>();
    for (const ord of validOrders) {
      const dt = new Date(ord.createdAt);
      const label = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      salesByDayMap.set(label, (salesByDayMap.get(label) || 0) + Number(ord.total || 0));
    }

    const salesChart = Array.from(salesByDayMap.entries()).map(([day, sales]) => ({
      day,
      sales,
    }));

    const productSalesMap = new Map<
      string,
      { id: string; name: string; salesCount: number; revenue: number; image: string }
    >();

    for (const ord of validOrders) {
      for (const item of ord.items) {
        const existing = productSalesMap.get(item.productId);
        if (existing) {
          existing.salesCount += item.quantity;
          existing.revenue += item.total;
        } else {
          productSalesMap.set(item.productId, {
            id: item.productId,
            name: item.productName,
            salesCount: item.quantity,
            revenue: item.total,
            image: item.productImage || '/images/prod-sofa-riviera.jpg',
          });
        }
      }
    }

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);

    return NextResponse.json({
      revenue: revenueFromOrders,
      revenueGrowth: `${validOrders.length} pedidos válidos`,
      ordersCount: totalOrders,
      ordersGrowth: 'Sincronizado com Supabase',
      averageTicket,
      ticketGrowth: 'Média real',
      customersCount: totalCustomers,
      customersGrowth: 'Base ativa',
      salesChart,
      topProducts,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do admin:', error);
    return NextResponse.json({ error: 'Erro ao gerar dados' }, { status: 500 });
  }
}

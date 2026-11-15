import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import SalesBarChart from '@/components/admin/SalesBarChart';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [totalOrders, totalCustomers, totalProducts, allOrders, allProducts] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { reviewsCount: 'desc' },
      take: 4,
      include: { images: { orderBy: { displayOrder: 'asc' }, take: 1 } },
    }),
  ]);

  const validOrders = allOrders.filter((o) => o.status !== 'CANCELLED');
  const realRevenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const averageTicket = validOrders.length > 0 ? realRevenue / validOrders.length : 0;
  const recentOrders = allOrders.slice(0, 5);

  const kpiData = {
    revenue: realRevenue,
    revenueGrowth: `${validOrders.length} pedidos pagos`,
    ordersCount: totalOrders,
    ordersGrowth: `${totalProducts} produtos ativos`,
    averageTicket,
    ticketGrowth: 'Média real por pedido',
    customersCount: totalCustomers,
    customersGrowth: 'Base Supabase ativa',
  };

  // Agregar vendas reais por dia a partir dos pedidos no banco
  const salesByDayMap = new Map<string, number>();
  for (const ord of validOrders) {
    const dt = new Date(ord.createdAt);
    const label = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    salesByDayMap.set(label, (salesByDayMap.get(label) || 0) + Number(ord.total || 0));
  }

  const salesChartData =
    salesByDayMap.size > 0
      ? Array.from(salesByDayMap.entries())
          .reverse()
          .map(([day, sales]) => ({ day, sales }))
      : [{ day: 'Hoje', sales: 0 }];

  // Calcular produtos mais vendidos a partir dos OrderItems reais + catálogo real
  const productSalesMap = new Map<
    string,
    { id: string; name: string; sales: number; revenue: number; image: string }
  >();

  for (const ord of validOrders) {
    for (const item of ord.items) {
      const existing = productSalesMap.get(item.productId);
      if (existing) {
        existing.sales += item.quantity;
        existing.revenue += item.total;
      } else {
        productSalesMap.set(item.productId, {
          id: item.productId,
          name: item.productName,
          sales: item.quantity,
          revenue: item.total,
          image: item.productImage || '/images/prod-sofa-riviera.jpg',
        });
      }
    }
  }

  for (const p of allProducts) {
    if (!productSalesMap.has(p.id) && productSalesMap.size < 4) {
      productSalesMap.set(p.id, {
        id: p.id,
        name: p.name,
        sales: 0,
        revenue: 0,
        image: p.images[0]?.url || '/images/prod-sofa-riviera.jpg',
      });
    }
  }

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <AdminHeader title="Dashboard" subtitle="Visão geral em tempo real da sua loja (Supabase)." />

      <div className="px-6 sm:px-8 space-y-8">
        {/* 4 Métricas Chave Reais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vendas */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
              <span>Faturamento Real</span>
              <span className="px-2 py-0.5 rounded-full bg-[#8CF000]/10 text-[#8CF000] font-bold text-[11px] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {kpiData.revenueGrowth}
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {formatCurrency(kpiData.revenue)}
            </div>
          </div>

          {/* Pedidos */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
              <span>Pedidos Realizados</span>
              <span className="px-2 py-0.5 rounded-full bg-[#8CF000]/10 text-[#8CF000] font-bold text-[11px] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {kpiData.ordersGrowth}
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {kpiData.ordersCount}
            </div>
          </div>

          {/* Ticket Médio */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
              <span>Ticket Médio</span>
              <span className="px-2 py-0.5 rounded-full bg-[#8CF000]/10 text-[#8CF000] font-bold text-[11px] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {kpiData.ticketGrowth}
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {formatCurrency(kpiData.averageTicket)}
            </div>
          </div>

          {/* Clientes */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
              <span>Clientes</span>
              <span className="px-2 py-0.5 rounded-full bg-[#8CF000]/10 text-[#8CF000] font-bold text-[11px] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {kpiData.customersGrowth}
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {kpiData.customersCount}
            </div>
          </div>
        </div>

        {/* Charts & Top Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Vendas (8 Cols) */}
          <div className="lg:col-span-8 bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Faturamento por Data</h3>
                <span className="text-xs text-[#8E8E8E]">Evolução real de pedidos registrados no Supabase</span>
              </div>
              <span className="text-xs text-[#8CF000] font-bold">Dados em Tempo Real</span>
            </div>

            <SalesBarChart data={salesChartData} />
          </div>

          {/* Produtos mais vendidos (4 Cols) */}
          <div className="lg:col-span-4 bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
              <h3 className="text-base font-bold text-white">Produtos mais vendidos</h3>
              <Link href="/admin/produtos" className="text-xs text-[#8CF000] hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="space-y-3.5">
              {topProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#737373] w-4">{idx + 1}</span>
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#0A0A0A] border border-[#2B2B2B] flex-shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{p.name}</h4>
                      <span className="text-[10px] text-[#A3A3A3]">{p.sales} vendas</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-white">
                      {formatCurrency(p.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de Pedidos Recentes */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <div>
              <h3 className="text-base font-bold text-white">Pedidos Recentes</h3>
              <span className="text-xs text-[#8E8E8E]">Últimas compras realizadas na loja</span>
            </div>
            <Link
              href="/admin/pedidos"
              className="text-xs text-[#8CF000] hover:underline flex items-center gap-1"
            >
              <span>Gerenciar Pedidos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[#737373] uppercase text-[10px] border-b border-[#222222]">
                <tr>
                  <th className="py-2.5">Pedido</th>
                  <th className="py-2.5">Cliente</th>
                  <th className="py-2.5">Data</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Total</th>
                  <th className="py-2.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#181818]/60 transition-colors">
                    <td className="py-3 font-mono font-bold text-white">#{ord.orderNumber}</td>
                    <td className="py-3 text-white">{ord.guestName || 'Cliente'}</td>
                    <td className="py-3 text-[#A3A3A3]">{formatDate(ord.createdAt)}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'IN_TRANSIT'
                            ? 'bg-[#8CF000] text-black'
                            : ord.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-white">
                      {formatCurrency(ord.total)}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/pedidos/${ord.id}`}
                        className="text-xs text-[#8CF000] hover:underline"
                      >
                        Ver Detalhe
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

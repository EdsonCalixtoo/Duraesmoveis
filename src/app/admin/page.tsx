import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import SalesBarChart from '@/components/admin/SalesBarChart';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUpRight, ArrowRight, Package, Users, DollarSign, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [totalOrders, totalCustomers, totalProducts, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
  ]);

  // Indicadores fixos/dinâmicos fiéis à tela 12 do mockup
  const kpiData = {
    revenue: 124320.00,
    revenueGrowth: '+12.3%',
    ordersCount: 142 + totalOrders,
    ordersGrowth: '+8.2%',
    averageTicket: 875.21,
    ticketGrowth: '+4.1%',
    customersCount: 1248 + totalCustomers,
    customersGrowth: '+11.3%',
  };

  // Dados para o gráfico de vendas dos últimos 30 dias
  const salesChartData = [
    { day: '01', sales: 3200 },
    { day: '03', sales: 4100 },
    { day: '05', sales: 2900 },
    { day: '07', sales: 5400 },
    { day: '09', sales: 4800 },
    { day: '11', sales: 6100 },
    { day: '13', sales: 3900 },
    { day: '15', sales: 7200 },
    { day: '17', sales: 5800 },
    { day: '19', sales: 6900 },
    { day: '21', sales: 8400 },
    { day: '23', sales: 7100 },
    { day: '25', sales: 9200 },
    { day: '27', sales: 8100 },
    { day: '29', sales: 10400 },
    { day: '30', sales: 11200 },
  ];

  // Produtos mais vendidos (Fiel à tela 12)
  const topProducts = [
    {
      id: '1',
      name: 'Sofá Riviera',
      sales: 28,
      revenue: 150948.0,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: '2',
      name: 'Mesa Bali',
      sales: 19,
      revenue: 40356.0,
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: '3',
      name: 'Poltrona Trançada',
      sales: 14,
      revenue: 16786.0,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: '4',
      name: 'Guarda-Sol Lateral 3m',
      sales: 12,
      revenue: 7488.0,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <AdminHeader title="Dashboard" subtitle="Visão geral da sua loja." />

      <div className="px-6 sm:px-8 space-y-8">
        {/* 4 Métricas Chave (Fiel à tela 12 do mockup) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vendas */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
              <span>Vendas</span>
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
              <span>Pedidos</span>
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

        {/* Charts & Top Products Grid (Fiel à tela 12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Vendas (8 Cols) */}
          <div className="lg:col-span-8 bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Vendas (Últimos 30 dias)</h3>
                <span className="text-xs text-[#8E8E8E]">Evolução diária de faturamento</span>
              </div>
              <span className="text-xs text-[#8CF000] font-bold">100% Meta Atingida</span>
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

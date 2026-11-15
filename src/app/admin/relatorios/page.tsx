import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import SalesBarChart from '@/components/admin/SalesBarChart';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const [orders, categories] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'asc' },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const validOrders = orders.filter((o) => o.status !== 'CANCELLED');
  const pixOrders = validOrders.filter((o) => o.paymentMethod === 'PIX');
  const cardOrders = validOrders.filter((o) => o.paymentMethod === 'CREDIT_CARD');

  const pixRevenue = pixOrders.reduce((s, o) => s + o.total, 0);
  const cardRevenue = cardOrders.reduce((s, o) => s + o.total, 0);

  const chartData = validOrders.map((o) => ({
    day: `#${o.orderNumber}`,
    sales: o.total,
  }));

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Relatórios & Performance"
        subtitle="Métricas reais de faturamento, meios de pagamento e distribuição do catálogo no Supabase."
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-1">
            <span className="text-xs text-[#A3A3A3]">Receita via Pix ({pixOrders.length} pedidos)</span>
            <p className="text-2xl font-black text-[#8CF000]">{formatCurrency(pixRevenue)}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-1">
            <span className="text-xs text-[#A3A3A3]">Receita via Cartão ({cardOrders.length} pedidos)</span>
            <p className="text-2xl font-black text-white">{formatCurrency(cardRevenue)}</p>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Faturamento por Pedido</h3>
          <SalesBarChart data={chartData.length > 0 ? chartData : [{ day: 'Sem pedidos', sales: 0 }]} />
        </div>

        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Produtos por Categoria (Supabase)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B]">
                <span className="text-xs font-bold text-white block">{c.name}</span>
                <span className="text-sm font-black text-[#8CF000]">{c._count.products} produtos</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

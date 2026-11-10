import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PackageCheck, ArrowRight, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status;

  const where = statusFilter && statusFilter !== 'ALL' ? { status: statusFilter } : {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      payment: true,
    },
  });

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Gerenciamento de Pedidos"
        subtitle="Acompanhe pedidos, despache entregas e atualize códigos de rastreamento."
      />

      <div className="px-6 sm:px-8 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar text-xs font-semibold">
          {[
            { label: 'Todos', value: 'ALL' },
            { label: 'Em Transporte', value: 'IN_TRANSIT' },
            { label: 'Pagos / Preparando', value: 'PAID' },
            { label: 'Entregues', value: 'DELIVERED' },
            { label: 'Pendentes', value: 'PENDING' },
          ].map((tab) => {
            const isActive = (!statusFilter && tab.value === 'ALL') || statusFilter === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value === 'ALL' ? '/admin/pedidos' : `/admin/pedidos?status=${tab.value}`}
                className={`px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#8CF000] text-black font-extrabold shadow-sm'
                    : 'bg-[#141414] text-[#A3A3A3] hover:text-white border border-[#2B2B2B]'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Orders Table */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181818] text-[#737373] uppercase text-[10px] border-b border-[#242424]">
                <tr>
                  <th className="py-3.5 px-4">Pedido</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Pagamento</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Rastreio</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#191919] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      #{ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{ord.guestName || 'Cliente'}</span>
                      <span className="text-[10px] text-[#737373]">{ord.guestEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A3A3A3]">{formatDate(ord.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[#D1D1D1] font-semibold">{ord.paymentMethod}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'IN_TRANSIT'
                            ? 'bg-[#8CF000] text-black shadow-sm'
                            : ord.status === 'DELIVERED'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : ord.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {ord.status === 'IN_TRANSIT' ? 'Em transporte' : ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#A3A3A3]">
                      {ord.trackingCode || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white">
                      {formatCurrency(ord.total)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/pedidos/${ord.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] border border-[#353535] text-[11px] font-bold text-white inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Gerenciar</span>
                        <ArrowRight className="w-3 h-3 text-[#8CF000]" />
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


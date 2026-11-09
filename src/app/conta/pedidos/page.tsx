import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Package, ArrowRight, Truck } from 'lucide-react';

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as unknown as { id?: string })?.id;

  // Se o usuário estiver autenticado, busca os pedidos dele; caso contrário ou se for o cliente demonstrativo, exibe os pedidos do seed
  const orders = await prisma.order.findMany({
    where: userId ? { OR: [{ userId }, { orderNumber: 'EXM-10234' }] } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Meus Pedidos</h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Acompanhe o histórico e o status de entrega dos seus pedidos.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-[#141414] rounded-2xl border border-[#2B2B2B]">
          <Package className="w-12 h-12 text-[#737373] mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Nenhum pedido encontrado</h3>
          <p className="text-xs text-[#A3A3A3] mb-6">
            Você ainda não realizou compras em nossa loja.
          </p>
          <Link
            href="/catalogo"
            className="px-6 py-2.5 rounded-xl bg-[#8CF000] text-black font-bold text-xs"
          >
            Explorar Coleção
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const isDelivered = ord.status === 'DELIVERED';
            const isTransit = ord.status === 'IN_TRANSIT';

            return (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#383838] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222222]">
                  <div>
                    <span className="text-xs text-[#8E8E8E]">Número do Pedido</span>
                    <h3 className="text-sm font-bold text-white">#{ord.orderNumber}</h3>
                    <span className="text-[11px] text-[#737373]">
                      Realizado em: {formatDate(ord.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isTransit
                          ? 'bg-[#8CF000] text-black shadow-sm'
                          : isDelivered
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#222222] text-[#8CF000] border border-[#8CF000]/30'
                      }`}
                    >
                      {ord.status === 'IN_TRANSIT'
                        ? 'Em transporte'
                        : ord.status === 'DELIVERED'
                        ? 'Entregue'
                        : ord.status === 'PAID'
                        ? 'Pagamento aprovado'
                        : 'Pendente'}
                    </span>

                    <Link
                      href={`/conta/pedidos/${ord.id}`}
                      className="px-4 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] border border-[#353535] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>Ver Detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Resumo dos Itens */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="text-[#A3A3A3]">
                    {ord.items.map((it) => it.productName).join(' • ')}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#8E8E8E] block">Total do Pedido:</span>
                    <span className="text-sm font-black text-white">
                      {formatCurrency(ord.total)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

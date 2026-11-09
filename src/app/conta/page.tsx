import React from 'react';
import Link from 'next/link';
import { Package, Heart, MapPin, User, ArrowRight, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as unknown as { id?: string })?.id;

  // Buscar pedidos recentes do usuário ou demonstrativo
  const recentOrder = await prisma.order.findFirst({
    where: userId ? { userId } : { orderNumber: 'EXM-10234' },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Minha Conta</h1>
        <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1">
          Gerencie seus dados, pedidos e preferências.
        </p>
      </div>

      {/* 4 Interactive Dashboard Cards (Fiel à tela 07) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/conta/pedidos"
          className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000] group transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#8CF000] mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-[#8CF000] transition-colors">
            Meus Pedidos
          </h3>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Acompanhe e gerencie suas compras e rastreamento.
          </p>
        </Link>

        <Link
          href="/conta/favoritos"
          className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000] group transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#8CF000] mb-4 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-[#8CF000] transition-colors">
            Favoritos
          </h3>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Seus móveis favoritos salvos para comprar depois.
          </p>
        </Link>

        <Link
          href="/conta/enderecos"
          className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000] group transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#8CF000] mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-[#8CF000] transition-colors">
            Endereços
          </h3>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Gerencie seus locais de entrega cadastrados.
          </p>
        </Link>

        <Link
          href="/conta/dados"
          className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000] group transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#8CF000] mb-4 group-hover:scale-110 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-[#8CF000] transition-colors">
            Dados Pessoais
          </h3>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Atualize seus dados cadastrais, e-mail e telefone.
          </p>
        </Link>
      </div>

      {/* Último Pedido em Andamento */}
      {recentOrder && (
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8CF000]" />
              <h3 className="text-sm font-bold text-white">Último Pedido Realizado</h3>
            </div>
            <Link
              href={`/conta/pedidos/${recentOrder.id}`}
              className="text-xs font-semibold text-[#8CF000] hover:underline flex items-center gap-1"
            >
              <span>Ver Detalhes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#A3A3A3]">Número:</span>
              <p className="text-sm font-bold text-white">#{recentOrder.orderNumber}</p>
              <span className="text-[11px] text-[#737373]">
                {formatDate(recentOrder.createdAt)} • {recentOrder.items.length} itens
              </span>
            </div>

            <div>
              <span className="text-xs text-[#A3A3A3]">Total:</span>
              <p className="text-sm font-bold text-white">{formatCurrency(recentOrder.total)}</p>
            </div>

            <div>
              <span className="text-xs text-[#A3A3A3] block mb-1">Status:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8CF000]/10 text-[#8CF000] border border-[#8CF000]/30">
                {recentOrder.status === 'IN_TRANSIT'
                  ? 'Em transporte'
                  : recentOrder.status === 'PAID'
                  ? 'Pagamento aprovado'
                  : recentOrder.status === 'DELIVERED'
                  ? 'Entregue'
                  : 'Processando'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

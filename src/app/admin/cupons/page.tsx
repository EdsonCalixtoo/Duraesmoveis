import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Cupons de Desconto"
        subtitle="Crie códigos promocionais percentuais ou com valores fixos para impulsionar conversões."
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {coupons.map((coup) => (
            <div
              key={coup.id}
              className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000]/60 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-[#8CF000] bg-[#8CF000]/10 border border-[#8CF000]/30 px-3 py-1 rounded-lg">
                  {coup.code}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    coup.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {coup.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <p className="text-xs text-[#A3A3A3]">{coup.description || 'Desconto no carrinho'}</p>

              <div className="pt-2 border-t border-[#222222] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#737373]">Desconto:</span>
                  <strong className="text-white">
                    {coup.discountType === 'PERCENTAGE'
                      ? `${coup.discountValue}% OFF`
                      : formatCurrency(coup.discountValue)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Valor mínimo:</span>
                  <span className="text-white">{formatCurrency(coup.minOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Usos:</span>
                  <span className="text-[#8CF000] font-bold">{coup.currentUses} utilizados</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

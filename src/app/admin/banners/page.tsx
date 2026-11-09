import React from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Banners da Página Inicial"
        subtitle="Gerencie as campanhas em destaque e fotos principais do carrossel da Home."
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden space-y-4 p-4"
            >
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-900 border border-[#2A2A2A]">
                <Image src={b.imageUrl} alt={b.title} fill className="object-cover" sizes="600px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-sm font-bold text-white">
                    {b.title} <span className="text-[#8CF000]">{b.highlightText}</span>
                  </h3>
                </div>
              </div>

              <div className="text-xs text-[#A3A3A3] space-y-1">
                <p>{b.subtitle}</p>
                <div className="pt-2 flex justify-between text-[#737373] text-[11px]">
                  <span>Botão: {b.buttonText}</span>
                  <span>Link: {b.buttonLink}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

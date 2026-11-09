import React from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Categorias"
        subtitle="Gerencie as categorias de produtos exibidas na navegação e catálogo."
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden p-4 flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-[#2E2E2E] flex-shrink-0">
                <Image
                  src={c.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                  alt={c.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{c.name}</h3>
                <span className="text-[11px] text-[#8CF000] font-semibold block">
                  {c._count.products} produtos cadastrados
                </span>
                <span className="text-[10px] text-[#737373]">slug: /{c.slug}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

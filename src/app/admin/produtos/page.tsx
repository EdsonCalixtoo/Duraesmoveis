import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { Plus, Search, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AdminProductActions from './AdminProductActions';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q || '';

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { sku: { contains: q } },
          ],
        }
      : {},
    orderBy: { createdAt: 'desc' },
    include: {
      images: { where: { isCover: true }, take: 1 },
      category: true,
    },
  });

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Gerenciar Produtos"
        subtitle="Cadastre novos móveis, gerencie estoques e controle variações de acabamento."
      />

      <div className="px-6 sm:px-8 space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <form className="relative w-full sm:w-80">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Buscar por nome ou SKU..."
              className="w-full bg-[#141414] border border-[#2B2B2B] rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-[#737373] focus:border-[#8CF000]"
            />
            <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <Link
            href="/admin/produtos/novo"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lime-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181818] text-[#737373] uppercase text-[10px] border-b border-[#242424]">
                <tr>
                  <th className="py-3.5 px-4">Produto</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Estoque</th>
                  <th className="py-3.5 px-4">Preço</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {products.map((p) => {
                  const coverImg =
                    p.images[0]?.url ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80';

                  return (
                    <tr key={p.id} className="hover:bg-[#191919] transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#0A0A0A] border border-[#2E2E2E] flex-shrink-0">
                          <Image src={coverImg} alt={p.name} fill className="object-cover" sizes="44px" />
                        </div>
                        <div>
                          <span className="font-bold text-white block truncate max-w-xs">{p.name}</span>
                          <span className="text-[10px] text-[#737373]">/{p.slug}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#A3A3A3]">{p.sku}</td>
                      <td className="py-3 px-4 text-[#A3A3A3]">{p.category?.name || 'Móveis'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            p.stock > 5 ? 'text-white' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                          }`}
                        >
                          {p.stock} un
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">{formatCurrency(p.price)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.active
                              ? 'bg-[#8CF000]/10 text-[#8CF000] border border-[#8CF000]/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {p.active ? 'Ativo' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <AdminProductActions productId={p.id} productName={p.name} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

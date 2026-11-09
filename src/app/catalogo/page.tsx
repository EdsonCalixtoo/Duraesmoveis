import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/common/ProductCard';
import { ProductItem } from '@/types';
import CatalogFilters from '@/components/catalog/CatalogFilters';

interface CatalogPageProps {
  searchParams: {
    categoria?: string;
    q?: string;
    sort?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    promo?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { categoria, q, sort, material, minPrice, maxPrice, promo } = searchParams;

  // Build where filter
  const where: Record<string, unknown> = {
    active: true,
  };

  if (categoria) {
    where.category = { slug: categoria };
  }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { materials: { contains: q } },
    ];
  }

  if (promo === 'true') {
    where.discountPercent = { gt: 0 };
  }

  if (material) {
    where.materials = { contains: material };
  }

  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
      ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
    };
  }

  // Build order by
  let orderBy: Record<string, 'asc' | 'desc'> = { reviewsCount: 'desc' };
  if (sort === 'menor-preco') orderBy = { price: 'asc' };
  else if (sort === 'maior-preco') orderBy = { price: 'desc' };
  else if (sort === 'mais-novos') orderBy = { createdAt: 'desc' };
  else if (sort === 'maior-desconto') orderBy = { discountPercent: 'desc' };

  const [products, categories, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
        category: true,
      },
    }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.product.count({ where }),
  ]);

  const selectedCategory = categories.find((c) => c.slug === categoria);
  const title = selectedCategory ? selectedCategory.name : q ? `Resultados para "${q}"` : 'Todos os Produtos';

  return (
    <div className="min-h-screen bg-[#080808] py-8 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#A3A3A3] mb-6">
          <Link href="/" className="hover:text-[#8CF000] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <Link href="/catalogo" className="hover:text-[#8CF000] transition-colors">
            Catálogo
          </Link>
          {selectedCategory && (
            <>
              <span>&gt;</span>
              <span className="text-white font-medium">{selectedCategory.name}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#202020]">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {title}{' '}
              <span className="text-sm md:text-base font-normal text-[#A3A3A3]">
                ({totalCount} {totalCount === 1 ? 'produto' : 'produtos'})
              </span>
            </h1>
            {selectedCategory?.description && (
              <p className="text-xs md:text-sm text-[#8E8E8E] mt-1 max-w-2xl">
                {selectedCategory.description}
              </p>
            )}
          </div>

          {/* Interactive Filters & Sort component */}
          <CatalogFilters
            currentCategory={categoria}
            currentSort={sort || 'mais-vendidos'}
            categories={categories}
          />
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-20 text-center bg-[#111111] rounded-2xl border border-[#2B2B2B] max-w-lg mx-auto p-8">
            <h3 className="text-lg font-bold text-white mb-2">Nenhum produto encontrado</h3>
            <p className="text-xs text-[#A3A3A3] mb-6">
              Tente alterar os filtros aplicados ou buscar por outro termo.
            </p>
            <Link
              href="/catalogo"
              className="px-5 py-2.5 rounded-xl bg-[#8CF000] text-black font-semibold text-xs hover:bg-[#A3FF12] transition-colors"
            >
              Limpar Filtros
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod as unknown as ProductItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

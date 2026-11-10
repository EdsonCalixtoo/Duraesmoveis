import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import ProductCard from '@/components/common/ProductCard';
import { ProductItem } from '@/types';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) return { title: 'Produto Não Encontrado — Durães Móveis' };

  return {
    title: `${product.name} — Durães Móveis`,
    description: product.shortDescription || product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      variants: { orderBy: { priceAdjustment: 'asc' } },
      category: true,
      reviews: { where: { active: true }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true,
    },
    take: 4,
    include: {
      images: true,
      variants: true,
      category: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#080808] py-8 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#A3A3A3] mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#8CF000] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <Link href="/catalogo" className="hover:text-[#8CF000] transition-colors">
            Catálogo
          </Link>
          <span>&gt;</span>
          <Link
            href={`/categoria/${product.category.slug}`}
            className="hover:text-[#8CF000] transition-colors"
          >
            {product.category.name}
          </Link>
          <span>&gt;</span>
          <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <ProductDetailClient product={product as unknown as ProductItem} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#202020]">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-6 rounded-full bg-[#8CF000]" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Quem viu este, também comprou
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as unknown as ProductItem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

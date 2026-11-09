import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductItem } from '@/types';
import ProductCard from '@/components/common/ProductCard';

export default function BestSellers({ products }: { products: ProductItem[] }) {
  return (
    <section className="py-16 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-[#8CF000]" />
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Mais Vendidos
            </h2>
          </div>

          <Link
            href="/catalogo"
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#8CF000] hover:text-[#A3FF12] transition-colors"
          >
            <span>Ver todos os produtos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.slice(0, 5).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

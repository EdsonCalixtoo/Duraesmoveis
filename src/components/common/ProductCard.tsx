'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { ProductItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ProductItem;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const favorited = isFavorite(product.slug);
  const coverImage =
    product.images?.find((img) => img.isCover)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      image: coverImage,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      maxStock: product.stock,
      quantity: 1,
    });

    toast.success(`${product.name} adicionado ao carrinho!`, {
      description: 'Pronto para finalizar sua compra.',
    });
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.slug);
    if (!favorited) {
      toast.success('Adicionado aos favoritos!');
    } else {
      toast.info('Removido dos favoritos.');
    }
  };

  return (
    <div
      className={`group relative bg-[#1C1C1C] border border-[#303030] hover:border-[#8CF000]/60 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-card-elevation ${className}`}
    >
      {/* Top Media Container */}
      <div className="relative w-full aspect-square bg-[#121212] overflow-hidden">
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-[#8CF000] text-black text-xs font-black px-2.5 py-1 rounded-md shadow-md">
            -{product.discountPercent}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFav}
          aria-label="Adicionar aos favoritos"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-[#353535] flex items-center justify-center text-white hover:text-[#8CF000] hover:border-[#8CF000] transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              favorited ? 'fill-[#8CF000] text-[#8CF000]' : 'text-white'
            }`}
          />
        </button>

        {/* Product Image */}
        <Link href={`/produto/${product.slug}`} className="block w-full h-full">
          <Image
            src={coverImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Title */}
          <Link href={`/produto/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-white group-hover:text-[#8CF000] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#A3A3A3]">({product.reviewsCount || 0})</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-end justify-between pt-2 border-t border-[#262626]">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-[#737373] line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-base font-bold text-white tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Quick Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            aria-label="Comprar produto"
            className="w-9 h-9 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black flex items-center justify-center transition-all shadow-md active:scale-95 group/btn"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
}

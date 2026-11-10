'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
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
    '/images/prod-sofa-riviera.jpg';

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
    <motion.div
      whileHover={{ y: -6, borderColor: 'rgba(140, 240, 0, 0.7)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group relative bg-[#1C1C1C] border border-[#303030] rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.7),0_0_15px_rgba(140,240,0,0.18)] ${className}`}
    >
      {/* Top Media Container */}
      <div className="relative w-full aspect-square bg-[#121212] overflow-hidden">
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 left-3 z-10 bg-[#8CF000] text-black text-xs font-black px-2.5 py-1 rounded-md shadow-md pointer-events-none"
          >
            -{product.discountPercent}%
          </motion.div>
        )}

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.15, borderColor: '#8CF000' }}
          whileTap={{ scale: 0.85 }}
          onClick={handleToggleFav}
          aria-label="Adicionar aos favoritos"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-[#353535] flex items-center justify-center text-white hover:text-[#8CF000] transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              favorited ? 'fill-[#8CF000] text-[#8CF000]' : 'text-white'
            }`}
          />
        </motion.button>

        {/* Product Image */}
        <Link href={`/produto/${product.slug}`} className="block w-full h-full">
          <Image
            src={coverImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
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
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#A3FF12' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            aria-label={`Comprar ${product.name}`}
            className="w-10 h-10 rounded-xl bg-[#8CF000] text-black flex items-center justify-center transition-shadow shadow-[0_0_12px_rgba(140,240,0,0.3)] hover:shadow-[0_0_18px_rgba(140,240,0,0.6)]"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

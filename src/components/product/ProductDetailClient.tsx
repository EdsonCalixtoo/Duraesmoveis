'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Zap, Star, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductItem, ProductVariantItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import ProductGallery from './ProductGallery';
import ProductShippingBox from './ProductShippingBox';
import ProductTabs from './ProductTabs';
import { toast } from 'sonner';

export default function ProductDetailClient({ product }: { product: ProductItem }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantItem | null>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  const favorited = isFavorite(product.slug);

  const currentPrice = selectedVariant
    ? product.price + (selectedVariant.priceAdjustment || 0)
    : product.price;

  const installmentValue = currentPrice / 12;
  const pixPrice = currentPrice * 0.95;

  const coverImage =
    product.images?.find((img) => img.isCover)?.url ||
    product.images?.[0]?.url ||
    '/images/prod-sofa-riviera.jpg';

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant ? `Cor: ${selectedVariant.colorName}` : undefined,
      colorName: selectedVariant?.colorName,
      colorHex: selectedVariant?.colorHex,
      name: product.name,
      slug: product.slug,
      sku: selectedVariant?.sku || product.sku,
      image: coverImage,
      price: currentPrice,
      originalPrice: product.originalPrice || undefined,
      maxStock: selectedVariant?.stock || product.stock,
      quantity,
    });

    toast.success('Produto adicionado ao seu carrinho!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div>
      {/* 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Purchase Info & Customization (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Reviews */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-white">
                {product.rating || 4.9}
              </span>
              <span className="text-xs text-[#A3A3A3]">
                ({product.reviewsCount || 92} avaliações)
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-1">
            {product.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737373] line-through">
                  De {formatCurrency(product.originalPrice)}
                </span>
                {product.discountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded bg-[#8CF000]/10 border border-[#8CF000]/30 text-[#8CF000] text-[11px] font-bold">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">
                {formatCurrency(currentPrice)}
              </span>
            </div>

            <p className="text-xs text-[#A3A3A3]">
              em até <strong className="text-white">12x de {formatCurrency(installmentValue)}</strong> sem juros
            </p>
            <p className="text-xs text-[#8CF000]">
              ou <strong>{formatCurrency(pixPrice)}</strong> à vista no Pix (5% OFF)
            </p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
            {product.shortDescription ||
              'Design sofisticado e alta resistência, pensado para ambientes externos. Combina conforto, durabilidade e elegância extrema.'}
          </p>

          {/* Color Variation Swatches */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-white">
                Cor: <strong className="text-[#8CF000]">{selectedVariant?.colorName}</strong>
              </span>

              <div className="flex items-center gap-3">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <motion.button
                      key={v.id}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedVariant(v)}
                      title={v.colorName}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-[#8CF000] ring-2 ring-[#8CF000]/30 scale-110 shadow-[0_0_12px_rgba(140,240,0,0.4)]'
                          : 'border-[#383838] hover:border-white'
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center bg-[#181818] border border-[#333333] rounded-xl px-2">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-3 text-white hover:text-[#8CF000] font-bold text-sm"
                >
                  -
                </motion.button>
                <span className="px-3 text-sm font-bold text-white">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                  className="px-3 py-3 text-white hover:text-[#8CF000] font-bold text-sm"
                >
                  +
                </motion.button>
              </div>

              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#A3FF12' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#8CF000] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(140,240,0,0.3)] hover:shadow-[0_0_22px_rgba(140,240,0,0.6)]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar ao Carrinho</span>
              </motion.button>

              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => {
                  toggleFavorite(product.slug);
                  if (!favorited) toast.success('Salvo em seus favoritos!');
                }}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                  favorited
                    ? 'bg-[#1C1C1C] border-[#8CF000] text-[#8CF000] shadow-[0_0_12px_rgba(140,240,0,0.3)]'
                    : 'bg-[#181818] border-[#333333] text-white hover:border-[#8CF000]'
                }`}
                title="Favoritar"
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-[#8CF000]' : ''}`} />
              </motion.button>
            </div>

            {/* Buy Now CTA */}
            <motion.button
              whileHover={{ scale: 1.01, borderColor: '#8CF000' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#3A3A3A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Zap className="w-4 h-4 text-[#8CF000]" />
              <span>Comprar Agora</span>
            </motion.button>
          </div>

          {/* Shipping Calculation */}
          <ProductShippingBox price={currentPrice} />

          {/* Trust Guarantees */}
          <div className="pt-2 flex items-center gap-4 text-xs text-[#8E8E8E]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8CF000]" />
              <span>Garantia de 5 anos</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#333333]" />
            <span>Troca grátis em até 30 dias</span>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <ProductTabs product={product} />
    </div>
  );
}


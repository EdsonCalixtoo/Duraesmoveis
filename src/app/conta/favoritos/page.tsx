'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface FavProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discountPercent: number;
  image: string;
  stock: number;
}

// Catálogo demonstrativo para resolver favoritos instantaneamente
const CATALOG_ITEMS: FavProduct[] = [
  {
    id: 'sofa-riviera',
    name: 'Sofá Externo Riviera',
    slug: 'sofa-externo-riviera-3-lugares',
    sku: 'SOF-RIV-003',
    price: 5391.0,
    originalPrice: 5990.0,
    discountPercent: 10,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    stock: 14,
  },
  {
    id: 'poltrona-trancada',
    name: 'Poltrona Trançada',
    slug: 'poltrona-de-fibra-sintetica-premium',
    sku: 'POL-FIB-001',
    price: 1499.0,
    originalPrice: 1799.0,
    discountPercent: 15,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    stock: 20,
  },
  {
    id: 'espreguicadeira-mare',
    name: 'Espreguiçadeira Maré',
    slug: 'espreguicadeira-aluminio-com-tela-sling',
    sku: 'ESP-SLI-001',
    price: 1490.0,
    originalPrice: 1990.0,
    discountPercent: 25,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    stock: 16,
  },
];

export default function CustomerFavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Filtrar itens favoritos ou exibir os 3 modelos representativos do card 09
  const favoritedProducts = CATALOG_ITEMS.filter((item) =>
    favoriteIds.includes(item.slug) || favoriteIds.includes(item.id) || favoriteIds.length === 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Meus Favoritos{' '}
            <span className="text-sm font-normal text-[#A3A3A3]">
              ({favoritedProducts.length} itens)
            </span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Móveis que você marcou com coração para acompanhar preços e comprar depois.
          </p>
        </div>
      </div>

      {favoritedProducts.length === 0 ? (
        <div className="p-12 text-center bg-[#141414] rounded-2xl border border-[#2B2B2B]">
          <Heart className="w-12 h-12 text-[#737373] mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Nenhum favorito salvo</h3>
          <p className="text-xs text-[#A3A3A3] mb-6">
            Navegue pelo nosso catálogo e clique no coração para salvar seus móveis preferidos.
          </p>
          <Link
            href="/catalogo"
            className="px-6 py-2.5 rounded-xl bg-[#8CF000] text-black font-bold text-xs"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoritedProducts.map((prod) => (
            <div
              key={prod.id}
              className="group relative bg-[#1C1C1C] border border-[#2B2B2B] hover:border-[#8CF000] rounded-2xl overflow-hidden transition-all flex flex-col justify-between"
            >
              {/* Media */}
              <div className="relative aspect-square bg-[#111111] overflow-hidden">
                {prod.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-[#8CF000] text-black text-xs font-black px-2.5 py-1 rounded-md">
                    -{prod.discountPercent}%
                  </span>
                )}
                <button
                  onClick={() => {
                    toggleFavorite(prod.slug);
                    toast.info('Removido dos favoritos');
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 border border-[#3A3A3A] text-[#8CF000] flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  title="Remover dos favoritos"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link href={`/produto/${prod.slug}`} className="block w-full h-full">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="300px"
                  />
                </Link>
              </div>

              {/* Info & Action */}
              <div className="p-4 space-y-3">
                <Link href={`/produto/${prod.slug}`} className="block">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#8CF000] transition-colors truncate">
                    {prod.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-extrabold text-white">
                    {formatCurrency(prod.price)}
                  </span>

                  <button
                    onClick={() => {
                      addItem({
                        id: prod.id,
                        productId: prod.id,
                        name: prod.name,
                        slug: prod.slug,
                        sku: prod.sku,
                        image: prod.image,
                        price: prod.price,
                        originalPrice: prod.originalPrice,
                        maxStock: prod.stock,
                        quantity: 1,
                      });
                      toast.success('Adicionado ao carrinho!');
                    }}
                    className="p-2 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black transition-colors"
                    title="Adicionar ao carrinho"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

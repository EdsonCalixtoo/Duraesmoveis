'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Heart, User, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, getTotalItemsCount } = useCartStore();
  const { favoriteIds } = useFavoritesStore();

  const cartCount = getTotalItemsCount();
  const favCount = favoriteIds.length;

  // Don't show bottom nav inside checkout to avoid distractions
  if (pathname.startsWith('/checkout')) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-lg border-t border-[#252525] py-2 px-3 lg:hidden">
      <div className="flex items-center justify-around">
        <motion.div whileTap={{ scale: 0.85 }}>
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              pathname === '/' ? 'text-[#8CF000]' : 'text-[#A3A3A3]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Início</span>
          </Link>
        </motion.div>

        <motion.div whileTap={{ scale: 0.85 }}>
          <Link
            href="/catalogo"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              pathname.startsWith('/catalogo') || pathname.startsWith('/categoria')
                ? 'text-[#8CF000]'
                : 'text-[#A3A3A3]'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span>Categorias</span>
          </Link>
        </motion.div>

        <motion.div whileTap={{ scale: 0.85 }}>
          <Link
            href="/conta/favoritos"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors relative ${
              pathname.startsWith('/conta/favoritos') ? 'text-[#8CF000]' : 'text-[#A3A3A3]'
            }`}
          >
            <div className="relative">
              <Heart className="w-5 h-5" />
              <AnimatePresence>
                {favCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#8CF000] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                  >
                    {favCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span>Favoritos</span>
          </Link>
        </motion.div>

        <motion.div whileTap={{ scale: 0.85 }}>
          <Link
            href="/conta"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              pathname.startsWith('/conta') && !pathname.startsWith('/conta/favoritos')
                ? 'text-[#8CF000]'
                : 'text-[#A3A3A3]'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Conta</span>
          </Link>
        </motion.div>

        <motion.div whileTap={{ scale: 0.85 }}>
          <button
            onClick={openCart}
            className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#A3A3A3] hover:text-[#8CF000] relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#8CF000] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span>Carrinho</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

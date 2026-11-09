'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

const CATEGORIES = [
  { name: 'Sofás Externos', slug: 'sofas-externos' },
  { name: 'Poltronas', slug: 'poltronas' },
  { name: 'Mesas e Cadeiras', slug: 'mesas-e-cadeiras' },
  { name: 'Espreguiçadeiras', slug: 'espreguicadeiras' },
  { name: 'Guarda-Sóis', slug: 'guarda-sois' },
  { name: 'Acessórios', slug: 'acessorios' },
];

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const { openCart, getTotalItemsCount } = useCartStore();
  const { favoriteIds } = useFavoritesStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const cartCount = getTotalItemsCount();
  const favCount = favoriteIds.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080808]/95 backdrop-blur-md border-b border-[#202020]">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#A3A3A3]">
          <Link href="/" className="hover:text-[#8CF000] text-white transition-colors">
            Início
          </Link>

          {/* Categorias Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesDropdownOpen(true)}
            onMouseLeave={() => setCategoriesDropdownOpen(false)}
          >
            <button
              onClick={() => router.push('/catalogo')}
              className="flex items-center gap-1 hover:text-[#8CF000] transition-colors py-2"
            >
              <span>Categorias</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {categoriesDropdownOpen && (
              <div className="absolute top-full left-0 w-56 bg-[#141414] border border-[#303030] rounded-xl shadow-2xl py-2 z-50">
                <Link
                  href="/catalogo"
                  className="block px-4 py-2 text-xs font-semibold text-[#8CF000] hover:bg-[#1C1C1C]"
                >
                  Ver Todo o Catálogo &rarr;
                </Link>
                <div className="h-px bg-[#252525] my-1" />
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categoria/${cat.slug}`}
                    className="block px-4 py-2 text-xs text-white hover:text-[#8CF000] hover:bg-[#1C1C1C] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/catalogo?promo=true" className="hover:text-[#8CF000] transition-colors">
            Ofertas
          </Link>
          <Link href="/sobre" className="hover:text-[#8CF000] transition-colors">
            Sobre Nós
          </Link>
          <Link href="/contato" className="hover:text-[#8CF000] transition-colors">
            Contato
          </Link>
        </nav>

        {/* Search Bar Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center relative flex-1 max-w-xs"
        >
          <input
            type="text"
            placeholder="O que você procura?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#303030] rounded-full py-2 pl-4 pr-10 text-xs text-white placeholder-[#737373] focus:border-[#8CF000] transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 text-[#A3A3A3] hover:text-[#8CF000] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Actions (Conta, Favoritos, Carrinho) */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* User Account */}
          <Link
            href={session ? '/conta' : '/login'}
            className="p-2 rounded-xl text-[#A3A3A3] hover:text-white hover:bg-[#141414] transition-colors relative flex items-center gap-1.5"
            title={session ? `Olá, ${session.user?.name}` : 'Acessar Conta'}
          >
            <UserIcon className="w-5 h-5" />
            <span className="hidden xl:inline text-xs font-medium text-white">
              {session?.user ? session.user.name?.split(' ')[0] : 'Entrar'}
            </span>
          </Link>

          {/* Favoritos */}
          <Link
            href="/conta/favoritos"
            className="p-2 rounded-xl text-[#A3A3A3] hover:text-white hover:bg-[#141414] transition-colors relative"
            title="Meus Favoritos"
          >
            <Heart className="w-5 h-5" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8CF000] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>

          {/* Carrinho Button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-xl bg-[#1C1C1C] border border-[#303030] hover:border-[#8CF000] text-[#8CF000] hover:bg-[#252525] transition-all flex items-center gap-2"
            title="Ver Carrinho"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-[#8CF000] text-black text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-white hover:bg-[#141414] lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0D0D] border-b border-[#303030] px-4 py-6 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center relative mb-4">
            <input
              type="text"
              placeholder="O que você procura?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181818] border border-[#303030] rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder-[#737373]"
            />
            <button type="submit" className="absolute right-3 text-[#A3A3A3]">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white hover:text-[#8CF000]"
            >
              Início
            </Link>
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white hover:text-[#8CF000]"
            >
              Todos os Produtos
            </Link>
            <div className="pl-3 border-l-2 border-[#303030] space-y-1.5 py-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-[#A3A3A3] hover:text-[#8CF000]"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              href="/catalogo?promo=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#8CF000]"
            >
              Ofertas Especiais
            </Link>
            <Link
              href="/sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white hover:text-[#8CF000]"
            >
              Sobre Nós
            </Link>
            <Link
              href="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white hover:text-[#8CF000]"
            >
              Contato
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

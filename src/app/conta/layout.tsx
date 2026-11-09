'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  Package,
  Heart,
  MapPin,
  KeyRound,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';

export default function CustomerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || 'Edson Silva';
  const userAvatar =
    (session?.user as unknown as { avatarUrl?: string })?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  const menuItems = [
    { label: 'Minha Conta', href: '/conta', icon: LayoutDashboard },
    { label: 'Meus Pedidos', href: '/conta/pedidos', icon: Package },
    { label: 'Favoritos', href: '/conta/favoritos', icon: Heart },
    { label: 'Endereços', href: '/conta/enderecos', icon: MapPin },
    { label: 'Dados Pessoais', href: '/conta/dados', icon: User },
    { label: 'Alterar Senha', href: '/conta/seguranca', icon: KeyRound },
  ];

  const userRole = (session?.user as unknown as { role?: string })?.role;

  return (
    <div className="min-h-screen bg-[#080808] py-10 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Sidebar (3 Cols - Fiel à tela 07 do mockup) */}
          <aside className="lg:col-span-3 bg-[#111111] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
            {/* User Profile Header */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-[#222222]">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border-2 border-[#8CF000]/60 flex-shrink-0">
                <Image src={userAvatar} alt={userName} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-[#A3A3A3] block">Olá,</span>
                <h3 className="text-sm font-bold text-white truncate">{userName}</h3>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1 text-xs font-semibold">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/conta'
                    ? pathname === '/conta'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#1C1C1C] text-[#8CF000] border border-[#8CF000]/30 font-bold'
                        : 'text-[#A3A3A3] hover:text-white hover:bg-[#181818]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Admin Panel Link if user has role ADMIN */}
              {userRole === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-yellow-400 hover:bg-[#1C1C1C] transition-colors border border-yellow-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Painel Admin</span>
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[#A3A3A3] hover:text-red-400 hover:bg-[#181818] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </nav>
          </aside>

          {/* Customer Content Area (9 Cols) */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

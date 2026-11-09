'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PackageCheck,
  ShoppingBag,
  Layers,
  Users,
  Tag,
  Image as ImageIcon,
  BarChart3,
  Settings,
  ExternalLink,
} from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menu = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Pedidos', href: '/admin/pedidos', icon: PackageCheck },
    { label: 'Produtos', href: '/admin/produtos', icon: ShoppingBag },
    { label: 'Categorias', href: '/admin/categorias', icon: Layers },
    { label: 'Clientes', href: '/admin/clientes', icon: Users },
    { label: 'Cupons', href: '/admin/cupons', icon: Tag },
    { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { label: 'Relatórios', href: '/admin/relatorios', icon: BarChart3 },
    { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0D0D0D] border-r border-[#242424] min-h-screen flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* Brand Admin */}
        <div className="px-2 pt-2 pb-4 border-b border-[#202020]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#8CF000] text-black flex items-center justify-center font-black text-xs">
              OS
            </div>
            <div>
              <span className="font-bold text-sm text-white">OutdoorStyle</span>
              <span className="text-[10px] text-[#8CF000] block -mt-0.5 font-semibold">
                Painel Admin
              </span>
            </div>
          </div>
        </div>

        {/* Menu list */}
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#8CF000] text-black font-bold shadow-lime-sm'
                    : 'text-[#A3A3A3] hover:text-white hover:bg-[#161616]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to public store */}
      <div className="pt-4 border-t border-[#202020]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161616] hover:bg-[#1E1E1E] border border-[#2B2B2B] text-xs font-semibold text-white transition-colors"
        >
          <span>Ir para a Loja</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8CF000]" />
        </Link>
      </div>
    </aside>
  );
}

'use client';

import React from 'react';
import { Calendar, Bell, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-[#080808]/90 backdrop-blur-md border-b border-[#222222] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">{title}</h1>
        {subtitle && <p className="text-xs text-[#A3A3A3] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Date Filter (Fiel à tela 12 do mockup) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2B2B2B] text-xs text-[#C7C7C7]">
          <Calendar className="w-3.5 h-3.5 text-[#8CF000]" />
          <span>Período: <strong>Últimos 30 dias</strong></span>
        </div>

        {/* Admin profile */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#303030] flex items-center justify-center text-[#8CF000]">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white hidden md:inline">
            {session?.user?.name || 'Administrador'}
          </span>
        </div>
      </div>
    </header>
  );
}

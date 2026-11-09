import React from 'react';
import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full bg-[#141414] border border-[#2B2B2B] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <span className="text-6xl font-black text-[#8CF000]">404</span>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">Página Não Encontrada</h1>
          <p className="text-xs text-[#A3A3A3]">
            O endereço que você tentou acessar não existe ou foi movido para outro local.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8CF000] text-black font-extrabold text-xs hover:bg-[#A3FF12] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Voltar ao Início</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

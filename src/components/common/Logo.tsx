import React from 'react';
import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Ícone Estilizado da OutdoorStyle */}
      <div className="relative w-8 h-8 rounded-lg bg-[#141414] border border-[#303030] group-hover:border-[#8CF000] flex items-center justify-center transition-colors">
        <svg
          className="w-5 h-5 text-[#8CF000]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#8CF000] ring-2 ring-[#080808]" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center text-lg md:text-xl font-bold tracking-tight">
          <span className="text-white">Outdoor</span>
          <span className="text-[#8CF000]">Style</span>
        </div>
        <span className="text-[10px] text-[#A3A3A3] tracking-wide -mt-1 hidden sm:block">
          Viva o melhor do seu espaço
        </span>
      </div>
    </Link>
  );
}

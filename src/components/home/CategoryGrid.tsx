'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  {
    name: 'Poltronas',
    slug: 'poltronas',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Mesas e Cadeiras',
    slug: 'mesas-e-cadeiras',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Espreguiçadeiras',
    slug: 'espreguicadeiras',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sofás Externos',
    slug: 'sofas-externos',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Guarda-Sóis',
    slug: 'guarda-sois',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Acessórios',
    slug: 'acessorios',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 bg-[#080808] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal scroll on mobile, flex grid on desktop */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar md:justify-around">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="flex flex-col items-center gap-3 group flex-shrink-0"
            >
              {/* Circular Thumbnail Card with border glow on hover */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-[#1C1C1C] border border-[#303030] group-hover:border-[#8CF000] overflow-hidden transition-all duration-300 p-1 group-hover:shadow-lime-sm">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-900">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="120px"
                  />
                </div>
              </div>

              {/* Label */}
              <span className="text-xs sm:text-sm font-semibold text-[#D1D1D1] group-hover:text-[#8CF000] text-center transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

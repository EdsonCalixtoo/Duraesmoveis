import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function SpecialOffersBanner() {
  return (
    <section className="py-12 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#303030] p-8 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 text-xs font-semibold text-[#8CF000]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Oportunidade por Tempo Limitado</span>
              </div>

              <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Design de Luxo com até{' '}
                <span className="text-[#8CF000]">25% OFF</span>
              </h3>

              <p className="text-sm md:text-base text-[#A3A3A3] leading-relaxed max-w-lg">
                Sofás, espreguiçadeiras e conjuntos de jantar projetados para resistir ao sol escaldante, chuvas intensas e maresia com tecidos impermeáveis de alta tecnologia.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/catalogo?promo=true"
                  className="px-6 py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-sm flex items-center gap-2 transition-all shadow-lime-sm"
                >
                  <span>Aproveitar Ofertas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-xs text-[#A3A3A3] border-l border-[#353535] pl-4">
                  <span className="text-white font-bold block">Frete Grátis</span>
                  em compras acima de R$ 2.999
                </div>
              </div>
            </div>

            {/* Right Media */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-[#303030] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80"
                alt="Ambiente de Lazer Luxuoso"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

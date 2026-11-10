'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SpecialOffersBanner() {
  return (
    <section className="py-12 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#303030] p-8 md:p-14 hover:border-[#8CF000]/40 transition-colors shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6 z-10">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 text-xs font-semibold text-[#8CF000]"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Oportunidade por Tempo Limitado</span>
              </motion.div>

              <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Design de Luxo com até{' '}
                <span className="text-[#8CF000] drop-shadow-[0_2px_14px_rgba(140,240,0,0.4)]">
                  25% OFF
                </span>
              </h3>

              <p className="text-sm md:text-base text-[#A3A3A3] leading-relaxed max-w-lg">
                Sofás, espreguiçadeiras e conjuntos de jantar projetados para resistir ao sol escaldante, chuvas intensas e maresia com tecidos impermeáveis de alta tecnologia.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/catalogo?promo=true"
                    className="px-6 py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(140,240,0,0.35)] hover:shadow-[0_0_22px_rgba(140,240,0,0.6)]"
                  >
                    <span>Aproveitar Ofertas</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <div className="text-xs text-[#A3A3A3] border-l border-[#353535] pl-4">
                  <span className="text-white font-bold block">Frete Grátis</span>
                  em compras acima de R$ 2.999
                </div>
              </div>
            </div>

            {/* Right Media */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-[#303030] shadow-2xl group"
            >
              <Image
                src="/images/hero-luxury-patio-uhd.jpg"
                alt="Ambiente de Lazer Luxuoso Outdoor"
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

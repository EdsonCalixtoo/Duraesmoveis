'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    name: 'Poltronas',
    slug: 'poltronas',
    imageUrl: '/images/cat-poltronas.jpg',
  },
  {
    name: 'Mesas e Cadeiras',
    slug: 'mesas-e-cadeiras',
    imageUrl: '/images/cat-mesas-cadeiras.jpg',
  },
  {
    name: 'Espreguiçadeiras',
    slug: 'espreguicadeiras',
    imageUrl: '/images/cat-espreguicadeiras.jpg',
  },
  {
    name: 'Sofás Externos',
    slug: 'sofas-externos',
    imageUrl: '/images/cat-sofas-externos.jpg',
  },
  {
    name: 'Guarda-Sóis',
    slug: 'guarda-sois',
    imageUrl: '/images/cat-guarda-sois.jpg',
  },
  {
    name: 'Acessórios',
    slug: 'acessorios',
    imageUrl: '/images/cat-acessorios.jpg',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CategoryGrid() {
  return (
    <section className="pt-3 pb-8 md:py-12 bg-[#080808] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal scroll on mobile, flex grid on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="flex items-center justify-between gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar md:justify-around"
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.slug}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link
                href={`/categoria/${cat.slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                {/* Rounded Thumbnail Card with lime border glow on hover */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-[#1C1C1C] border border-[#303030] group-hover:border-[#8CF000] overflow-hidden transition-all duration-300 p-1 group-hover:shadow-[0_0_18px_rgba(140,240,0,0.35)]">
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

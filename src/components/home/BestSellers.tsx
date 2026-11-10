'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductItem } from '@/types';
import ProductCard from '@/components/common/ProductCard';

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
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function BestSellers({ products }: { products: ProductItem[] }) {
  return (
    <section className="py-16 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-[#8CF000]" />
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Mais Vendidos
            </h2>
          </div>

          <Link
            href="/catalogo"
            className="group flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#8CF000] hover:text-[#A3FF12] transition-colors"
          >
            <span>Ver todos os produtos</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {products.slice(0, 5).map((prod) => (
            <motion.div key={prod.id} variants={itemVariants}>
              <ProductCard product={prod} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

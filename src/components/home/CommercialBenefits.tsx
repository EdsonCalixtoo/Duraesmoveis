'use client';

import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: Truck,
    title: 'Entrega Rápida',
    subtitle: 'para todo o Brasil',
  },
  {
    icon: ShieldCheck,
    title: 'Compra 100% Segura',
    subtitle: 'seus dados protegidos',
  },
  {
    icon: CreditCard,
    title: 'Pagamento Facilitado',
    subtitle: 'em até 12x no cartão',
  },
  {
    icon: Headphones,
    title: 'Suporte Especializado',
    subtitle: 'pronto para te atender',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CommercialBenefits() {
  return (
    <section className="py-8 bg-[#0D0D0D] border-y border-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: '#8CF000' }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#141414] border border-[#252525] transition-all duration-300 group cursor-default shadow-sm hover:shadow-[0_0_15px_rgba(140,240,0,0.12)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#303030] group-hover:border-[#8CF000]/60 flex items-center justify-center text-[#8CF000] flex-shrink-0 transition-colors">
                  <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#8CF000] transition-colors">
                    {b.title}
                  </h4>
                  <p className="text-xs text-[#8E8E8E]">{b.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

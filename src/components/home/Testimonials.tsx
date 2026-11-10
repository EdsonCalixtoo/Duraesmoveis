'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    id: 1,
    name: 'Carolina Mendonça',
    location: 'São Paulo - SP',
    comment: 'Adquiri o conjunto de sofá Riviera para o terraço da nossa cobertura. A elegância é incomparável e a corda náutica suportou tempestades sem qualquer sinal de desgaste.',
    product: 'Sofá Externo Riviera 3 Lugares',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    name: 'Rodrigo Siqueira',
    location: 'Campinas - SP',
    comment: 'O atendimento da equipe Durães Móveis superou todas as expectativas. A entrega própria veio agendada no horário certo e o sofá já veio montado e posicionado no jardim.',
    product: 'Sofá Modular Cayenne 4 Lugares',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 3,
    name: 'Beatriz Fonseca',
    location: 'Rio de Janeiro - RJ',
    comment: 'Moro de frente para o mar e sofria com móveis de ferro oxidando. Os móveis em alumínio naval da Durães Móveis continuam brilhando como no primeiro dia. Recomendo muito!',
    product: 'Espreguiçadeira Alumínio Tela Sling',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Testimonials() {
  return (
    <section className="py-16 bg-[#080808] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-xl mx-auto mb-12 space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8CF000] uppercase tracking-wider">
            <span>Avaliações Reais</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            O que nossos clientes dizem
          </h2>
          <p className="text-xs md:text-sm text-[#A3A3A3]">
            Mais de 10.000 ambientes externos transformados com sofisticação em todo o Brasil.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {REVIEWS.map((rev) => (
            <motion.div
              key={rev.id}
              variants={itemVariants}
              whileHover={{ y: -6, borderColor: 'rgba(140, 240, 0, 0.5)' }}
              transition={{ duration: 0.25 }}
              className="bg-[#141414] border border-[#2B2B2B] p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-colors shadow-sm hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)]"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-[#D1D1D1] italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#222222] flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800 border border-[#353535]">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-[11px] text-[#737373]">{rev.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

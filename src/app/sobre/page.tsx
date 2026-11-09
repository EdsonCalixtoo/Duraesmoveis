import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Compass, Leaf, Award, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Sobre Nós — OutdoorStyle',
  description: 'Conheça a história e os pilares de qualidade da OutdoorStyle.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080808] py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* Hero Section (Fiel à tela 10 do mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111111] border border-[#2B2B2B] rounded-3xl p-6 sm:p-12 overflow-hidden">
          {/* Left Media */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#2B2B2B] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Sobre a OutdoorStyle Móveis de Alto Padrão"
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 text-xs font-bold text-[#8CF000]">
              <Award className="w-3.5 h-3.5" />
              <span>Referência em Mobiliário Externo</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Sobre a OutdoorStyle
            </h1>

            <p className="text-sm sm:text-base text-[#D1D1D1] leading-relaxed">
              Somos especialistas em móveis para áreas externas, unindo design autoral contemporâneo, conforto absoluto, matérias-primas nobres e máxima durabilidade para áreas gourmet, piscinas, jardins e terraços.
            </p>

            <p className="text-xs sm:text-sm text-[#8E8E8E] leading-relaxed">
              Nossa missão é transformar ambientes ao ar livre em verdadeiros refúgios de descanso e convivência. Trabalhamos lado a lado com arquitetos, paisagistas e clientes exigentes em todo o Brasil.
            </p>
          </div>
        </div>

        {/* 3 Pillars (Fiel à tela 10 do mockup) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000]/60 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-[#8CF000]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Qualidade</h3>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
              Materiais de alta resistência contra sol escaldante, umidade, chuvas fortes e maresia constante. Alumínio estrutural com 5 anos de garantia de fábrica.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000]/60 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-[#8CF000]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Design</h3>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
              Sofisticação e estilo único com tramas artesanais em corda náutica desenvolvidas manualmente por mestres artesãos brasileiros.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000]/60 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-[#8CF000]">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Sustentabilidade</h3>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
              Compromisso genuíno com o meio ambiente. Todas as madeiras utilizadas possuem certificação internacional de manejo sustentável FSC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

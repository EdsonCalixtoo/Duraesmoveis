'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Os móveis podem ficar expostos a sol e chuva direto sem estragar?',
    a: 'Sim! Nossos móveis são projetados com alumínio nobre com pintura eletrostática à base de pó poliéster e cordas sintéticas tratadas contra raios UV. As espumas internas contam com drenagem e os tecidos possuem impermeabilização náutica.',
  },
  {
    q: 'Como funciona o cálculo do frete para móveis de grande porte?',
    a: 'Móveis volumosos como sofás e mesas de 6 a 8 lugares são transportados por frotas especializadas em carga acolchoada. Oferecemos Frete Grátis Especial para todo o Brasil em compras acima de R$ 2.999,00.',
  },
  {
    q: 'Os produtos chegam montados?',
    a: 'A maioria dos nossos sofás, poltronas e espreguiçadeiras é entregue 100% montada e pronta para uso. Mesas de jantar possuem tampos e pés que acompanham manual de fixação simples de 4 parafusos.',
  },
  {
    q: 'Como é feita a limpeza da corda náutica e dos tecidos impermeáveis?',
    a: 'Recomenda-se lavar com água corrente, esponja macia e detergente neutro. Nunca utilize produtos abrasivos, alvejantes ou solventes fortes.',
  },
  {
    q: 'Qual o prazo de garantia oferecido pela OutdoorStyle?',
    a: 'Oferecemos 5 anos de garantia estrutural para toda a nossa linha em alumínio naval e 1 ano para os tecidos e acabamentos.',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#080808] py-14 text-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1C] border border-[#303030] text-xs font-bold text-[#8CF000]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Central de Ajuda</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Perguntas Frequentes
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">
            Tire suas principais dúvidas sobre cuidados, materiais, prazos de entrega e garantias.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-[#8CF000] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8CF000] transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#A3A3A3] leading-relaxed border-t border-[#1F1F1F] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

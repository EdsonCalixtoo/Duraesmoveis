import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';

export default function CommercialBenefits() {
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

  return (
    <section className="py-8 bg-[#0D0D0D] border-y border-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#141414] border border-[#252525] hover:border-[#333333] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#303030] flex items-center justify-center text-[#8CF000] flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{b.title}</h4>
                  <p className="text-xs text-[#8E8E8E]">{b.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

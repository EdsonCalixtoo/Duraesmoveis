'use client';

import React from 'react';
import { Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function TopBenefitBar() {
  return (
    <div className="w-full bg-[#050505] border-b border-[#202020] text-xs py-2 text-[#A3A3A3] hidden md:block">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#8CF000]" />
          <span>Entrega para todo o Brasil</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8CF000]" />
          <span>Compra 100% Segura com Certificado SSL</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 text-[#8CF000]" />
          <span>Pagamento Facilitado em até 12x</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#8CF000]" />
          <span>5% de desconto à vista no Pix</span>
        </div>
      </div>
    </div>
  );
}

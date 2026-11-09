'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Informe um e-mail válido');
      return;
    }
    setSubmitted(true);
    toast.success('Cupom BEMVINDO10 liberado para sua compra!');
  };

  return (
    <section className="py-14 bg-[#111111] border-y border-[#262626]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1C] border border-[#353535] text-xs text-[#8CF000] mb-4">
          <Mail className="w-3.5 h-3.5" />
          <span>Clube Exclusivo OutdoorStyle</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Cadastre-se e ganhe <span className="text-[#8CF000]">10% de Desconto</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-md mx-auto mb-6">
          Receba tendências de arquitetura externa, lançamentos exclusivos e ofertas antecipadas direto na sua caixa de entrada.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 p-3.5 rounded-xl bg-[#1C1C1C] border border-[#8CF000]/40 text-sm text-white">
            <CheckCircle2 className="w-5 h-5 text-[#8CF000]" />
            <span>Obrigado! Use o cupom <strong>BEMVINDO10</strong> no checkout.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-[#1C1C1C] border border-[#353535] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#737373] focus:border-[#8CF000]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-xs sm:text-sm transition-colors shadow-sm"
            >
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

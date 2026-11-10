import React from 'react';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#080808] py-14 text-white">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-white">Termos de Uso</h1>
        <p className="text-xs text-[#A3A3A3]">Última atualização: 08 de Novembro de 2026</p>

        <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-6 text-xs sm:text-sm text-[#C7C7C7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Objeto</h2>
            <p>
              Estes termos regulam a aquisição de mobiliário e peças de decoração comercializados através da plataforma e-commerce Durães Móveis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Preços e Pagamentos</h2>
            <p>
              Os preços expostos no site são em Reais (BRL) e podem sofrer alterações sem aviso prévio. Pagamentos à vista via Pix possuem 5% de desconto automático calculado no carrinho e checkout. Cartões de crédito podem ser parcelados em até 12 parcelas sem juros.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo visual, fotografias de produtos, marcas, logotipos e textos pertencem exclusivamente à Durães Móveis.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

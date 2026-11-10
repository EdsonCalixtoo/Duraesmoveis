import React from 'react';

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080808] py-14 text-white">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-white">Trocas e Devoluções</h1>

        <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-6 text-xs sm:text-sm text-[#C7C7C7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Direito de Arrependimento (7 Dias)</h2>
            <p>
              Conforme o Artigo 49 do Código de Defesa do Consumidor, você possui até 7 (sete) dias corridos após o recebimento da mercadoria para solicitar a devolução e reembolso integral do valor pago.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Garantia de Fábrica de 5 Anos</h2>
            <p>
              Toda a linha em alumínio estrutural possui 5 anos de garantia contra oxidação, corrosão e defeitos de solda ou pintura eletrostática. Cordas náuticas e tecidos possuem 1 ano de garantia contra esgarçamento e defeitos de costura.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Procedimento de Coleta</h2>
            <p>
              Em caso de devolução ou troca por garantia, a Durães Móveis envia a transportadora diretamente ao seu endereço para realizar a coleta do móvel sem qualquer custo adicional para você.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

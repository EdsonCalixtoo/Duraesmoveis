import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080808] py-14 text-white">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-white">Política de Entrega</h1>

        <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-6 text-xs sm:text-sm text-[#C7C7C7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Transportadoras Especializadas</h2>
            <p>
              Devido às dimensões e alto padrão de acabamento dos móveis de área externa, nossos envios são operados por transportadoras especializadas com frotas de caminhões baú acolchoados e equipe treinada para manuseio cuidadoso.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Prazos e Rastreamento</h2>
            <p>
              Os prazos variam entre 3 a 10 dias úteis dependendo da região do país. Logo após a emissão da Nota Fiscal Eletrônica, o código de rastreamento é disponibilizado na Área do Cliente e enviado por e-mail e WhatsApp.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Frete Grátis</h2>
            <p>
              Compras com valor subtotal a partir de R$ 2.999,00 contam com Frete Grátis Especial para os principais centros urbanos e capitais do Brasil.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

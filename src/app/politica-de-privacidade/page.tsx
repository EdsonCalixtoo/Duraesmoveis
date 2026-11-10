import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080808] py-14 text-white">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-black text-white">Política de Privacidade & LGPD</h1>
        <p className="text-xs text-[#A3A3A3]">Última atualização: 08 de Novembro de 2026</p>

        <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-6 text-xs sm:text-sm text-[#C7C7C7] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Informações Gerais</h2>
            <p>
              A Durães Móveis LTDA respeita a sua privacidade e cumpre integralmente as disposições da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD). Este documento explica de forma clara e transparente como tratamos seus dados pessoais.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Dados Coletados</h2>
            <p>
              Coletamos informações cadastrais básicas necessárias para a celebração da compra e emissão de notas fiscais: nome completo, endereço de entrega, telefone, e-mail e CPF. Informações de pagamento via cartão de crédito são tokenizadas de forma criptografada pelo gateway certificado PCI-DSS do Mercado Pago.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Seus Direitos</h2>
            <p>
              Você pode a qualquer momento solicitar a confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou a exclusão de seus dados pessoais através do canal oficial <strong>contato@duraesmoveis.com.br</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

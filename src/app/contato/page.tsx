'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Dúvida sobre produtos');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Mensagem enviada com sucesso! Responderemos em até 2 horas úteis.');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#080808] py-12 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Contact Container Grid (Fiel à tela 11 do mockup) */}
        <div className="bg-[#111111] border border-[#2B2B2B] rounded-3xl p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start shadow-2xl">
          {/* Left Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 text-xs font-bold text-[#8CF000] mb-3">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Atendimento Consultivo</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Fale com a gente
              </h1>
              <p className="text-xs sm:text-sm text-[#A3A3A3] mt-2 leading-relaxed">
                Tire suas dúvidas, solicite um orçamento personalizado para seu projeto ou envie uma mensagem para nossa equipe.
              </p>
            </div>

            {/* Canais de Comunicação */}
            <div className="space-y-4">
              <a
                href="https://wa.me/551940001234"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#161616] border border-[#2B2B2B] hover:border-[#8CF000] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#8CF000] group-hover:scale-105 transition-transform flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#A3A3A3] block">WhatsApp / Central</span>
                  <strong className="text-sm font-bold text-white group-hover:text-[#8CF000]">
                    (19) 4000-1234
                  </strong>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#161616] border border-[#2B2B2B]">
                <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#8CF000] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#A3A3A3] block">E-mail Comercial</span>
                  <strong className="text-sm font-bold text-white">
                    contato@duraesmoveis.com.br
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#161616] border border-[#2B2B2B]">
                <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] flex items-center justify-center text-[#8CF000] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#A3A3A3] block">Showroom e Escritório</span>
                  <strong className="text-sm font-bold text-white leading-snug block">
                    Av. Norte-Sul, 1234 - Taquaral<br />
                    Campinas - SP
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column (7 Cols) */}
          <div className="lg:col-span-7 bg-[#161616] border border-[#2B2B2B] rounded-2xl p-6 sm:p-8">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 flex items-center justify-center text-[#8CF000] mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Mensagem Recebida!</h3>
                <p className="text-xs text-[#A3A3A3] max-w-sm mx-auto">
                  Agradecemos seu contato. Um consultor especialista da Durães Móveis retornará em breve no seu e-mail ou WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#303030] hover:border-[#8CF000] text-xs font-semibold text-white"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A3A3A3]">Seu nome *</label>
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:border-[#8CF000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A3A3A3]">Seu e-mail *</label>
                  <input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:border-[#8CF000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A3A3A3]">Assunto</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:border-[#8CF000]"
                  >
                    <option value="Dúvida sobre produtos">Dúvida sobre produtos</option>
                    <option value="Orçamento para Projeto de Arquitetura">Orçamento para Projeto de Arquitetura</option>
                    <option value="Status de Pedido e Rastreio">Status de Pedido e Rastreio</option>
                    <option value="Parcerias e Revenda">Parcerias e Revenda</option>
                    <option value="Outro assunto">Outro assunto</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A3A3A3]">Mensagem *</label>
                  <textarea
                    rows={4}
                    placeholder="Como podemos te ajudar hoje?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl p-4 text-xs sm:text-sm text-white focus:border-[#8CF000]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lime-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <span>Enviar Mensagem</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Headphones, MessageSquare } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-[#202020] text-[#A3A3A3] pt-16 pb-24 lg:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-xs text-[#8E8E8E] leading-relaxed max-w-sm mt-3">
              Móveis externos com design sofisticado, alta resistência contra sol, chuva e maresia. Especialistas em criar ambientes confortáveis, contemporâneos e inesquecíveis.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-white bg-[#141414] px-3 py-1.5 rounded-lg border border-[#2B2B2B]">
                <ShieldCheck className="w-4 h-4 text-[#8CF000]" />
                <span>5 Anos de Garantia</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white bg-[#141414] px-3 py-1.5 rounded-lg border border-[#2B2B2B]">
                <Lock className="w-4 h-4 text-[#8CF000]" />
                <span>Compra Protegida</span>
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Categorias</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categoria/sofas-externos" className="hover:text-[#8CF000] transition-colors">
                  Sofás Externos
                </Link>
              </li>
              <li>
                <Link href="/categoria/poltronas" className="hover:text-[#8CF000] transition-colors">
                  Poltronas
                </Link>
              </li>
              <li>
                <Link href="/categoria/mesas-e-cadeiras" className="hover:text-[#8CF000] transition-colors">
                  Mesas e Cadeiras
                </Link>
              </li>
              <li>
                <Link href="/categoria/espreguicadeiras" className="hover:text-[#8CF000] transition-colors">
                  Espreguiçadeiras
                </Link>
              </li>
              <li>
                <Link href="/categoria/guarda-sois" className="hover:text-[#8CF000] transition-colors">
                  Guarda-Sóis
                </Link>
              </li>
              <li>
                <Link href="/categoria/acessorios" className="hover:text-[#8CF000] transition-colors">
                  Acessórios e Capas
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento & Institucional */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Institucional</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/sobre" className="hover:text-[#8CF000] transition-colors">
                  Sobre a Durães Móveis
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-[#8CF000] transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#8CF000] transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/politica-de-entrega" className="hover:text-[#8CF000] transition-colors">
                  Política de Entrega
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:text-[#8CF000] transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-[#8CF000] transition-colors">
                  Privacidade e LGPD
                </Link>
              </li>
            </ul>
          </div>

          {/* Central de Contato */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Atendimento VIP</h4>
            <div className="space-y-2 text-xs">
              <a
                href="https://wa.me/551940001234"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white hover:text-[#8CF000] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#8CF000]" />
                <span>(19) 4000-1234 (WhatsApp)</span>
              </a>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#8CF000]" />
                <span>contato@duraesmoveis.com.br</span>
              </div>
              <p className="text-[11px] text-[#737373] pt-1">
                Segunda a Sexta: 08h às 19h<br />
                Sábado: 09h às 15h
              </p>
              <p className="text-[11px] text-[#737373]">
                Av. Norte-Sul, 1234 - Taquaral<br />
                Campinas - SP
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>
            &copy; {new Date().getFullYear()} Durães Móveis LTDA. Todos os direitos reservados. CNPJ: 45.123.789/0001-00.
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-[#111111] border border-[#2B2B2B] text-[11px] text-[#A3A3A3]">
              PIX 5% OFF
            </span>
            <span className="px-2 py-1 rounded bg-[#111111] border border-[#2B2B2B] text-[11px] text-[#A3A3A3]">
              Cartão até 12x
            </span>
            <span className="px-2 py-1 rounded bg-[#111111] border border-[#2B2B2B] text-[11px] text-[#A3A3A3]">
              Mercado Pago
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


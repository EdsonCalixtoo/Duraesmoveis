'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Package, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'EXM-10234';

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8CF000', '#A3FF12', '#FFFFFF', '#303030'],
      });
    } catch {
      // Ignora se canvas não estiver disponível
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 py-16 text-white">
      <div className="max-w-md w-full bg-[#141414] border border-[#2B2B2B] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 flex items-center justify-center text-[#8CF000] mx-auto shadow-lime-glow">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8CF000]">
            Pedido Confirmado
          </span>
          <h1 className="text-2xl font-black text-white">Obrigado pela sua compra!</h1>
          <p className="text-xs text-[#A3A3A3] max-w-xs mx-auto leading-relaxed">
            Seu pedido <strong className="text-white">#{orderNumber}</strong> foi registrado em nosso sistema e já está sendo preparado pela nossa equipe.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2B2B2B] text-left text-xs space-y-2 text-[#A3A3A3]">
          <div className="flex justify-between">
            <span>Número do Pedido:</span>
            <strong className="text-white">#{orderNumber}</strong>
          </div>
          <div className="flex justify-between">
            <span>Status do Pagamento:</span>
            <span className="text-[#8CF000] font-semibold">Aprovado</span>
          </div>
          <div className="flex justify-between">
            <span>Previsão de Envio:</span>
            <span className="text-white">Em até 24 horas úteis</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/conta/pedidos"
            className="w-full py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lime-sm"
          >
            <Package className="w-4 h-4" />
            <span>Acompanhar Meus Pedidos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="w-full py-3.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Voltar à Página Inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white text-xs">
          Carregando confirmação...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

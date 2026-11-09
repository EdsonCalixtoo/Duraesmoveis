import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Check, ArrowLeft, Truck, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.id }, { orderNumber: params.id }],
    },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Parse delivery address
  let addressObj: Record<string, string> = {};
  try {
    addressObj = JSON.parse(order.shippingAddress);
  } catch {
    addressObj = { street: order.shippingAddress };
  }

  // Stepper calculations: 1. Pedido realizado, 2. Pagamento aprovado, 3. Em transporte, 4. Entregue
  const steps = [
    { key: 'PENDING', label: 'Pedido realizado' },
    { key: 'PAID', label: 'Pagamento aprovado' },
    { key: 'IN_TRANSIT', label: 'Em transporte' },
    { key: 'DELIVERED', label: 'Entregue' },
  ];

  let currentStepIdx = 1; // PENDING
  if (order.status === 'PAID') currentStepIdx = 2;
  else if (order.status === 'IN_TRANSIT' || order.status === 'PREPARING') currentStepIdx = 3;
  else if (order.status === 'DELIVERED') currentStepIdx = 4;

  return (
    <div className="space-y-8 text-white">
      {/* Back button */}
      <div>
        <Link
          href="/conta/pedidos"
          className="inline-flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Meus Pedidos</span>
        </Link>
      </div>

      {/* Main Order Card (Fiel à tela 08 do mockup) */}
      <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Header: Pedido #EXM-10234, Realizado em ..., Total ..., Badge "Em transporte" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252525]">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Pedido #{order.orderNumber}
            </h1>
            <div className="flex items-center gap-3 text-xs text-[#A3A3A3] mt-1">
              <span>Realizado em: <strong className="text-white">{formatDate(order.createdAt)}</strong></span>
              <span>•</span>
              <span>Total: <strong className="text-white">{formatCurrency(order.total)}</strong></span>
            </div>
          </div>

          <div>
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-[#8CF000] text-black shadow-lime-sm">
              {order.status === 'IN_TRANSIT'
                ? 'Em transporte'
                : order.status === 'DELIVERED'
                ? 'Entregue'
                : order.status === 'PAID'
                ? 'Pagamento aprovado'
                : 'Pendente'}
            </span>
          </div>
        </div>

        {/* Visual Stepper Tracker (Fiel à tela 08 do mockup) */}
        <div className="py-4">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            {/* Connecting lines */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#252525] -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#8CF000] -translate-y-1/2 transition-all duration-500 -z-0"
              style={{
                width: `${((currentStepIdx - 1) / (steps.length - 1)) * 100}%`,
              }}
            />

            {steps.map((s, idx) => {
              const stepNumber = idx + 1;
              const isPast = stepNumber < currentStepIdx;
              const isCurrent = stepNumber === currentStepIdx;

              return (
                <div key={s.key} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-[#8CF000] text-black ring-4 ring-[#8CF000]/20'
                        : isCurrent
                        ? 'bg-[#8CF000] text-black ring-4 ring-[#8CF000]/30 animate-pulse'
                        : 'bg-[#1C1C1C] border border-[#3A3A3A] text-[#737373]'
                    }`}
                  >
                    {isPast || isCurrent ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2.5 text-center whitespace-nowrap ${
                      isPast || isCurrent ? 'text-white' : 'text-[#737373]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Itens do Pedido (Fiel à tela 08 do mockup) */}
        <div className="space-y-4 pt-4 border-t border-[#252525]">
          <h2 className="text-base font-bold text-white">Itens do Pedido</h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#2E2E2E] flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.productName}</h3>
                    <p className="text-xs text-[#A3A3A3] mt-0.5">
                      {item.variantName ? `${item.variantName} • ` : ''}Qtd: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-white">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informações de Envio e Rastreamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#252525] text-xs">
          <div className="p-4 rounded-xl bg-[#191919] border border-[#262626] space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <MapPin className="w-4 h-4 text-[#8CF000]" />
              <span>Endereço de Entrega</span>
            </div>
            <p className="text-[#A3A3A3]">
              {addressObj.street}, {addressObj.number}
              {addressObj.complement ? ` - ${addressObj.complement}` : ''}
              <br />
              {addressObj.neighborhood} - {addressObj.city}/{addressObj.state}
              <br />
              CEP: {addressObj.zipCode}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#191919] border border-[#262626] space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Truck className="w-4 h-4 text-[#8CF000]" />
              <span>Transportadora & Rastreio</span>
            </div>
            <p className="text-[#A3A3A3]">
              Transportadora: <strong className="text-white">{order.carrierName || 'OutdoorLog Express'}</strong>
              <br />
              Código de Rastreamento:{' '}
              <span className="text-[#8CF000] font-mono font-bold">
                {order.trackingCode || 'BR-EXP-98741203'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

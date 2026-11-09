import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, MapPin, Truck, CreditCard } from 'lucide-react';
import AdminOrderStatusControl from './AdminOrderStatusControl';

interface AdminOrderDetailProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.id }, { orderNumber: params.id }],
    },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  let addressObj: Record<string, string> = {};
  try {
    addressObj = JSON.parse(order.shippingAddress);
  } catch {
    addressObj = { street: order.shippingAddress };
  }

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title={`Pedido #${order.orderNumber}`}
        subtitle={`Gerencie status, pagamento e despacho logístico deste pedido.`}
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div>
          <Link
            href="/admin/pedidos"
            className="inline-flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Lista de Pedidos</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main order info & items (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-[#222222] pb-3">
                Itens Comprados
              </h3>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#0A0A0A] border border-[#2B2B2B] flex-shrink-0">
                        <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="56px" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.productName}</h4>
                        <span className="text-[11px] text-[#A3A3A3]">
                          {item.variantName ? `${item.variantName} • ` : ''}Qtd: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-white">{formatCurrency(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#222222] space-y-2 text-xs text-[#A3A3A3]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Desconto</span>
                  <span className="text-[#8CF000]">-{formatCurrency(order.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-white">{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#222222]">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Endereço e Dados do Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-[#222222]">
                  <MapPin className="w-4 h-4 text-[#8CF000]" />
                  <span>Destino de Entrega</span>
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

              <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-[#222222]">
                  <CreditCard className="w-4 h-4 text-[#8CF000]" />
                  <span>Pagamento Mercado Pago</span>
                </div>
                <p className="text-[#A3A3A3]">
                  Forma: <strong className="text-white">{order.paymentMethod}</strong>
                  <br />
                  Status: <strong className="text-[#8CF000]">{order.paymentStatus}</strong>
                  <br />
                  Transação: <span className="font-mono">{order.payment?.transactionId || 'MP-DIRECT'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Status Control Card (4 Cols) */}
          <div className="lg:col-span-4">
            <AdminOrderStatusControl
              orderId={order.id}
              currentStatus={order.status}
              currentTrackingCode={order.trackingCode || ''}
              currentCarrier={order.carrierName || 'Transportadora Especializada'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

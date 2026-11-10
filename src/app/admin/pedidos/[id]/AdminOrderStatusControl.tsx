'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrderStatusControl({
  orderId,
  currentStatus,
  currentTrackingCode,
  currentCarrier,
}: {
  orderId: string;
  currentStatus: string;
  currentTrackingCode: string;
  currentCarrier: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingCode, setTrackingCode] = useState(currentTrackingCode);
  const [carrierName, setCarrierName] = useState(currentCarrier);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          trackingCode: trackingCode.trim(),
          carrierName: carrierName.trim(),
        }),
      });

      if (!res.ok) {
        toast.error('Erro ao atualizar pedido');
        return;
      }

      toast.success('Pedido atualizado com sucesso!');
      router.refresh();
    } catch {
      toast.error('Erro de conexão ao salvar status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-[#222222] pb-3 text-white font-bold text-sm">
        <Truck className="w-4 h-4 text-[#8CF000]" />
        <span>Atualizar Status & Envio</span>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#A3A3A3]">Status do Pedido</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2.5 text-xs text-white"
          >
            <option value="PENDING">Pendente (Aguardando Pagamento)</option>
            <option value="PAID">Pago (Aprovado)</option>
            <option value="PREPARING">Preparando / Em Separação</option>
            <option value="IN_TRANSIT">Em Transporte (Despachado)</option>
            <option value="DELIVERED">Entregue ao Cliente</option>
            <option value="CANCELLED">Cancelado / Reembolsado</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#A3A3A3]">Transportadora</label>
          <input
            type="text"
            value={carrierName}
            onChange={(e) => setCarrierName(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#A3A3A3]">Código de Rastreamento</label>
          <input
            type="text"
            placeholder="Ex: BR-EXP-98741203"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lime-sm disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{loading ? 'Atualizando...' : 'Salvar Alterações'}</span>
        </button>
      </form>
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { ShippingOption } from '@/types';
import { formatCurrency, formatCEP } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductShippingBox({ price }: { price: number }) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[] | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      toast.error('Informe um CEP válido com 8 dígitos');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/cep/${cleanCep}?subtotal=${price}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'CEP não encontrado');
        return;
      }
      setOptions(data.shippingOptions);
    } catch {
      toast.error('Erro ao consultar frete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#141414] border border-[#2B2B2B] space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-white">
        <Truck className="w-4 h-4 text-[#8CF000]" />
        <span>Calcular frete e prazo de entrega</span>
      </div>

      <form onSubmit={handleCalculate} className="flex gap-2">
        <input
          type="text"
          placeholder="00000-000"
          value={cep}
          maxLength={9}
          onChange={(e) => setCep(formatCEP(e.target.value))}
          className="w-36 bg-[#1C1C1C] border border-[#353535] rounded-lg px-3 py-2 text-xs text-white placeholder-[#737373] focus:border-[#8CF000]"
        />
        <button
          type="submit"
          disabled={loading || cep.length < 8}
          className="px-4 py-2 rounded-lg bg-[#252525] hover:bg-[#8CF000] hover:text-black border border-[#353535] text-xs font-semibold text-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>

      {options && (
        <div className="space-y-2 pt-2 border-t border-[#252525]">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#191919]"
            >
              <div>
                <span className="font-semibold text-white block">{opt.name}</span>
                <span className="text-[#8E8E8E] text-[11px]">
                  Chegará em até {opt.estimatedDays} dias úteis
                </span>
              </div>
              <div className="text-right">
                {opt.price === 0 ? (
                  <span className="text-[#8CF000] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Grátis
                  </span>
                ) : (
                  <span className="font-bold text-white">{formatCurrency(opt.price)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


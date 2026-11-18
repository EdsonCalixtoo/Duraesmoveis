'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Plus, Trash2, Power } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface CouponItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  currentUses: number;
  active: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('500');
  const [saving, setSaving] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (Array.isArray(data?.coupons)) {
        setCoupons(data.coupons);
      }
    } catch {
      // Silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          description,
          discountType,
          discountValue,
          minOrderValue,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || 'Erro ao criar cupom');
        return;
      }
      toast.success('Cupom criado no Supabase com sucesso!');
      setShowModal(false);
      setCode('');
      setDescription('');
      await loadCoupons();
    } catch {
      toast.error('Erro ao criar cupom');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coup: CouponItem) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coup.id, active: !coup.active }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Cupom ${!coup.active ? 'ativado' : 'desativado'} no Supabase!`);
      await loadCoupons();
    } catch {
      toast.error('Erro ao alterar status do cupom');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/coupons?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.info('Cupom excluído do Supabase');
    } catch {
      toast.error('Erro ao remover cupom');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Cupons de Desconto"
        subtitle="Crie códigos promocionais percentuais ou com valores fixos salvos em tempo real no Supabase."
      />

      <div className="px-6 sm:px-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lime-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cupom</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#A3A3A3]">
            Carregando cupons do Supabase...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map((coup) => (
              <div
                key={coup.id}
                className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#8CF000]/60 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-[#8CF000] bg-[#8CF000]/10 border border-[#8CF000]/30 px-3 py-1 rounded-lg">
                    {coup.code}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(coup)}
                      title={coup.active ? 'Desativar cupom' : 'Ativar cupom'}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        coup.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      {coup.active ? 'Ativo' : 'Inativo'}
                    </button>

                    <button
                      onClick={() => handleDelete(coup.id)}
                      className="text-[#737373] hover:text-red-400 p-1"
                      title="Excluir cupom"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#A3A3A3]">{coup.description || 'Desconto no carrinho'}</p>

                <div className="pt-2 border-t border-[#222222] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Desconto:</span>
                    <strong className="text-white">
                      {coup.discountType === 'PERCENTAGE'
                        ? `${coup.discountValue}% OFF`
                        : formatCurrency(coup.discountValue)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Valor mínimo:</span>
                    <span className="text-white">{formatCurrency(coup.minOrderValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Usos:</span>
                    <span className="text-[#8CF000] font-bold">{coup.currentUses} utilizados</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#303030] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Criar Novo Cupom no Supabase</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-[#A3A3A3]">Código do Cupom</label>
                <input
                  type="text"
                  placeholder="Ex: DURAES10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#A3A3A3]">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: 10% OFF na linha de espreguiçadeiras"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#A3A3A3]">Tipo</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                    className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="PERCENTAGE">Percentual (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#A3A3A3]">Valor do Desconto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                    className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#A3A3A3]">Pedido Mínimo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#202020] text-xs text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#8CF000] text-black font-bold text-xs disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Criar Cupom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

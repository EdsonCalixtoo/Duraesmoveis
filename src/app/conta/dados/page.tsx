'use client';

import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { formatCPF, formatPhone } from '@/lib/utils';

export default function CustomerProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/account/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setPhone(data.user.phone || '');
          setCpf(data.user.cpf || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, cpf }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || 'Erro ao atualizar dados');
        return;
      }
      toast.success('Dados pessoais salvos no Supabase com sucesso!');
    } catch {
      toast.error('Erro de conexão ao salvar dados');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dados Pessoais</h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Mantenha suas informações cadastrais atualizadas para emissão de notas fiscais.
          </p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A3A3A3]">E-mail</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-4 py-2.5 text-xs text-[#737373] cursor-not-allowed"
            />
            <span className="text-[10px] text-[#737373]">
              Para alterar o e-mail, entre em contato com nosso suporte.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A3A3A3]">Telefone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                disabled={loading}
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A3A3A3]">CPF</label>
              <input
                type="text"
                value={cpf}
                maxLength={14}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                disabled={loading}
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving || loading}
              className="px-6 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando no Supabase...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

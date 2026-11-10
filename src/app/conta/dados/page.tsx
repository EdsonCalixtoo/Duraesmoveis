'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Save } from 'lucide-react';
import { toast } from 'sonner';
import { formatCPF, formatPhone } from '@/lib/utils';

export default function CustomerProfilePage() {
  const { data: session } = useSession();

  const [name, setName] = useState(session?.user?.name || 'Edson Silva');
  const [email] = useState(session?.user?.email || 'edson@duraesmoveis.com.br');
  const [phone, setPhone] = useState('(19) 99876-5432');
  const [cpf, setCpf] = useState('123.456.789-00');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Dados pessoais atualizados com sucesso!');
    }, 600);
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
                className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

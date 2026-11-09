'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Save, ShieldCheck, Key, Truck, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('OutdoorStyle');
  const [phone, setPhone] = useState('(19) 4000-1234');
  const [whatsapp, setWhatsapp] = useState('551940001234');
  const [email, setEmail] = useState('contato@outdoorstyle.com.br');
  const [address, setAddress] = useState('Av. Norte-Sul, 1234 - Taquaral, Campinas - SP');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('2999');
  const [pixDiscountPercent, setPixDiscountPercent] = useState('5');
  const [maxInstallments, setMaxInstallments] = useState('12');

  const [mpPublicKey, setMpPublicKey] = useState(
    'TEST-00000000-0000-0000-0000-000000000000'
  );
  const [mpAccessToken, setMpAccessToken] = useState(
    'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000'
  );

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Configurações atualizadas com sucesso!');
    }, 500);
  };

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Configurações da Loja"
        subtitle="Gerencie credenciais de pagamento, dados da empresa e regras comerciais."
      />

      <div className="px-6 sm:px-8 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Dados da Empresa */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#222222] pb-3 text-white font-bold text-sm">
              <Store className="w-4 h-4 text-[#8CF000]" />
              <span>Dados Cadastrais da Empresa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Nome Comercial</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">E-mail de Atendimento</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Telefone Comercial</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">WhatsApp Oficial (com DDD)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Endereço Físico do Showroom</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Integração Mercado Pago */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#222222] pb-3 text-white font-bold text-sm">
              <Key className="w-4 h-4 text-[#8CF000]" />
              <span>Integração Mercado Pago (Pix & Cartão)</span>
            </div>

            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Obtenha suas credenciais de produção ou testes no Portal de Desenvolvedores do Mercado Pago (mercadopago.com.br/developers).
            </p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Public Key</label>
                <input
                  type="text"
                  value={mpPublicKey}
                  onChange={(e) => setMpPublicKey(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Access Token</label>
                <input
                  type="password"
                  value={mpAccessToken}
                  onChange={(e) => setMpAccessToken(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Regras Comerciais de Frete & Pagamento */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#222222] pb-3 text-white font-bold text-sm">
              <Truck className="w-4 h-4 text-[#8CF000]" />
              <span>Regras de Frete & Parcelamento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Frete Grátis Acima de (R$)</label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Desconto no Pix (%)</label>
                <input
                  type="number"
                  value={pixDiscountPercent}
                  onChange={(e) => setPixDiscountPercent(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Parcelamento Máximo Sem Juros</label>
                <input
                  type="number"
                  value={maxInstallments}
                  onChange={(e) => setMaxInstallments(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lime-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Todas as Configurações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Save, Key, Truck, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('Durães Móveis');
  const [phone, setPhone] = useState('(19) 4000-1234');
  const [whatsapp, setWhatsapp] = useState('551940001234');
  const [email, setEmail] = useState('contato@duraesmoveis.com.br');
  const [address, setAddress] = useState('Av. Norte-Sul, 1234 - Taquaral, Campinas - SP');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('2999');
  const [pixDiscountPercent, setPixDiscountPercent] = useState('5');
  const [maxInstallments, setMaxInstallments] = useState('12');

  const [mpPublicKey, setMpPublicKey] = useState('');
  const [mpAccessToken, setMpAccessToken] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        const s = data?.settings || {};
        if (s.STORE_NAME) setStoreName(s.STORE_NAME);
        if (s.STORE_PHONE) setPhone(s.STORE_PHONE);
        if (s.STORE_WHATSAPP) setWhatsapp(s.STORE_WHATSAPP);
        if (s.STORE_EMAIL) setEmail(s.STORE_EMAIL);
        if (s.STORE_ADDRESS) setAddress(s.STORE_ADDRESS);
        if (s.FREE_SHIPPING_THRESHOLD) setFreeShippingThreshold(s.FREE_SHIPPING_THRESHOLD);
        if (s.PIX_DISCOUNT_PERCENT) setPixDiscountPercent(s.PIX_DISCOUNT_PERCENT);
        if (s.MAX_INSTALLMENTS) setMaxInstallments(s.MAX_INSTALLMENTS);
        if (s.MERCADOPAGO_PUBLIC_KEY) setMpPublicKey(s.MERCADOPAGO_PUBLIC_KEY);
        if (s.MERCADOPAGO_ACCESS_TOKEN) setMpAccessToken(s.MERCADOPAGO_ACCESS_TOKEN);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          STORE_NAME: storeName,
          STORE_PHONE: phone,
          STORE_WHATSAPP: whatsapp,
          STORE_EMAIL: email,
          STORE_ADDRESS: address,
          FREE_SHIPPING_THRESHOLD: freeShippingThreshold,
          PIX_DISCOUNT_PERCENT: pixDiscountPercent,
          MAX_INSTALLMENTS: maxInstallments,
          ...(mpPublicKey ? { MERCADOPAGO_PUBLIC_KEY: mpPublicKey } : {}),
          ...(mpAccessToken ? { MERCADOPAGO_ACCESS_TOKEN: mpAccessToken } : {}),
        }),
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      toast.success('Configurações salvas no banco de dados Supabase com sucesso!');
    } catch {
      toast.error('Não foi possível salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Configurações da Loja"
        subtitle="Gerencie credenciais do Mercado Pago, dados da empresa e regras comerciais salvas no Supabase."
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
              Cole abaixo suas credenciais de produção (<code className="text-[#8CF000]">APP_USR-...</code>) ou testes (<code className="text-[#8CF000]">TEST-...</code>) do Portal de Desenvolvedores do Mercado Pago. Elas serão salvas com segurança no banco de dados Supabase e usadas imediatamente no checkout.
            </p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Public Key (Mercado Pago)</label>
                <input
                  type="text"
                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={mpPublicKey}
                  onChange={(e) => setMpPublicKey(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#303030] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A3A3A3]">Access Token (Mercado Pago)</label>
                <input
                  type="password"
                  placeholder="APP_USR-0000000000000000-000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-000000000"
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
              disabled={saving || loading}
              className="px-8 py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lime-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando no Supabase...' : 'Salvar Todas as Configurações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

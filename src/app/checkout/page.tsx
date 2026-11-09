'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Check,
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  QrCode,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency, formatCEP, formatPhone, formatCPF } from '@/lib/utils';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    coupon,
    getSubtotal,
    getDiscount,
    clearCart,
  } = useCartStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Etapa 1: Identificação
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');

  // Etapa 2: Entrega
  const [zipCode, setZipCode] = useState('13090-000');
  const [street, setStreet] = useState('Avenida Barão de Itapura');
  const [number, setNumber] = useState('1234');
  const [complement, setComplement] = useState('Apto 42');
  const [neighborhood, setNeighborhood] = useState('Guanabara');
  const [city, setCity] = useState('Campinas');
  const [state, setState] = useState('SP');
  const [shippingOptionId, setShippingOptionId] = useState('transportadora_especializada');
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Etapa 3: Pagamento
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD' | 'BOLETO'>('PIX');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiration, setCardExpiration] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(1);

  // Etapa 4: Confirmação / Carregamento
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixPaymentData, setPixPaymentData] = useState<{
    qrCodeBase64: string;
    copyPastePix: string;
    orderNumber: string;
  } | null>(null);

  // Pré-preenchimento caso logado
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
      const userExtended = session.user as unknown as { phone?: string; cpf?: string };
      if (userExtended.phone && !phone) setPhone(formatPhone(userExtended.phone));
      if (userExtended.cpf && !cpf) setCpf(formatCPF(userExtended.cpf));
    }
  }, [session]);

  const subtotal = getSubtotal();
  const couponDiscount = getDiscount();
  const isFreeShipping = subtotal >= 2999;
  const shippingCost = isFreeShipping ? 0 : 98;
  const pixDiscount = paymentMethod === 'PIX' ? ((subtotal - couponDiscount) * 0.05) : 0;
  const total = Math.max(0, subtotal - couponDiscount - pixDiscount + shippingCost);

  // Busca de CEP automática via API
  const handleSearchCep = async () => {
    const clean = zipCode.replace(/\D/g, '');
    if (clean.length !== 8) {
      toast.error('Informe um CEP válido com 8 números');
      return;
    }

    setIsSearchingCep(true);
    try {
      const res = await fetch(`/api/cep/${clean}?subtotal=${subtotal}`);
      const data = await res.json();
      if (!res.ok || !data.address) {
        toast.error('CEP não localizado');
        return;
      }
      setStreet(data.address.street || street);
      setNeighborhood(data.address.neighborhood || neighborhood);
      setCity(data.address.city || city);
      setState(data.address.state || state);
      toast.success('Endereço preenchido!');
    } catch {
      toast.error('Erro na consulta do CEP');
    } finally {
      setIsSearchingCep(false);
    }
  };

  // Submissão do Pedido
  const handleFinishOrder = async () => {
    if (!name || !email || !cpf) {
      setStep(1);
      toast.error('Por favor, preencha seus dados de identificação');
      return;
    }

    if (!street || !number || !city || !state) {
      setStep(2);
      toast.error('Por favor, preencha o endereço completo de entrega');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identification: { name, email, phone, cpf },
          shippingAddress: {
            zipCode,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
          },
          shippingOptionId,
          paymentMethod,
          cardData:
            paymentMethod === 'CREDIT_CARD'
              ? {
                  cardNumber,
                  cardHolder,
                  cardExpiration,
                  cardCvv,
                  installments,
                }
              : undefined,
          couponCode: coupon?.code,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Erro ao processar pedido');
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === 'PIX' && data.payment?.copyPastePix) {
        setPixPaymentData({
          qrCodeBase64: data.payment.qrCodeBase64,
          copyPastePix: data.payment.copyPastePix,
          orderNumber: data.order.orderNumber,
        });
        setStep(4);
        clearCart();
      } else {
        clearCart();
        router.push(`/checkout/sucesso?orderNumber=${data.order.orderNumber}`);
      }
    } catch {
      toast.error('Erro na conexão com o servidor de pagamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="text-center max-w-sm p-8 bg-[#141414] rounded-2xl border border-[#2B2B2B]">
          <ShoppingBag className="w-12 h-12 text-[#8CF000] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Seu carrinho está vazio</h2>
          <p className="text-xs text-[#A3A3A3] mb-6">
            Adicione produtos antes de prosseguir com o pagamento.
          </p>
          <Link
            href="/catalogo"
            className="px-6 py-2.5 rounded-xl bg-[#8CF000] text-black font-bold text-xs"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-20">
      {/* Checkout Minimal Header */}
      <div className="border-b border-[#202020] bg-[#0C0C0C]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white">
              Outdoor<span className="text-[#8CF000]">Style</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#8CF000]">
            <Lock className="w-4 h-4" />
            <span className="font-semibold text-white">Checkout Seguro 256-bit SSL</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Stepper (Fiel à tela 05 do mockup) */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#252525] -translate-y-1/2 -z-0" />

            {[
              { num: 1, label: 'Identificação' },
              { num: 2, label: 'Entrega' },
              { num: 3, label: 'Pagamento' },
              { num: 4, label: 'Confirmação' },
            ].map((s) => {
              const isPast = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-[#8CF000] text-black ring-4 ring-[#8CF000]/20'
                        : isCurrent
                        ? 'bg-[#1C1C1C] border-2 border-[#8CF000] text-[#8CF000] ring-4 ring-[#8CF000]/20'
                        : 'bg-[#161616] border border-[#333333] text-[#737373]'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 ${
                      isCurrent || isPast ? 'text-white' : 'text-[#737373]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checkout Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 Cols) */}
          <div className="lg:col-span-8 bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 sm:p-8 space-y-6">
            {/* ETAPA 1: Identificação */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
                  <h2 className="text-lg font-bold text-white">Dados de Identificação</h2>
                  <span className="text-xs text-[#A3A3A3]">Etapa 1 de 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-[#A3A3A3]">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Edson da Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A3A3A3]">E-mail *</label>
                    <input
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A3A3A3]">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      placeholder="(19) 99876-5432"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-[#A3A3A3]">
                      CPF (para emissão da Nota Fiscal) *
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      maxLength={14}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!name || !email || !cpf) {
                        toast.error('Preencha todos os campos obrigatórios');
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-8 py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-sm flex items-center gap-2 transition-all shadow-lime-sm"
                  >
                    <span>Continuar para Entrega</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 2: Entrega (Exata à tela 05 do mockup) */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
                  <h2 className="text-lg font-bold text-white">Dados de Entrega</h2>
                  <span className="text-xs text-[#A3A3A3]">Etapa 2 de 3</span>
                </div>

                <div className="space-y-4">
                  {/* CEP row com botão Buscar CEP */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A3A3A3]">CEP *</label>
                    <div className="flex gap-2 max-w-sm">
                      <input
                        type="text"
                        placeholder="13090-000"
                        value={zipCode}
                        maxLength={9}
                        onChange={(e) => setZipCode(formatCEP(e.target.value))}
                        className="flex-1 bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                      />
                      <button
                        type="button"
                        onClick={handleSearchCep}
                        disabled={isSearchingCep}
                        className="px-5 py-3 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold text-xs transition-colors"
                      >
                        {isSearchingCep ? 'Buscando...' : 'Buscar CEP'}
                      </button>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A3A3A3]">Endereço *</label>
                    <input
                      type="text"
                      placeholder="Avenida Barão de Itapura"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                    />
                  </div>

                  {/* Número e Complemento */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A3A3A3]">Número *</label>
                      <input
                        type="text"
                        placeholder="1234"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A3A3A3]">Complemento</label>
                      <input
                        type="text"
                        placeholder="Apto 42"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                      />
                    </div>
                  </div>

                  {/* Bairro, Cidade, UF */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A3A3A3]">Bairro *</label>
                      <input
                        type="text"
                        placeholder="Guanabara"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A3A3A3]">Cidade *</label>
                      <input
                        type="text"
                        placeholder="Campinas"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A3A3A3]">UF *</label>
                      <input
                        type="text"
                        placeholder="SP"
                        maxLength={2}
                        value={state}
                        onChange={(e) => setState(e.target.value.toUpperCase())}
                        className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white focus:border-[#8CF000] uppercase"
                      />
                    </div>
                  </div>

                  {/* Opção de Envio */}
                  <div className="pt-4 border-t border-[#252525] space-y-3">
                    <label className="text-xs font-semibold text-white block">
                      Opção de Transporte
                    </label>
                    <div
                      onClick={() => setShippingOptionId('transportadora_especializada')}
                      className="p-4 rounded-xl bg-[#1C1C1C] border-2 border-[#8CF000] flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-[#8CF000]" />
                        <div>
                          <span className="text-sm font-bold text-white block">
                            Transportadora Especializada OutdoorLog
                          </span>
                          <span className="text-xs text-[#A3A3A3]">
                            Veículo acolchoado e entrega com agendamento
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#8CF000]">
                        {isFreeShipping ? 'Grátis' : formatCurrency(shippingCost)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!street || !number || !city || !state) {
                        toast.error('Preencha os dados do endereço');
                        return;
                      }
                      setStep(3);
                    }}
                    className="px-8 py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-sm flex items-center gap-2 transition-all shadow-lime-sm"
                  >
                    <span>Continuar para Pagamento</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 3: Pagamento */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#252525]">
                  <h2 className="text-lg font-bold text-white">Forma de Pagamento</h2>
                  <span className="text-xs text-[#A3A3A3]">Etapa 3 de 3</span>
                </div>

                {/* Métodos de Pagamento Tabs */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'PIX'
                        ? 'bg-[#1C1C1C] border-[#8CF000] text-[#8CF000]'
                        : 'bg-[#181818] border-[#303030] text-[#A3A3A3] hover:text-white'
                    }`}
                  >
                    <QrCode className="w-6 h-6" />
                    <span className="text-xs font-bold text-white">Pix (5% de Desconto)</span>
                    <span className="text-[10px] text-[#8CF000] font-semibold">Aprovação imediata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'bg-[#1C1C1C] border-[#8CF000] text-[#8CF000]'
                        : 'bg-[#181818] border-[#303030] text-[#A3A3A3] hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs font-bold text-white">Cartão de Crédito</span>
                    <span className="text-[10px] text-[#A3A3A3]">Até 12x sem juros</span>
                  </button>
                </div>

                {/* Pagamento Pix Preview */}
                {paymentMethod === 'PIX' && (
                  <div className="p-4 rounded-xl bg-[#191919] border border-[#2B2B2B] space-y-2 text-xs text-[#A3A3A3]">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#8CF000]" />
                      <span>Desconto de 5% aplicado no Pix!</span>
                    </div>
                    <p>
                      Ao clicar em finalizar pedido, você receberá o QR Code dinâmico do Mercado Pago e o código Copia e Cola para pagamento imediato pelo aplicativo do seu banco.
                    </p>
                  </div>
                )}

                {/* Pagamento Cartão Form */}
                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A3A3A3]">
                        Número do Cartão *
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        maxLength={19}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A3A3A3]">
                        Nome Impresso no Cartão *
                      </label>
                      <input
                        type="text"
                        placeholder="Como está no cartão"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#A3A3A3]">Validade *</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardExpiration}
                          maxLength={5}
                          onChange={(e) => setCardExpiration(e.target.value)}
                          className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#A3A3A3]">CVV *</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cardCvv}
                          maxLength={4}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#A3A3A3]">Parcelamento</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                        className="w-full bg-[#1C1C1C] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((m) => (
                          <option key={m} value={m}>
                            {m}x de {formatCurrency(total / m)} sem juros
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    onClick={handleFinishOrder}
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-sm flex items-center gap-2 transition-all shadow-lime-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processando Pedido...</span>
                    ) : (
                      <>
                        <span>Finalizar Pedido</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 4: Confirmação Pix Interativo */}
            {step === 4 && pixPaymentData && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#8CF000]/10 border border-[#8CF000]/30 flex items-center justify-center text-[#8CF000] mx-auto">
                  <QrCode className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white">Pedido #{pixPaymentData.orderNumber}</h2>
                  <p className="text-xs text-[#A3A3A3] mt-1">
                    Pague via Pix para aprovação imediata do seu pedido
                  </p>
                </div>

                {/* QR Code image */}
                <div className="p-4 bg-white rounded-2xl w-56 h-56 mx-auto flex items-center justify-center shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pixPaymentData.qrCodeBase64}
                    alt="QR Code Pix"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <span className="text-xs text-[#A3A3A3] block">Código Pix Copia e Cola:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixPaymentData.copyPastePix}
                      className="flex-1 bg-[#1C1C1C] border border-[#333333] rounded-xl px-3 py-2 text-xs text-[#A3A3A3] font-mono truncate"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pixPaymentData.copyPastePix);
                        toast.success('Código Pix copiado!');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#8CF000] text-black font-bold text-xs flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href={`/conta/pedidos`}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#1C1C1C] border border-[#353535] hover:border-[#8CF000] text-white text-xs font-bold"
                  >
                    <span>Acompanhar Meus Pedidos</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary: Resumo do Pedido (4 Cols - Fiel à tela 05 do mockup) */}
          <div className="lg:col-span-4 bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white pb-3 border-b border-[#252525]">
              Resumo do Pedido
            </h3>

            {/* Items list */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#0A0A0A] border border-[#2B2B2B] flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                    <span className="text-[11px] text-[#A3A3A3] block">
                      {item.variantName ? `${item.variantName} • ` : ''}Qtd: {item.quantity}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-[#A3A3A3] pt-4 border-t border-[#252525]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#8CF000]">
                  <span>Cupom ({coupon?.code})</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}

              {pixDiscount > 0 && (
                <div className="flex justify-between text-[#8CF000]">
                  <span>Desconto Pix (5%)</span>
                  <span>-{formatCurrency(pixDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Frete</span>
                <span className="text-[#8CF000] font-semibold">
                  {shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#252525] flex justify-between items-baseline text-base font-extrabold text-white">
                <span>Total</span>
                <span className="text-xl text-white">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#191919] border border-[#262626] flex items-center gap-2.5 text-xs text-[#A3A3A3]">
              <ShieldCheck className="w-4 h-4 text-[#8CF000] flex-shrink-0" />
              <span>Compra garantida com nota fiscal eletrônica e garantia de fábrica.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

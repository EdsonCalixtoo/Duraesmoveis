'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    coupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getTotal,
    getTotalItemsCount,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();
  const itemsCount = getTotalItemsCount();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Cupom inválido');
        return;
      }

      applyCoupon(data.coupon);
      setCouponCode('');
      toast.success(`Cupom ${data.coupon.code} aplicado com sucesso!`);
    } catch {
      toast.error('Erro ao verificar cupom');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] py-10 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-6 rounded-full bg-[#8CF000]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Seu Carrinho{' '}
            <span className="text-sm font-normal text-[#A3A3A3]">
              ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})
            </span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 bg-[#111111] rounded-2xl border border-[#262626] p-8">
            <div className="w-16 h-16 rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#8CF000] mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
            <p className="text-xs text-[#A3A3A3] mb-6">
              Descubra nossos móveis externos de design exclusivo e comece a transformar seus ambientes de lazer.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8CF000] text-black font-bold text-xs hover:bg-[#A3FF12] transition-colors"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Products List (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-colors hover:border-[#383838]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#2E2E2E] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <div className="space-y-1">
                      <Link
                        href={`/produto/${item.slug}`}
                        className="text-sm sm:text-base font-bold text-white hover:text-[#8CF000] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="text-xs text-[#A3A3A3]">{item.variantName}</p>
                      )}
                      <p className="text-xs text-[#737373] font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#222222]">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#1C1C1C] border border-[#333333] rounded-xl px-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 text-white hover:text-[#8CF000]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 text-white hover:text-[#8CF000]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[100px]">
                      <span className="text-base font-extrabold text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#737373] hover:text-red-400 transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-[#111111] border border-[#252525] flex items-center justify-between text-xs text-[#A3A3A3]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8CF000]" />
                  <span>Móveis embalados individualmente com proteção contra choques mecânicos</span>
                </div>
                <Link href="/catalogo" className="text-[#8CF000] hover:underline">
                  Adicionar mais móveis
                </Link>
              </div>
            </div>

            {/* Order Summary & Checkout Box (4 Cols) */}
            <div className="lg:col-span-4 bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white pb-3 border-b border-[#252525]">
                Resumo da Compra
              </h3>

              {/* Coupon input */}
              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] block mb-2">
                  Cupom de Desconto
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C1C1C] border border-[#8CF000]/40 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#8CF000]" />
                      <span>
                        Cupom <strong className="text-[#8CF000]">{coupon.code}</strong> ativo
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#737373] hover:text-red-400 font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite seu cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#737373] uppercase"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponCode.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-[#8CF000] hover:text-black border border-[#333333] text-xs font-bold text-white transition-colors disabled:opacity-50"
                    >
                      {isApplying ? '...' : 'Aplicar'}
                    </button>
                  </form>
                )}
              </div>

              {/* Calculations */}
              <div className="space-y-3 text-xs sm:text-sm text-[#A3A3A3] pt-2 border-t border-[#252525]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#8CF000]">
                    <span>Desconto do Cupom ({coupon?.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span>Frete</span>
                  <span className="text-[#8CF000]">Calculado na próxima etapa</span>
                </div>

                <div className="pt-3 border-t border-[#252525] flex justify-between items-baseline text-base font-bold text-white">
                  <span>Total estimado</span>
                  <span className="text-2xl font-black text-white">{formatCurrency(total)}</span>
                </div>
                <p className="text-[11px] text-[#737373] text-right">
                  ou até 12x de {formatCurrency(total / 12)} sem juros
                </p>
              </div>

              {/* Finalizar Compra CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lime-sm active:scale-98"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

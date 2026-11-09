'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
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

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();
  const itemsCount = getTotalItemsCount();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCodeInput.trim(), subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Cupom inválido');
        return;
      }

      applyCoupon(data.coupon);
      setCouponCodeInput('');
      toast.success(`Cupom ${data.coupon.code} aplicado com sucesso!`);
    } catch {
      toast.error('Erro ao verificar cupom');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-[#303030] text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#303030] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1C1C1C] flex items-center justify-center text-[#8CF000]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Seu Carrinho</h2>
                <span className="text-xs text-[#A3A3A3]">({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})</span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg hover:bg-[#1C1C1C] text-[#A3A3A3] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#A3A3A3] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Seu carrinho está vazio</h3>
                <p className="text-sm text-[#A3A3A3] max-w-xs mb-6">
                  Explore nossos móveis premium para áreas externas e transforme seu espaço.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-[#8CF000] text-black font-semibold hover:bg-[#A3FF12] transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-[#1C1C1C] rounded-xl border border-[#303030] transition-colors hover:border-[#404040]"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#0A0A0A] flex-shrink-0 border border-[#2B2B2B]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/produto/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-white hover:text-[#8CF000] transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#A3A3A3] hover:text-red-400 transition-colors p-1"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variantName && (
                        <span className="text-xs text-[#A3A3A3] block mt-0.5">
                          {item.variantName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center bg-[#111111] border border-[#303030] rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 hover:text-[#8CF000] transition-colors text-[#A3A3A3]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 hover:text-[#8CF000] transition-colors text-[#A3A3A3]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Calculations and CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#303030] bg-[#141414] space-y-4">
              {/* Cupom Form */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1C1C] border border-[#8CF000]/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#8CF000]" />
                    <span>
                      Cupom <strong className="text-[#8CF000]">{coupon.code}</strong> aplicado
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#A3A3A3] hover:text-red-400 font-medium"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu cupom"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#1C1C1C] border border-[#303030] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#737373] focus:border-[#8CF000] uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCodeInput.trim()}
                    className="px-4 py-2 rounded-xl bg-[#202020] hover:bg-[#8CF000] hover:text-black border border-[#353535] text-xs font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {isApplyingCoupon ? '...' : 'Aplicar'}
                  </button>
                </form>
              )}

              {/* Subtotal, Desconto, Frete, Total */}
              <div className="space-y-2 text-sm text-[#A3A3A3]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#8CF000]">
                    <span>Desconto ({coupon?.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span>Frete</span>
                  <span className="text-[#8CF000]">Calculado no checkout</span>
                </div>
                <div className="border-t border-[#303030] pt-2 flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-lg text-white">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Finalizar Compra CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 px-4 rounded-xl bg-[#8CF000] hover:bg-[#A3FF12] text-black font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-lime-sm text-sm"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItemType, CouponItem } from '@/types';

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
  coupon: CouponItem | null;
  shippingOption: { id: string; name: string; price: number } | null;
  shippingZipCode: string;

  // Drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Itens
  addItem: (item: Omit<CartItemType, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Cupom
  applyCoupon: (coupon: CouponItem) => void;
  removeCoupon: () => void;

  // Frete
  setShippingOption: (option: { id: string; name: string; price: number } | null) => void;
  setShippingZipCode: (zip: string) => void;

  // Cálculos
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,
      shippingOption: null,
      shippingZipCode: '',

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        set((state) => {
          const qtyToAdd = newItem.quantity || 1;
          const existingIndex = state.items.findIndex((item) => item.id === newItem.id);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQty = Math.min(
              currentItem.quantity + qtyToAdd,
              currentItem.maxStock || 99
            );
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQty,
            };
            return { items: updatedItems, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                ...newItem,
                quantity: Math.min(qtyToAdd, newItem.maxStock || 99),
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => {
          const updatedItems = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                return {
                  ...item,
                  quantity: Math.min(newQty, item.maxStock || 99),
                };
              }
              return item;
            })
            .filter(Boolean) as CartItemType[];

          return { items: updatedItems };
        });
      },

      setQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null, shippingOption: null });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      setShippingOption: (option) => {
        set({ shippingOption: option });
      },

      setShippingZipCode: (zip) => {
        set({ shippingZipCode: zip });
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal < coupon.minOrderValue) return 0;

        if (coupon.discountType === 'PERCENTAGE') {
          return (subtotal * coupon.discountValue) / 100;
        }
        return Math.min(coupon.discountValue, subtotal);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shippingCost = get().shippingOption?.price || 0;
        return Math.max(0, subtotal - discount + shippingCost);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'outdoorstyle-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        shippingOption: state.shippingOption,
        shippingZipCode: state.shippingZipCode,
      }),
    }
  )
);


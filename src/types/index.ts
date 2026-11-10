export type Role = 'ADMIN' | 'CUSTOMER';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  cpf?: string | null;
  avatarUrl?: string | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  active: boolean;
  _count?: {
    products: number;
  };
}

export interface ProductVariantItem {
  id: string;
  productId: string;
  name: string;
  colorName: string;
  colorHex: string;
  sku?: string | null;
  stock: number;
  priceAdjustment: number;
}

export interface ProductImageItem {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  displayOrder: number;
  isCover: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  originalPrice?: number | null;
  discountPercent: number;
  stock: number;
  active: boolean;
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewsCount: number;
  materials?: string | null;
  dimensions?: string | null;
  weightKg?: number | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImageItem[];
  variants: ProductVariantItem[];
}

export interface CartItemType {
  id: string; // unique item key: productId or `${productId}-${variantId}`
  productId: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxStock: number;
  variantId?: string;
  variantName?: string;
  colorName?: string;
  colorHex?: string;
}

export interface CouponItem {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  price: number;
  estimatedDays: number;
  description: string;
}

export interface AddressData {
  id?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface OrderItemDetail {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string | null;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  guestCpf?: string | null;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  paymentStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  trackingCode?: string | null;
  carrierName?: string | null;
  shippingService?: string | null;
  couponCode?: string | null;
  shippingAddress: string;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItemDetail[];
  statusHistory?: {
    id: string;
    status: string;
    note?: string | null;
    createdAt: string | Date;
  }[];
  payment?: {
    id: string;
    paymentMethod: string;
    status: string;
    transactionId?: string | null;
    qrCode?: string | null;
    copyPastePix?: string | null;
    installments?: number | null;
    cardLastFour?: string | null;
    cardBrand?: string | null;
    amount: number;
    paidAt?: string | Date | null;
  } | null;
}


export type ProductVariant = {
  id: string;
  label: string;
  priceDiff: number;
  stock: number;
};

export type ProductType = "menu" | "shop";

export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  type: ProductType;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  variantId: string | null;
  variantLabel: string | null;
  quantity: number;
  stock: number;
};
export type CartItemDTO = {
  id: string;
  productId: string;
  quantity: number;

  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
  };
};


export type CartDTO = {
  id: string;
  userId: string | null;
  guestId: string | null;

  items: CartItemDTO[];

  createdAt: Date;
  updatedAt: Date;
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "returned";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال‌شده",
  delivered: "تحویل‌شده",
  canceled: "لغوشده",
  returned: "مرجوعی",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-100 text-amber-700 border-amber-200",
  paid: "bg-sky-100 text-sky-700 border-sky-200",
  processing: "bg-violet-100 text-violet-700 border-violet-200",
  shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  canceled: "bg-rose-100 text-rose-700 border-rose-200",
  returned: "bg-slate-200 text-slate-700 border-slate-300",
};

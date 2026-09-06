export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
  isActive: boolean;
  images?: BillboardImage[];
}

export interface BillboardImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  billboard?: Billboard | null;
  parent?: Category | null;
  children?: Category[];
}

export interface Color {
  id: string;
  name: string;
  hexCode?: string | null;
}

export interface Size {
  id: string;
  name: string;
  type: "CLOTHING" | "SHOE" | "WAIST" | "CUSTOM";
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorId?: string | null;
  color?: Color | null;
  sizeId?: string | null;
  size?: Size | null;
  sku: string;
  price: string | number;
  stock: number;
  isActive: boolean;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
  variantId?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price?: string | number | null;
  size?: string | null;
  color?: string | null;
  stock?: number | null;
  categoryId: string;
  category?: Category;
  isFeatured: boolean;
  isArchived: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
}

export type Image = ProductImage;

// For cart items, we need to track the selected variant
export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  isPaid: boolean;
  phone: string;
  address: string;
  subtotal: string | number;
  shippingFee: string | number;
  discount: string | number;
  totalPrice: string | number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  variantId: string;
  variant?: ProductVariant;
  quantity: number;
  price: string | number;
}

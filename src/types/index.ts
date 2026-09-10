export type ProductCategory =
  | "essentials"
  | "premium"
  | "limited"
  | "custom"
  | (string & {});

export type ProductStatus = "draft" | "published" | "out_of_stock" | "archived";

export type AdminRole = "admin" | "super_admin";

export type UserRole = "customer" | AdminRole;

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  is_admin: boolean;
  disabled: boolean;
  created_at: string;
  updated_at?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  enabled: boolean;
};

/** Normalized tee print placement (admin editor ↔ storefront). */
export type ProductPrintLayout = {
  designUrl: string | null;
  mockupUrl: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  printArea: { x: number; y: number; width: number; height: number };
  designAspect: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  salePrice?: number;
  sku?: string;
  category: ProductCategory;
  categoryId?: string;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  tags: string[];
  featured?: boolean;
  bestSeller?: boolean;
  inventory: number;
  lowStockThreshold?: number;
  status?: ProductStatus;
  /** Saved T-shirt design placement when configured in admin. */
  printLayout?: ProductPrintLayout | null;
  createdAt: string;
  updatedAt?: string;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  color: ProductColor;
  size: string;
  quantity: number;
  image: string;
  avatarConfig?: AvatarConfig;
  custom?: boolean;
  /** Locked sticker→shirt design snapshot (does not change if avatar is edited later). */
  stickerDesign?: StickerShirtDesign;
};

/** Print-ready shirt design derived from a sticker composition. */
export type StickerShirtDesign = {
  stickerId: string;
  stickerName: string;
  composition: Record<string, unknown>;
  /** Locked avatar snapshot at design time. */
  avatarConfig: AvatarConfig;
  apparelStyle: string;
  placement: "center-chest" | "left-chest" | "upper-back" | "full-back";
  designSize: "small" | "medium" | "large";
  lockedAt: string;
  /** Optional preview thumbnail (data URL) for cart UI. */
  previewDataUrl?: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "ready"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type AvatarItemRecord = {
  id: string;
  category_id: string;
  key: string;
  name: string;
  description: string;
  asset_url: string | null;
  meta: Record<string, unknown>;
  layer_order: number | null;
  sort_order: number;
  active: boolean;
  featured: boolean;
  price: number | null;
  product_id: string | null;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  userId?: string;
  email: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  shippingAddress?: Address;
};

export type Address = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type AvatarConfig = {
  face: string;
  skin: string;
  eyes: string;
  eyebrows: string;
  nose: string;
  mouth: string;
  hair: string;
  hairColor: string;
  beard: string;
  glasses: string;
  hat: string;
  body: string;
  clothing: string;
  clothingColor: string;
  shoes: string;
  expression: string;
  pose: string;
  apron: string;
  collar: string;
  gloves: string;
  ring: string;
  tool: string;
};

export type SavedAvatar = {
  id: string;
  name: string;
  config: AvatarConfig;
  shirtColor: string;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export type GalleryItem = {
  id: string;
  caption: string;
  avatarSeed: Partial<AvatarConfig>;
};

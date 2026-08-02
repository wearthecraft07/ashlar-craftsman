export type ProductCategory =
  | "essentials"
  | "premium"
  | "limited"
  | "custom";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  tags: string[];
  featured?: boolean;
  bestSeller?: boolean;
  inventory: number;
  createdAt: string;
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
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

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

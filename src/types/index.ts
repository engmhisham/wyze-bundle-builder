export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  learnMoreUrl?: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  variants?: ProductVariant[];
  category: 'cameras' | 'plans' | 'sensors' | 'protection';
  reviewImage?: string;
  // For plans
  reviewIcon?: string;
  priceLabel?: string;
  // For items that are required/free
  isFreeWithBundle?: boolean;
}

export interface StepConfig {
  id: string;
  title: string;
  category: Product['category'];
  icon: string;
  iconExt?: string;
}

export interface LineItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface BundleState {
  lineItems: LineItem[];
  activeStep: number;
  saved: boolean;
}

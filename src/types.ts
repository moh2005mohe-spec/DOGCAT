export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  images: string[];
  category: 'cat' | 'dog';
  subcategory: string;
  rating: number;
  reviews_count: number;
  orders_count: number;
  aliexpress_url: string;
  aliexpress_product_id: string;
  is_featured: boolean;
  in_stock: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CategoryFilter = 'all' | 'cat' | 'dog';
export type SubcategoryFilter = 'all' | 'toys' | 'beds' | 'food' | 'accessories' | 'grooming' | 'furniture';

export type ProductCategory = 
  | 'ELECTRONICS'
  | 'CLOTHING'
  | 'BOOKS'
  | 'HOME_GARDEN'
  | 'SPORTS'
  | 'BEAUTY'
  | 'FOOD_BEVERAGE'
  | 'OTHER';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category: ProductCategory;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userEmail: string;
  totalAmount: number;
  status: OrderStatus;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

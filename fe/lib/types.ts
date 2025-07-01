export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

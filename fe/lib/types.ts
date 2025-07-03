export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
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

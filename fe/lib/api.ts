import http from './https';
import { CreateOrderItem, Order, Product } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getProducts() {
  return http.get<Product[]>(`${API_BASE_URL}/products`);
}

export async function getOrders() {
  return http.get<Order[]>(`${API_BASE_URL}/orders`);
}

export async function getOrderById(id: string) {
  return http.get<Order>(`${API_BASE_URL}/orders/${id}`);
}

export async function createOrder(
  userEmail: string,
  orderItems: CreateOrderItem[],
) {
  return http.post<Order>(
    `${API_BASE_URL}/orders`,
    JSON.stringify({ userEmail, orderItems }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function cancelOrder(id: string) {
  return http.put<Order>(`${API_BASE_URL}/orders/${id}/cancel`, null);
}

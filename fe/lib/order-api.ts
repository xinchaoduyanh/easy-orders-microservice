import { fetchWithAuth } from "./api";

export const getOrders = async () => {
  // Get current user's orders only
  const res = await fetchWithAuth("/api/orders/me");
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.data;
};

export const getOrderById = async (id: string) => {
  const res = await fetchWithAuth(`/api/orders/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order");
  const data = await res.json();
  return data.data;
};

export const createOrder = async (userEmail: string, orderItems: { productId: string; quantity: number }[]) => {
  const res = await fetchWithAuth("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail, orderItems }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  const data = await res.json();
  return data.data;
};

export const cancelOrder = async (id: string) => {
  const res = await fetchWithAuth(`/api/orders/${id}/cancel`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to cancel order");
  const data = await res.json();
  return data.data;
};

export const getProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.data;
}; 
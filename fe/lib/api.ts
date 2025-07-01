const API_BASE_URL = 'http://localhost:3000';

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function getOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

export async function getOrderById(id: string) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  return response.json();
}

export async function createOrder(
  userId: string,
  orderItems: { productId: string; quantity: number }[],
) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      orderItems,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
}

export async function cancelOrder(id: string) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to cancel order');
  }

  return response.json();
}

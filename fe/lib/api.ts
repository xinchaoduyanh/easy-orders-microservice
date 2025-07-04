import http from './https';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Thêm counter để theo dõi số lần gọi API
let apiCallCount = 0;

export const getOrders = async () => {
  apiCallCount++;
  console.log(`[API] getOrders called (${apiCallCount} times)`);
  
  try {
    const response = await http.get(`${API_BASE_URL}/orders`);
    console.log(`[API] getOrders success:`, response);
    return response;
  } catch (error) {
    console.error(`[API] getOrders error:`, error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  apiCallCount++;
  console.log(`[API] getOrderById called for ID: ${id} (${apiCallCount} times)`);
  
  try {
    const response = await http.get(`${API_BASE_URL}/orders/${id}`);
    console.log(`[API] getOrderById success:`, response);
    return response;
  } catch (error) {
    console.error(`[API] getOrderById error:`, error);
    throw error;
  }
};

export const createOrder = async (userEmail: string, orderItems: { productId: string; quantity: number }[]) => {
  apiCallCount++;
  console.log(`[API] createOrder called (${apiCallCount} times)`);
  
  try {
    const response = await http.post(`${API_BASE_URL}/orders`, {
      userEmail,
      orderItems,
    });
    console.log(`[API] createOrder success:`, response);
    return response;
  } catch (error) {
    console.error(`[API] createOrder error:`, error);
    throw error;
  }
};

export const cancelOrder = async (id: string) => {
  apiCallCount++;
  console.log(`[API] cancelOrder called for ID: ${id} (${apiCallCount} times)`);
  
  try {
    const response = await http.put(`${API_BASE_URL}/orders/${id}/cancel`, null);
    console.log(`[API] cancelOrder success:`, response);
    return response;
  } catch (error) {
    console.error(`[API] cancelOrder error:`, error);
    throw error;
  }
};

export const getProducts = async () => {
  apiCallCount++;
  console.log(`[API] getProducts called (${apiCallCount} times)`);
  
  try {
    const response = await http.get(`${API_BASE_URL}/products`);
    console.log(`[API] getProducts success:`, response);
    return response;
  } catch (error) {
    console.error(`[API] getProducts error:`, error);
    throw error;
  }
};

// Export counter để debug
export const getApiCallCount = () => apiCallCount;

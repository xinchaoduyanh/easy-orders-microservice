export interface OrderDeliveredNotification {
  orderId: string;
  userEmail: string;
  userName: string;
  orderDetails: {
    products: OrderItem[];
    total: number;
  };
  deliveredAt: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  name: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// orders-app/src/orders/orders.dto.ts
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const CreateOrderItemZodSchema = z
  .object({
    productId: z.string().min(1, { message: 'Product ID is required' }),
    quantity: z
      .number()
      .int()
      .min(1, { message: 'Quantity must be at least 1' }),
  })
  .strict();
export type CreateOrderItemDto = z.infer<typeof CreateOrderItemZodSchema>;

// Type cho OrderItem đã được xử lý và sẵn sàng để lưu vào DB
// Bao gồm giá sản phẩm được tra cứu từ database
export type OrderItemForDbCreation = {
  productId: string;
  quantity: number;
  price: number; // Giá sản phẩm được lấy từ DB
};

// Schema và Type cho việc tạo Order
export const CreateOrderZodSchema = z
  .object({
    userEmail: z
      .string()
      .nonempty({ message: 'User email is required' })
      .email({ message: 'Invalid email format' }),
    orderItems: z
      .array(CreateOrderItemZodSchema)
      .min(1, { message: 'Order must contain at least one item' }),
  })
  .strict();
export type CreateOrderDto = z.infer<typeof CreateOrderZodSchema>;

// Schema và Type cho việc cập nhật trạng thái đơn hàng
export const UpdateOrderStatusZodSchema = z
  .object({
    status: z.nativeEnum(OrderStatus), // Sử dụng nativeEnum cho enum từ Prisma
  })
  .strict();
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusZodSchema>;

// PaymentResultPayload đã được di chuyển sang payments-app/src/payments/payments.interface.ts
// và sẽ được import trực tiếp vào order-events.consumer.ts

export interface PaymentResultPayload {
  orderId: string;
  status: 'confirmed' | 'declined';
}

export interface InventoryInsufficientPayload {
  orderId: string;
  productId: string;
  requestedQuantity: number;
  availableStock: number;
}

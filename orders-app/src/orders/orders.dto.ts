// orders-app/src/orders/orders.dto.ts
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

// Schema và Type cho việc tạo OrderItem
// GIÁ SẢN PHẨM KHÔNG CÒN ĐƯỢC TRUYỀN LÊN TỪ CLIENT NỮA
export const CreateOrderItemZodSchema = z.object({
  productId: z.string().min(1, { message: 'Product ID is required' }),
  quantity: z.number().int().min(1, { message: 'Quantity must be at least 1' }),
  price: z.number().min(0, { message: 'Price cannot be negative' }).optional(),
});
export type CreateOrderItemDto = z.infer<typeof CreateOrderItemZodSchema>;

// Schema và Type cho việc tạo Order
export const CreateOrderZodSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  orderItems: z
    .array(CreateOrderItemZodSchema)
    .min(1, { message: 'Order must contain at least one item' }),
});
export type CreateOrderDto = z.infer<typeof CreateOrderZodSchema>;

// Schema và Type cho việc cập nhật trạng thái đơn hàng
export const UpdateOrderStatusZodSchema = z.object({
  status: z.nativeEnum(OrderStatus), // Sử dụng nativeEnum cho enum từ Prisma
});
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusZodSchema>;
export interface PaymentResultPayload {
  orderId: string;
  status: 'confirmed' | 'declined';
}

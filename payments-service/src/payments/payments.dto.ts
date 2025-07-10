import { z } from 'zod';

// Process Payment DTO
export const ProcessPaymentDto = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  amount: z.number().positive('Amount must be positive'),
  userId: z.string().nonempty('User ID is required'),
});

export type ProcessPaymentDto = z.infer<typeof ProcessPaymentDto>;

export const CreateUserAccountDto = z.object({
  userId: z.string().nonempty('User ID is required'),
});
export type CreateUserAccountDtoType = z.infer<typeof CreateUserAccountDto>;

export const DepositWithdrawDto = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
});
export type DepositWithdrawDtoType = z.infer<typeof DepositWithdrawDto>;

export const RefundPaymentDto = z.object({
  orderId: z.string().nonempty('Order ID is required'),
});
export type RefundPaymentDtoType = z.infer<typeof RefundPaymentDto>;

// Get Balance DTO
export const GetBalanceDto = z.object({
  userId: z.string().nonempty('User ID is required'),
});

export type GetBalanceDto = z.infer<typeof GetBalanceDto>;

// Response DTOs
export interface PaymentResultDto {
  orderId: string;
  status: 'confirmed' | 'declined';
  message: string;
  transactionId?: string;
}

export interface UserAccountDto {
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionDto {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

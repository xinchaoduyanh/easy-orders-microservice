// payments-app/src/payments/payments.interface.ts

// Interface for payment request payload from Orders App
export interface PaymentRequestPayload {
  userId: string;
  orderId: string;
  amount: number;
}

// Interface for payment result payload sent back to Orders App
export interface PaymentResultPayload {
  orderId: string;
  status: 'confirmed' | 'declined';
}

// Interface for user registered event from Auth App
export interface UserRegisteredPayload {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  provider: string;
}

// payments-app/src/payments/payments.interface.ts

// Interface for payment request payload from Orders App
export interface ProcessPaymentPayload {
  orderId: string;
  amount: number;
  userEmail: string; // Or any other mocked authentication information
}

// Interface for payment result payload sent back to Orders App
export interface PaymentResultPayload {
  orderId: string;
  status: 'confirmed' | 'declined';
}

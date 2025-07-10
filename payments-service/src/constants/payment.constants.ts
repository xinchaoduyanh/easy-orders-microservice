// Payment Service Constants
export const PAYMENT_CONSTANTS = {
  // Default balance for new user accounts
  DEFAULT_BALANCE: 10000,

  // Transaction types
  TRANSACTION_TYPES: {
    PAYMENT: 'PAYMENT',
    REFUND: 'REFUND',
    DEPOSIT: 'DEPOSIT',
    WITHDRAWAL: 'WITHDRAWAL',
  },

  // Transaction statuses
  TRANSACTION_STATUSES: {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
  },

  // Kafka topics - Updated to follow standard: Service + Business Logic + Target Service
  KAFKA_TOPICS: {
    // Auth Service -> Payments Service: User registration event
    USER_REGISTERED: 'auth.user.registered.payments',
    // Orders Service -> Payments Service: Payment request event
    PAYMENT_REQUEST: 'orders.payment.request.payments',
    // Payments Service -> Orders Service: Payment result event
    PAYMENT_RESULTS: 'payments.payment.result.orders',
  },
} as const;

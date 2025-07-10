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

  // Kafka topics
  KAFKA_TOPICS: {
    USER_REGISTERED: 'user_registered',
    PAYMENT_RESULTS: 'payment_results',
  },
} as const;

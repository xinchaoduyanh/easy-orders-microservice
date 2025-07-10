// Notifications Service Constants
export const NOTIFICATION_CONSTANTS = {
  // Kafka topics - Updated to follow standard: Service + Business Logic + Target Service
  KAFKA_TOPICS: {
    // Orders Service -> Notifications Service: Order delivered event
    ORDER_DELIVERED: 'orders.order.delivered.notifications',
  },
} as const;

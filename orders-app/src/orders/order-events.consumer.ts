// orders-app/src/orders/order-events.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  // Ctx,
  // KafkaContext, // Không dùng, có thể comment out hoặc xóa
  Payload,
} from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
// Import PaymentResultPayload từ payments-app

interface PaymentResultPayload {
  orderId: string;
  status: 'confirmed' | 'declined';
}
@Controller() // Controller này sẽ hoạt động như một Kafka consumer
export class OrderEventsConsumer {
  private readonly logger = new Logger(OrderEventsConsumer.name);

  constructor(private readonly ordersService: OrdersService) {
    this.logger.log(
      'OrderEventsConsumer initialized and listening for payment_results topic',
    );
    this.logger.log(
      `Process PID: ${process.pid}, ENV: ${process.env.NODE_ENV}`,
    );
  }

  @EventPattern('payment_results') // Lắng nghe topic 'payment_results' từ Kafka
  async handlePaymentResult(
    @Payload() data: PaymentResultPayload,
    // @Ctx() context: KafkaContext, // Không dùng context, có thể comment out hoặc xóa
  ) {
    const now = new Date().toISOString();
    this.logger.log(
      `[${now}] [EVENT] Received payment result for order ${data.orderId}: ${data.status}`,
    );
    this.logger.log(
      `[${now}] [EVENT] Raw payment result data: ${JSON.stringify(data)}`,
    );
    // console.log('Original Kafka message:', originalMessage.value.toString()); // Có thể log raw message để debug

    let newStatus: OrderStatus;
    if (data.status === 'confirmed') {
      newStatus = OrderStatus.CONFIRMED;
      this.logger.log(
        `Order ${data.orderId} payment confirmed. Order moved to CONFIRMED state. Will be delivered in 5 seconds.`,
      );
    } else {
      newStatus = OrderStatus.CANCELLED; // Nếu bị declined, chuyển sang CANCELLED
      this.logger.warn(
        `Order ${data.orderId} payment declined. Order moved to CANCELED state.`,
      );
    }

    try {
      await this.ordersService.updateOrderStatus(data.orderId, {
        status: newStatus,
      });
      this.logger.log(`Order ${data.orderId} status updated to: ${newStatus}`);
    } catch (error) {
      this.logger.error(
        `Error updating order status for ${data.orderId}: ${error.message}`,
        error.stack,
      );
      // TODO: Xử lý lỗi nâng cao hơn: Ví dụ, đẩy vào Dead Letter Queue (DLQ)
      // để có thể xem xét và xử lý lại sau nếu lỗi là tạm thời.
    }
  }
}

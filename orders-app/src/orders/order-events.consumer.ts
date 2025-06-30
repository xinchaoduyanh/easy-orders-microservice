// orders-app/src/orders/order-events.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  // Ctx,
  // KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
import { PaymentResultPayload } from './orders.dto';

@Controller() // Controller này sẽ hoạt động như một Kafka consumer
export class OrderEventsConsumer {
  private readonly logger = new Logger(OrderEventsConsumer.name);

  constructor(private readonly ordersService: OrdersService) {}

  @EventPattern('payment_results') // Lắng nghe topic 'payment_results' từ Kafka
  async handlePaymentResult(
    @Payload() data: PaymentResultPayload,
    // @Ctx() context: KafkaContext,
  ) {
    // const originalMessage = context.getMessage();
    this.logger.log(
      `Received payment result for order ${data.orderId}: ${data.status}`,
    );
    // console.log('Original Kafka message:', originalMessage.value.toString()); // Có thể log raw message để debug

    let newStatus: OrderStatus;
    if (data.status === 'confirmed') {
      newStatus = OrderStatus.CONFIRMED;
    } else {
      newStatus = OrderStatus.CANCELLED; // Nếu bị declined, chuyển sang CANCELLED
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

// orders-app/src/orders/order-events.consumer.ts
import { Controller, Logger, Inject, OnModuleInit } from '@nestjs/common';
import {
  EventPattern,
  // Ctx,
  // KafkaContext, // Không dùng, có thể comment out hoặc xóa
  Payload,
  ClientKafka,
} from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
import { PaymentResultPayload } from './orders.dto';

@Controller()
export class OrderEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(OrderEventsConsumer.name);

  constructor(
    private readonly ordersService: OrdersService,
    @Inject('KAFKA_ORDER_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    this.logger.log(
      'OrderEventsConsumer initialized and listening for payments.payment.result.orders and inventory topics',
    );
    this.logger.log(`Process PID: ${process.pid}`);
  }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('payments.payment.result.orders');
    await this.kafkaClient.connect();
  }

  @EventPattern('payments.payment.result.orders') // Lắng nghe topic từ Payments Service
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

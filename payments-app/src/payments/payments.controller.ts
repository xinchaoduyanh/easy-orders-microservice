// payments-app/src/payments/payments.controller.ts
import { Controller, Logger } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  KafkaContext,
} from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { ProcessPaymentPayload } from './payments.interface'; // Import interface

@Controller()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  // Listen to the 'order_events' topic from Orders App
  @MessagePattern('order_events')
  async handlePaymentRequest(
    @Payload() data: ProcessPaymentPayload,
    @Ctx() context: KafkaContext,
  ) {
    const originalMessage = context.getMessage();
    this.logger.log(
      `Received payment request for order ID: ${data.orderId} from Kafka. Message: ${originalMessage?.value?.toString()}`,
    );
    // console.log('Full Kafka message:', originalMessage.value.toString()); // Can log raw message value for debugging

    try {
      await this.paymentsService.processPayment(data);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        this.logger.error(
          `Error processing payment for order ${data.orderId}: ${(error as Error).message}`,
          (error as Error).stack,
        );
      } else {
        this.logger.error(
          `Error processing payment for order ${data.orderId}: ${String(error)}`,
        );
      }
      // TODO: Error handling: Could push to a Dead Letter Queue (DLQ)
    }
  }
}

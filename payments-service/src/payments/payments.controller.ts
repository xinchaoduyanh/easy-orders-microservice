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
    await this.paymentsService.processPayment(data);
  }
}

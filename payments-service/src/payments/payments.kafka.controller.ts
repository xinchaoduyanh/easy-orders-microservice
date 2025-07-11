import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  KafkaContext,
} from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { PAYMENT_CONSTANTS } from '../constants/payment.constants';
import { PaymentRequestPayload } from './payments.interface';

@Controller()
export class PaymentsKafkaController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(PAYMENT_CONSTANTS.KAFKA_TOPICS.PAYMENT_REQUEST)
  async handlePaymentRequest(
    @Payload() data: PaymentRequestPayload,
    @Ctx() context: KafkaContext,
  ) {
    const originalMessage = context.getMessage();
    // Optional: log message if needed
    // console.log(`Received payment request for order ID: ${data.orderId} from Kafka. Message: ${originalMessage?.value?.toString()}`);
    await this.paymentsService.processPayment(data);
  }
}

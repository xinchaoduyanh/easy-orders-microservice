// payments-app/src/payments/payments.service.ts
import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ProcessPaymentPayload,
  PaymentResultPayload,
} from './payments.interface';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject('KAFKA_PAYMENT_SERVICE') private readonly kafkaClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('PaymentsService Kafka producer connected.');
  }

  async processPayment(payload: ProcessPaymentPayload): Promise<void> {
    this.logger.log(
      `Received payment request for Order ID: ${payload.orderId}, Amount: ${payload.amount}`,
    );

    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500),
    );

    let status: 'confirmed' | 'declined';
    if (payload.amount > 5000) {
      status = 'declined';
      this.logger.warn(
        `Insufficient funds to process order ${payload.orderId}. Declined.`,
      );
    } else {
      status = 'confirmed';
      this.logger.log(`Payment for order ${payload.orderId} confirmed.`);
    }

    const paymentResult: PaymentResultPayload = {
      orderId: payload.orderId,
      status: status,
    };

    this.logger.log(
      `Preparing to send payment result: ${JSON.stringify(paymentResult)}`,
    );

    try {
      await firstValueFrom(
        this.kafkaClient.emit('payment_results', paymentResult),
      );
      this.logger.log(
        `Payment for order ${payload.orderId} resulted in: ${status}. Result sent back to Orders App via Kafka.`,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;
      this.logger.error(
        `Failed to emit payment result for order ${payload.orderId}: ${errorMessage}`,
        errorStack,
      );
      throw err;
    }
  }
}

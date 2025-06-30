// payments-app/src/payments/payments.service.ts
import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ProcessPaymentPayload,
  PaymentResultPayload,
} from './payments.interface'; // Import interfaces

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    // Inject Kafka Client to send results back to Order App
    @Inject('ORDER_SERVICE_KAFKA') private readonly clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    // Connect to the Kafka broker when the module initializes
    await this.clientKafka.connect();
    this.logger.log('Connected to Kafka for ORDER_SERVICE_KAFKA client.');
  }

  async processPayment(payload: ProcessPaymentPayload): Promise<void> {
    this.logger.log(
      `Received payment request for Order ID: ${payload.orderId}, Amount: ${payload.amount}`,
    );

    // Simulate a small delay to mimic payment processing
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 500),
    ); // 0.5s - 2.5s delay

    // Mocked payment logic: return either 'confirmed' or 'declined' randomly
    const isConfirmed = Math.random() > 0.5; // 50% confirmed, 50% declined
    const status: 'confirmed' | 'declined' = isConfirmed
      ? 'confirmed'
      : 'declined';

    const paymentResult: PaymentResultPayload = {
      orderId: payload.orderId,
      status: status,
    };

    // Send payment result back to Orders App via Kafka topic 'payment_results'
    this.clientKafka.emit(
      'payment_results', // Topic
      paymentResult,
    );
    this.logger.log(
      `Payment for order ${payload.orderId} resulted in: ${status}. Result sent to Kafka.`,
    );
  }
}

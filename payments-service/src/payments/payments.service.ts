// payments-app/src/payments/payments.service.ts
import {
  Injectable,
  Logger, // Inject, // Không cần Inject ClientKafka nữa
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices'; // Remove Transport import
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { firstValueFrom } from 'rxjs';
import {
  ProcessPaymentPayload,
  PaymentResultPayload,
} from './payments.interface'; // Import interfaces

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name);
  private clientKafka: ClientKafka; // Khai báo clientKafka là một thuộc tính của class

  constructor(
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    // Khởi tạo ClientKafka trực tiếp
    this.clientKafka = new ClientKafka({
      client: {
        clientId: 'payments-app-order-producer',
        brokers: [
          this.configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
        ],
      },
      // Add any other needed Kafka options here
    });
  }

  async onModuleInit() {
    await this.clientKafka.connect(); // Kết nối tới Kafka broker
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
        this.clientKafka.emit('payment_results', paymentResult),
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

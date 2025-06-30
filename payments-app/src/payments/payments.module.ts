// payments-app/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ClientsModule is needed for PaymentsService to ACT AS A PRODUCER
    // (to send 'payment_results' messages back to Orders App).
    // We register it here so PaymentsService can inject 'ORDER_SERVICE_KAFKA'.
    ClientsModule.registerAsync([
      {
        name: 'ORDER_SERVICE_KAFKA', // Token name for injecting ClientKafka
        imports: [ConfigModule], // Import ConfigModule to use ConfigService
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
            },
            // No consumer groupId is needed here as this client is primarily a PRODUCER.
            // The main Kafka CONSUMER for 'order_events' is configured in main.ts.
          },
        }),
        inject: [ConfigService], // Inject ConfigService into useFactory
      },
    ]),
  ],
  providers: [PaymentsService], // Register the service
  controllers: [PaymentsController], // Register the controller (which acts as a Kafka consumer)
})
export class PaymentsModule {}

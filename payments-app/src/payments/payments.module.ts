// payments-app/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService

@Module({
  imports: [
    // ClientsModule to allow payments-app to send Kafka messages to orders-app
    ClientsModule.registerAsync([
      {
        name: 'ORDER_SERVICE_KAFKA', // Token name to inject ClientKafka
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
            },
            // No consumer groupId needed here if PaymentsService is only a producer for this client
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [PaymentsService], // Register service
  controllers: [PaymentsController], // Register controller (Kafka consumer)
})
export class PaymentsModule {}

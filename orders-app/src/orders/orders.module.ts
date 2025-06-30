// orders-app/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEventsConsumer } from './order-events.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule và ConfigService

@Module({
  imports: [
    // ClientsModule để orders-app có thể gửi tin nhắn Kafka tới payments-app
    ClientsModule.registerAsync([
      {
        name: 'PAYMENT_SERVICE_KAFKA', // Tên token để inject ClientKafka
        imports: [ConfigModule], // Import ConfigModule để sử dụng ConfigService
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              // Lấy Kafka broker từ biến môi trường (ví dụ: KAFKA_BROKER=localhost:9092 trong .env)
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
            },
            consumer: {
              // Group ID cho consumer của orders-app (nếu OrdersService cũng cần subscribe topic khác)
              groupId: 'orders-app-producer-group', // Đặt một group ID hợp lý
            },
          },
        }),
        inject: [ConfigService], // Inject ConfigService vào useFactory
      },
    ]),
  ],
  providers: [OrdersService, OrderEventsConsumer], // Đăng ký service và consumer
  controllers: [OrdersController], // Đăng ký controller
})
export class OrdersModule {}

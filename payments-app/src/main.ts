// payments-app/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  console.log('KAFKA_BROKER from config:', configService.get('KAFKA_BROKER'));

  // Đây là Kafka Microservice Consumer của Payments App
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'payments-app-main-consumer-client', // ClientId rõ ràng cho consumer chính
          brokers: [
            configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
          ],
        },
        consumer: {
          groupId: 'payments-app-order-consumer-group', // Group ID duy nhất cho consumer lệnh đơn hàng
        },
      },
    });
  await microservice.listen();
  console.log(
    'Payments App (Kafka Microservice) is listening for order events...',
  );
}
bootstrap();

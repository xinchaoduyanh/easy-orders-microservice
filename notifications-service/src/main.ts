import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import envConfig from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'notifications-app-main-consumer-client', // ClientId rõ ràng cho consumer chính
          brokers: [envConfig.KAFKA_BROKER],
        },
        consumer: {
          groupId: 'notifications-app-order-consumer-group', // Group ID duy nhất cho consumer lệnh đơn hàng
        },
      },
    });
  await microservice.listen();
  console.log(
    'Notifications App (Kafka Microservice) is listening for order events...',
  );
  await app.listen(3002); // hoặc cổng bạn muốn
}
bootstrap();

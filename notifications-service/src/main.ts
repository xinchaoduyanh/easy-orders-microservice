import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { createKafkaConnectConfig } from 'microservice-shared';
import envConfig from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      createKafkaConnectConfig('notifications-app', [envConfig.KAFKA_BROKER]),
    );
  await microservice.listen();
  console.log(
    'Notifications App (Kafka Microservice) is listening for order events...',
  );
  await app.listen(3002);
}
bootstrap();

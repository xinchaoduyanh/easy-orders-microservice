// payments-app/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { createKafkaConnectConfig } from 'microservice-shared';
import envConfig from 'config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  console.log('KAFKA_BROKER from config:', configService.get('KAFKA_BROKER'));

  // Đây là Kafka Microservice Consumer của Payments App
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      createKafkaConnectConfig('payments-app', [envConfig.KAFKA_BROKER]),
    );
  await microservice.listen();
  console.log(
    'Payments App (Kafka Microservice) is listening for order events...',
  );
}
bootstrap();

// payments-app/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

async function bootstrap() {
  // Create an application context to get ConfigService
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  // Create the Kafka Microservice
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule, // Use AppModule as it contains the PaymentsModule and Kafka consumers
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [
              configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
            ],
          },
          consumer: {
            groupId: 'payments-app-consumer', // Group ID for payments-app consumer
          },
        },
      },
    );
  await microservice.listen();
  console.log(
    'Payments App (Kafka Microservice) is listening for order events...',
  );
}
bootstrap();

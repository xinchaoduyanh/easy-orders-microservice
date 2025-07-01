// orders-app/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService);
  const kafkaBroker =
    configService.get<string>('KAFKA_BROKER') || 'localhost:9092';

  console.log(`KAFKA_BROKER from config: ${kafkaBroker}`);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'orders-app-main-consumer-client',
        brokers: [kafkaBroker],
      },
      consumer: {
        groupId: 'orders-app-results-consumer-group-v2',
      },
    },
  });

  await app.startAllMicroservices();
  console.log(
    'Orders App (Kafka Consumer) is listening for payment results...',
  );

  const httpPort = process.env.HTTP_PORT || 3000;
  await app.listen(httpPort);
  console.log(`Orders App (HTTP Gateway) is listening on port ${httpPort}`);
}
bootstrap();

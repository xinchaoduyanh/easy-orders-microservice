import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import envConfig from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const kafkaBroker = envConfig.KAFKA_BROKER;

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

  const httpPort = envConfig.HTTP_PORT;
  await app.listen(httpPort);
  console.log(`Orders App (HTTP Gateway) is listening on port ${httpPort}`);
}
bootstrap();

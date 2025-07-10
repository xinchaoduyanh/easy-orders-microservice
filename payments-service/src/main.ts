// payments-app/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { Reflector } from '@nestjs/core';
import envConfig from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  // Enable CORS
  app.enableCors({
    origin: envConfig.FRONTEND_URL,
    credentials: true,
  });

  // Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `${envConfig.PAYMENT_SERVICE_NAME}-main-consumer-client`,
        brokers: [envConfig.KAFKA_BROKER],
      },
      consumer: {
        groupId: `${envConfig.PAYMENT_SERVICE_NAME}-results-consumer-group-v2`,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(envConfig.HTTP_PORT);

  console.log(`Payments service is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${envConfig.NODE_ENV}`);
  console.log(`Kafka Broker: ${envConfig.KAFKA_BROKER}`);
}
bootstrap();

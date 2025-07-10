import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import envConfig from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `${envConfig.AUTH_SERVICE_NAME}-main-consumer-client`,
        brokers: [envConfig.KAFKA_BROKER],
      },
      consumer: {
        groupId: `${envConfig.AUTH_SERVICE_NAME}-results-consumer-group-v2`,
      },
    },
  });

  await app.startAllMicroservices();

  const port = configService.get('PORT', envConfig.HTTP_PORT);
  await app.listen(port);

  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
  console.log(`Environment: ${envConfig.NODE_ENV}`);
  console.log(`Kafka Broker: ${envConfig.KAFKA_BROKER}`);
}

bootstrap();

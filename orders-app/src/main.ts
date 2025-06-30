// orders-app/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service'; // Import PrismaService
import { MicroserviceOptions, Transport } from '@nestjs/microservices'; // Đảm bảo import này đúng
// import { ConfigService } from '@nestjs/config'; // Đảm bảo import này đúng

async function bootstrap() {
  // Tạo ứng dụng NestJS (HTTP server)
  const app = await NestFactory.create(AppModule);

  // Kích hoạt CORS (quan trọng cho frontend)
  app.enableCors();

  // Lấy PrismaService instance và kích hoạt shutdown hooks
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Lắng nghe các yêu cầu HTTP
  const httpPort = process.env.HTTP_PORT || 3000;
  await app.listen(httpPort);
  console.log(`Orders App (HTTP Gateway) is listening on port ${httpPort}`);

  // Tạo và lắng nghe Kafka Microservice cho consumer (để nhận kết quả thanh toán)
  // Đây là một instance microservice riêng, không phải HTTP gateway
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule, // Vẫn sử dụng AppModule vì các consumer được định nghĩa trong đó
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: 'orders-app-consumer', // Group ID để nhận message từ 'payment_results'
          },
        },
      },
    );
  await microservice.listen();
  console.log(
    'Orders App (Kafka Consumer) is listening for payment results...',
  );
}
bootstrap();

// orders-app/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module'; // Import OrdersModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { APP_PIPE } from '@nestjs/core'; // Import APP_PIPE
import { ZodValidationPipe } from 'nestjs-zod'; // Import ZodValidationPipe

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Tải biến môi trường từ .env
    PrismaModule, // PrismaModule đã được @Global(), nhưng vẫn nên import ở đây cho rõ ràng
    OrdersModule, // Import OrdersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE, // Cấu hình ZodValidationPipe là global pipe
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}

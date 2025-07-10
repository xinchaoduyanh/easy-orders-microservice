// orders-app/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module'; // Import OrdersModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'; // Import APP_PIPE
import { HttpExceptionFilter } from 'src/shared/filter/http_exception.filter';
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { ProductsModule } from './products/products.module';
import { KafkaModule } from 'microservice-shared';
import { OrdersGateway } from './orders/orders.gateway';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    OrdersModule,
    ProductsModule,
    KafkaModule.register(['order']),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OrdersGateway,
    JwtStrategy,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

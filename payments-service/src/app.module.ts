// payments-app/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module'; // Import PaymentsModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { HttpExceptionFilter } from 'src/shared/filter/http_exception.filter';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe';
import { ZodSerializerInterceptor } from 'nestjs-zod';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

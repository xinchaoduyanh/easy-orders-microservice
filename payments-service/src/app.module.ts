// payments-app/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module'; // Import PaymentsModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { KafkaModule } from 'microservice-shared';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PaymentsModule,
    KafkaModule.register(['payment']),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

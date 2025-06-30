// payments-app/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module'; // Import PaymentsModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// payments-app/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
// Không cần ClientsModule ở đây nữa
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ClientsModule đã được loại bỏ khỏi đây.
    // Client Kafka (producer) sẽ được khởi tạo thủ công trong PaymentsService.
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}

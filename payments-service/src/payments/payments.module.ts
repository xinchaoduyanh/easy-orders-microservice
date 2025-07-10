// payments-app/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { UserRegisteredConsumer } from './user-registered.consumer';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController, UserRegisteredConsumer],
  providers: [PaymentsService],
})
export class PaymentsModule {}

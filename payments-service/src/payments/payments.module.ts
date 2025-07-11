// payments-app/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
// import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { UserRegisteredConsumer } from './user-registered.consumer';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsRestController } from 'src/payments/payments.rest.controller';
import { PaymentsKafkaController } from 'src/payments/payments.kafka.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    // PaymentsController,
    UserRegisteredConsumer,
    PaymentsRestController,
    PaymentsKafkaController,
  ],
  providers: [PaymentsService],
})
export class PaymentsModule {}

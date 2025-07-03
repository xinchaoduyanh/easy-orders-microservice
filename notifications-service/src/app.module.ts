import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka/kafka.service';
import { ResendService } from './resend/resend.service';
import { KafkaModule } from 'microservice-shared';
import { OrderDeliveredConsumer } from './kafka/order-delivered.consumer';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KafkaModule.register(['notification']),
  ],
  providers: [KafkaService, ResendService],
  controllers: [OrderDeliveredConsumer],
})
export class AppModule {}

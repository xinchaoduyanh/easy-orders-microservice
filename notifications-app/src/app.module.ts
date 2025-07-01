import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka/kafka.service';
import { ResendService } from './resend/resend.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [KafkaService, ResendService],
})
export class AppModule {}

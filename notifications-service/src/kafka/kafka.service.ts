import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { ResendService } from '../resend/resend.service';
import { ClientProxy } from '@nestjs/microservices';
import { OrderDeliveredNotification } from './interfaces';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);
  constructor(
    private readonly resendService: ResendService,
    @Inject('KAFKA_NOTIFICATION_SERVICE')
    private readonly kafkaClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('NotificationsService Kafka producer connected.');
  }

  // Nếu chỉ muốn gửi message:
  async sendOrderDeliveredEmail(data: OrderDeliveredNotification) {
    await this.resendService.sendOrderDeliveredEmail(data);
  }
}

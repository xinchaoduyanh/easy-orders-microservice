import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ResendService } from '../resend/resend.service';
import { OrderDeliveredNotification } from './interfaces';
import { NOTIFICATION_CONSTANTS } from '../constants/notification.constants';

@Controller()
export class OrderDeliveredConsumer {
  constructor(private readonly resendService: ResendService) {}

  @EventPattern(NOTIFICATION_CONSTANTS.KAFKA_TOPICS.ORDER_DELIVERED)
  async handleOrderDelivered(@Payload() data: any) {
    const payload: OrderDeliveredNotification = data;
    await this.resendService.sendOrderDeliveredEmail(payload);
  }
}

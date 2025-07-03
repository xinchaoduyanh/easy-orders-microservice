import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ResendService } from '../resend/resend.service';
import { OrderDeliveredNotification } from 'microservice-shared';

@Controller()
export class OrderDeliveredConsumer {
  constructor(private readonly resendService: ResendService) {}

  @EventPattern('order-delivered')
  async handleOrderDelivered(@Payload() data: any) {
    const payload: OrderDeliveredNotification = data;
    await this.resendService.sendOrderDeliveredEmail(payload);
  }
}

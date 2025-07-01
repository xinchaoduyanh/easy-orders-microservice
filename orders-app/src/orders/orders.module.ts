// orders-app/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEventsConsumer } from './order-events.consumer';
// Không cần ClientsModule ở đây nữa, ClientsModule sẽ được cấu hình trực tiếp trong service
// import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // ClientsModule đã được loại bỏ khỏi đây.
    // Client Kafka (producer) sẽ được khởi tạo thủ công trong OrdersService.
  ],
  providers: [OrdersService],
  controllers: [OrdersController, OrderEventsConsumer], // Đưa OrderEventsConsumer vào controllers
})
export class OrdersModule {}

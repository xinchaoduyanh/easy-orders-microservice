// orders-app/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderEventsConsumer } from './order-events.consumer';

@Module({
  imports: [],
  controllers: [OrdersController, OrderEventsConsumer],
  providers: [OrdersService, OrdersGateway, PrismaService],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule {}

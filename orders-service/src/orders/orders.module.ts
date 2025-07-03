// orders-app/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEventsConsumer } from './order-events.consumer';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  providers: [OrdersService, PrismaService],
  controllers: [OrdersController, OrderEventsConsumer],
})
export class OrdersModule {}

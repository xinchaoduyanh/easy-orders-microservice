// orders-app/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEventsConsumer } from './order-events.consumer';
import { ProductsController } from '../products/products.controller';
import { ProductsService } from '../products/products.service';
import { PrismaService } from '../prisma/prisma.service';
// Không cần ClientsModule ở đây nữa, ClientsModule sẽ được cấu hình trực tiếp trong service
// import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [],
  providers: [OrdersService, PrismaService, ProductsService],
  controllers: [OrdersController, OrderEventsConsumer, ProductsController], // Đăng ký controller
})
export class OrdersModule {}

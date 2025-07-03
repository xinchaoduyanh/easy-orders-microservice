// orders-app/src/orders/orders.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  // Inject, // Không cần Inject ClientKafka nữa
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices'; // Remove Transport import
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import {
  CreateOrderDto,
  // CreateOrderItemDto, // Remove unused import
  UpdateOrderStatusDto,
  OrderItemForDbCreation,
} from './orders.dto';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private readonly DELIVERY_DELAY_MS = 20 * 1000; // 20 giây delay cho việc giao hàng (có thể cấu hình)
  private clientKafka: ClientKafka; // Khai báo clientKafka là một thuộc tính của class

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    // Khởi tạo ClientKafka trực tiếp
    this.clientKafka = new ClientKafka({
      client: {
        clientId: 'orders-app-payment-producer', // ClientId rõ ràng cho producer
        brokers: [
          this.configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
        ],
      },
      // Add any other needed Kafka options here
    });
  }

  async onModuleInit() {
    // Không cần subscribeToResponseOf ở đây
    await this.clientKafka.connect(); // Kết nối tới Kafka broker
    this.logger.log('OrdersService Kafka producer connected.');
  }

  // ... (các phương thức khác như createOrder, getOrderById, updateOrderStatus, getAllOrders, cancelOrder)
  // Logic bên trong các phương thức này không thay đổi, chỉ cách clientKafka được inject/khởi tạo thay đổi.

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      let totalAmount: number = 0;
      const orderItemsToCreate: OrderItemForDbCreation[] = [];

      for (const itemDto of createOrderDto.orderItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: itemDto.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${itemDto.productId} not found.`,
          );
        }

        const itemPrice = product.price.toNumber();
        const itemTotal = itemPrice * itemDto.quantity;
        totalAmount += itemTotal;

        orderItemsToCreate.push({
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          price: itemPrice,
        });
      }

      const order = await this.prisma.order.create({
        data: {
          userEmail: createOrderDto.userEmail,
          totalAmount: totalAmount,
          status: OrderStatus.CREATED,
          orderItems: {
            create: orderItemsToCreate,
          },
        },
        include: {
          orderItems: true,
        },
      });

      this.logger.log(`Order ${order.id} created.`);

      // Gửi sự kiện yêu cầu thanh toán tới Kafka topic 'order_events'
      this.clientKafka.emit('order_events', {
        orderId: order.id,
        amount: order.totalAmount,
        userEmail: createOrderDto.userEmail,
      });
      this.logger.log(`Payment request for order ${order.id} sent to Kafka.`);

      return order;
    } catch (error) {
      this.logger.error(
        `Failed to create order: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to create order due to an internal error.',
      );
    }
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    this.logger.log(`Fetched order: ${order.id}`);
    return order;
  }

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });
      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found.`);
      }

      if (
        existingOrder.status === OrderStatus.DELIVERED &&
        updateOrderStatusDto.status !== OrderStatus.DELIVERED
      ) {
        throw new BadRequestException(
          `Cannot change status from DELIVERED to ${updateOrderStatusDto.status}`,
        );
      }
      if (existingOrder.status === OrderStatus.CANCELLED) {
        throw new BadRequestException(
          `Cannot change status for a CANCELLED order.`,
        );
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: updateOrderStatusDto.status },
        include: { orderItems: true },
      });
      this.logger.log(
        `Order ${updatedOrder.id} status updated to ${updatedOrder.status}`,
      );

      if (updatedOrder.status === OrderStatus.CONFIRMED) {
        this.logger.log(
          `Order ${updatedOrder.id} is CONFIRMED. Scheduling auto-delivery in ${this.DELIVERY_DELAY_MS / 1000} seconds.`,
        );
        setTimeout(() => {
          void (async () => {
            try {
              const currentOrder = await this.prisma.order.findUnique({
                where: { id },
              });
              if (
                currentOrder &&
                currentOrder.status === OrderStatus.CONFIRMED
              ) {
                const deliveredOrder = await this.prisma.order.update({
                  where: { id },
                  data: { status: OrderStatus.DELIVERED },
                });
                this.logger.log(
                  `Order ${deliveredOrder.id} automatically moved to DELIVERED state.`,
                );
                await this.notifyOrderDelivered(deliveredOrder);
              } else if (currentOrder) {
                this.logger.warn(
                  `Order ${id} status changed from CONFIRMED before auto-delivery. Current status: ${currentOrder.status}`,
                );
              }
            } catch (timeoutError) {
              this.logger.error(
                `Failed to auto-deliver order ${id}: ${timeoutError.message}`,
                timeoutError.stack,
              );
            }
          })();
        }, this.DELIVERY_DELAY_MS);
      }

      return updatedOrder;
    } catch (error) {
      this.logger.error(
        `Failed to update status for order ${id}: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to update order status due to an internal error.',
      );
    }
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    });
    this.logger.log(`Fetched ${orders.length} orders.`);
    return orders;
  }

  async cancelOrder(id: string): Promise<Order> {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });
      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found.`);
      }
      if (existingOrder.status === OrderStatus.DELIVERED) {
        throw new BadRequestException(`Cannot cancel a DELIVERED order.`);
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });
      this.logger.log(`Order ${order.id} cancelled.`);
      return order;
    } catch (error) {
      this.logger.error(
        `Failed to cancel order ${id}: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to cancel order due to an internal error.',
      );
    }
  }

  async notifyOrderDelivered(order: Order) {
    // Fetch order with items
    const fullOrder = await this.prisma.order.findUnique({
      where: { id: order.id },
      include: { orderItems: true },
    });

    if (!fullOrder) {
      this.logger.error(`Order with ID ${order.id} not found.`);
      return;
    }

    const message = {
      orderId: fullOrder.id,
      userEmail: fullOrder.userEmail,
      userName: 'John Doe', // TODO: Get user name from user service
      orderDetails: {
        products: fullOrder.orderItems,
        total: fullOrder.totalAmount,
      },
      deliveredAt: new Date().toISOString(),
    };

    this.clientKafka.emit('order-delivered', {
      value: JSON.stringify(message),
    });
    this.logger.log(
      `[ORDER] Đã gửi thông báo giao hàng tới Notifications App cho orderId=${fullOrder.id}, userEmail=${fullOrder.userEmail}`,
    );
  }
}

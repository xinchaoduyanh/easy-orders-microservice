import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderItemForDbCreation,
} from './orders.dto';
import { Order, OrderStatus } from '@prisma/client';
import { OrderDeliveredNotification } from '../kafka/interfaces';
import { OrdersGateway } from './orders.gateway';
import { ORDERS_KAFKA_TOPICS } from './orders.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private readonly DELIVERY_DELAY_MS = 20 * 1000; // 20 giây delay cho việc giao hàng (có thể cấu hình)

  constructor(
    private readonly prisma: PrismaService,
    @Inject('KAFKA_ORDER_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('payment_results');
    await this.kafkaClient.connect();
    this.logger.log('OrdersService Kafka producer connected.');
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      console.log('createOrderDto:', createOrderDto);
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
        });
      }

      const order = await this.prisma.order.create({
        data: {
          userEmail: createOrderDto.userEmail,
          userId: createOrderDto.userId,
          status: OrderStatus.CREATED,
          totalAmount: totalAmount,
          orderItems: {
            create: orderItemsToCreate,
          },
        },
        include: { orderItems: { include: { product: true } } },
      });

      this.ordersGateway.emitOrderCreated(order);
      this.logger.log(`Order ${order.id} created.`);

      this.logger.log(
        `About to emit payment request for order ${order.id} to Kafka`,
      );
      try {
        await this.kafkaClient
          .emit(ORDERS_KAFKA_TOPICS.PAYMENT_REQUEST, {
            orderId: order.id,
            amount: order.totalAmount,
            userEmail: createOrderDto.userEmail,
          })
          .toPromise();
        this.logger.log(`Payment request for order ${order.id} sent to Kafka.`);
      } catch (err) {
        this.logger.error(
          `Failed to emit payment request for order ${order.id}: ${err.message}`,
        );
      }

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
      include: { orderItems: { include: { product: true } } },
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

      const order = await this.prisma.order.update({
        where: { id },
        data: { status: updateOrderStatusDto.status },
        include: { orderItems: { include: { product: true } } },
      });
      this.ordersGateway.emitOrderUpdated(order);
      this.logger.log(`Order ${order.id} status updated to ${order.status}`);

      if (order.status === OrderStatus.CONFIRMED) {
        this.logger.log(
          `Order ${order.id} is CONFIRMED. Scheduling auto-delivery in ${this.DELIVERY_DELAY_MS / 1000} seconds.`,
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
                  include: { orderItems: { include: { product: true } } },
                });
                this.logger.log(
                  `Order ${deliveredOrder.id} automatically moved to DELIVERED state.`,
                );
                this.ordersGateway.emitOrderUpdated(deliveredOrder);
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

      return order;
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
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    this.logger.log(`Fetched ${orders.length} orders.`);
    return orders;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
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
      this.ordersGateway.emitOrderUpdated(order);
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
      include: { orderItems: { include: { product: true } } },
    });

    if (!fullOrder) {
      this.logger.error(`Order with ID ${order.id} not found.`);
      return;
    }

    const message: OrderDeliveredNotification = {
      orderId: fullOrder.id,
      userEmail: fullOrder.userEmail,
      userName: fullOrder.userEmail,
      orderDetails: {
        products: fullOrder.orderItems.map((item) => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          name: item.product.name,
          price: item.product.price.toNumber(),
          quantity: item.quantity,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        total: fullOrder.totalAmount.toNumber(),
      },
      deliveredAt: new Date().toISOString(),
    };
    this.logger.log(message.orderDetails);
    this.kafkaClient.emit(ORDERS_KAFKA_TOPICS.ORDER_DELIVERED, {
      value: message,
    });
    this.logger.log(
      `[ORDER] Đã gửi thông báo giao hàng tới Notifications App cho orderId=${fullOrder.id}, userEmail=${fullOrder.userEmail}, `,
    );
  }
}

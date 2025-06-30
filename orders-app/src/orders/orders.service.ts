// orders-app/src/orders/orders.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './orders.dto'; // Import DTOs từ file orders.dto.ts
import { Order, OrderStatus } from '@prisma/client';
import { CreateOrderItemDto } from './orders.dto'; // Import CreateOrderItemDto from orders.dto.ts

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('PAYMENT_SERVICE_KAFKA') private readonly clientKafka: ClientKafka, // Inject Kafka Client
  ) {}

  // Khi module khởi tạo, kết nối Kafka và đăng ký lắng nghe response
  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('payment_results'); // Lắng nghe kết quả thanh toán từ Kafka
    await this.clientKafka.connect(); // Kết nối tới Kafka broker
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // Tính tổng tiền đơn hàng từ các order items
      const totalAmount = createOrderDto.orderItems.reduce(
        (sum: number, item: CreateOrderItemDto) =>
          sum + item.quantity * item.price,
        0,
      );

      const order = await this.prisma.order.create({
        data: {
          userId: createOrderDto.userId,
          totalAmount: totalAmount,
          status: OrderStatus.CREATED, // Trạng thái mặc định khi tạo
          orderItems: {
            create: createOrderDto.orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: true, // Bao gồm orderItems trong kết quả trả về
        },
      });

      this.logger.log(`Order ${order.id} created.`);

      // Gửi sự kiện yêu cầu thanh toán tới Kafka topic 'order_events'
      // Payload bao gồm orderId và thông tin cần thiết cho Payment App
      this.clientKafka.emit('order_events', {
        orderId: order.id,
        amount: order.totalAmount,
        userId: order.userId, // Hoặc bất kỳ thông tin xác thực giả lập nào khác
      });
      this.logger.log(`Payment request for order ${order.id} sent to Kafka.`);

      return order;
    } catch (error) {
      this.logger.error(
        `Failed to create order: ${error.message}`,
        error.stack,
      );
      throw error;
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
      // Kiểm tra xem đơn hàng có tồn tại không
      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });
      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found.`);
      }

      // Logic chuyển đổi trạng thái (có thể được cải thiện bằng State Machine sau)
      // Ví dụ: Không cho phép chuyển từ DELIVERED trở lại các trạng thái khác
      if (
        existingOrder.status === OrderStatus.DELIVERED &&
        updateOrderStatusDto.status !== OrderStatus.DELIVERED
      ) {
        throw new Error(
          `Cannot change status from DELIVERED to ${updateOrderStatusDto.status}`,
        );
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: { status: updateOrderStatusDto.status },
        include: { orderItems: true },
      });
      this.logger.log(`Order ${order.id} status updated to ${order.status}`);
      return order;
    } catch (error) {
      this.logger.error(
        `Failed to update status for order ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
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
      // Ví dụ: Không cho phép hủy đơn hàng đã DELIVERED
      if (existingOrder.status === OrderStatus.DELIVERED) {
        throw new Error(`Cannot cancel a DELIVERED order.`);
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
      throw error;
    }
  }
}

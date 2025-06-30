// orders-app/src/orders/orders.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  Inject,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './orders.dto'; // Import DTOs từ file orders.dto.ts
import { Order, OrderStatus } from '@prisma/client';

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
      let totalAmount: number = 0;
      const orderItemsToCreate: {
        productId: string;
        quantity: number;
        price: number;
      }[] = [];

      // Lặp qua các item trong đơn hàng để tra cứu giá từ DB
      for (const itemDto of createOrderDto.orderItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: itemDto.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${itemDto.productId} not found.`,
          );
        }

        // Sử dụng giá từ DB, không phải từ DTO
        const itemPrice = product.price.toNumber(); // Chuyển Decimal từ Prisma sang number
        const itemTotal = itemPrice * itemDto.quantity;
        totalAmount += itemTotal;

        orderItemsToCreate.push({
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          price: itemPrice, // Lấy giá từ DB
        });
      }

      const order = await this.prisma.order.create({
        data: {
          userId: createOrderDto.userId,
          totalAmount: totalAmount,
          status: OrderStatus.CREATED, // Trạng thái mặc định khi tạo
          orderItems: {
            create: orderItemsToCreate,
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
      // Ném lỗi cụ thể hơn nếu cần, ví dụ BadRequestException cho lỗi nghiệp vụ
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
        throw new BadRequestException(
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
      // Ném lỗi cụ thể hơn nếu cần
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
      // Ví dụ: Không cho phép hủy đơn hàng đã DELIVERED
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
}

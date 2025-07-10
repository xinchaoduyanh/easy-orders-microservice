// orders-app/src/orders/orders.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Logger,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './orders.dto'; // Import DTOs (class)
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe';
import { CreateOrderZodSchema, UpdateOrderStatusZodSchema } from './orders.dto';
import { ResponseInterceptor } from 'src/shared/interceptor/response.interceptor';
import {
  ApiResponseOk,
  ApiResponseCreated,
} from 'src/shared/decorators/response.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AuthUser } from 'src/shared/interfaces/jwt-payload.interface';

@Controller('orders')
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiResponseCreated('Order created successfully')
  async createOrder(
    @Body(new CustomZodValidationPipe(CreateOrderZodSchema))
    createOrderDto: CreateOrderDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.ordersService.createOrder({
      ...createOrderDto,
      userId: user.userId,
    });
  }

  @Get('me')
  @ApiResponseOk('Orders of current user fetched successfully')
  async getMyOrders(@CurrentUser() user: AuthUser) {
    return this.ordersService.getOrdersByUserId(user.userId);
  }

  @Get()
  @ApiResponseOk('All orders fetched successfully')
  async getAllOrders() {
    this.logger.log('Received request to get all orders');
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  @ApiResponseOk('Order fetched successfully')
  async getOrderById(@Param('id') id: string) {
    this.logger.log(`Received request to get order by ID: ${id}`);
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id/status')
  @ApiResponseOk('Order status updated successfully')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body(new CustomZodValidationPipe(UpdateOrderStatusZodSchema))
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    this.logger.log(
      `Received request to update status for order ${id} to ${updateOrderStatusDto.status}`,
    );
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Patch(':id/cancel') // Endpoint riêng để hủy đơn hàng (theo yêu cầu đề bài)
  @ApiResponseOk('Order cancelled successfully')
  async cancelOrder(@Param('id') id: string) {
    this.logger.log(`Received request to cancel order ID: ${id}`);
    return this.ordersService.cancelOrder(id);
  }
}

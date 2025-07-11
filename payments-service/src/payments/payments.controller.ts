// payments-app/src/payments/payments.controller.ts
import {
  Controller,
  Logger,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  KafkaContext,
} from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { PaymentRequestPayload } from './payments.interface';
import { PAYMENT_CONSTANTS } from '../constants/payment.constants';
import {
  CreateUserAccountDto,
  DepositWithdrawDto,
  DepositWithdrawDtoType,
} from './payments.dto';
import CustomZodValidationPipe from '../shared/pipes/custom-zod-validation.pipe';
import { ApiResponseOk } from '../shared/decorators/response.decorator';
import { CurrentUser, AuthUser } from '../shared';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {
    this.logger.log(
      'PaymentService started and listening to Kafka topic order_events',
    );
  }

  // Kafka Consumer - Listen to the 'orders.payment.request.payments' topic from Orders Service
  @MessagePattern(PAYMENT_CONSTANTS.KAFKA_TOPICS.PAYMENT_REQUEST)
  async handlePaymentRequest(
    @Payload() data: PaymentRequestPayload,
    @Ctx() context: KafkaContext,
  ) {
    const originalMessage = context.getMessage();
    this.logger.log(
      `Received payment request for order ID: ${data.orderId} from Kafka. Message: ${originalMessage?.value?.toString()}`,
    );
    this.logger.log(`Received payment request data: ${JSON.stringify(data)}`);
    await this.paymentsService.processPayment(data);
  }

  // REST API Endpoints

  @Post('accounts')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new CustomZodValidationPipe(CreateUserAccountDto))
  @ApiResponseOk('User account created successfully')
  async createUserAccount(@CurrentUser() user: AuthUser) {
    return this.paymentsService.createUserAccount({ userId: user.userId });
  }

  @Get('accounts/balance')
  @UseGuards(JwtAuthGuard)
  @ApiResponseOk('User balance retrieved successfully')
  async getUserBalance(@CurrentUser() user: AuthUser) {
    return this.paymentsService.getUserBalance(user.userId);
  }

  @Patch('accounts/deposit')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new CustomZodValidationPipe(DepositWithdrawDto))
  @ApiResponseOk('Amount deposited successfully')
  async deposit(
    @CurrentUser() user: AuthUser,
    @Body() data: DepositWithdrawDtoType,
  ) {
    return this.paymentsService.deposit(user.userId, data);
  }

  @Patch('accounts/withdraw')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new CustomZodValidationPipe(DepositWithdrawDto))
  @ApiResponseOk('Amount withdrawn successfully')
  async withdraw(
    @CurrentUser() user: AuthUser,
    @Body() data: DepositWithdrawDtoType,
  ) {
    return this.paymentsService.withdraw(user.userId, data);
  }

  @Get('accounts/transactions')
  @UseGuards(JwtAuthGuard)
  @ApiResponseOk('User transactions retrieved successfully')
  async getTransactions(@CurrentUser() user: AuthUser) {
    return this.paymentsService.getTransactions(user.userId);
  }

  @Post('refund/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiResponseOk('Payment refunded successfully')
  async refundPayment(
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentsService.refundPayment(orderId, user.userId);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
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
@UseGuards(JwtAuthGuard)
export class PaymentsRestController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('accounts')
  @UsePipes(new CustomZodValidationPipe(CreateUserAccountDto))
  @ApiResponseOk('User account created successfully')
  async createUserAccount(@CurrentUser() user: AuthUser) {
    return this.paymentsService.createUserAccount({ userId: user.userId });
  }

  @Get('accounts/balance')
  @ApiResponseOk('User balance retrieved successfully')
  async getUserBalance(@CurrentUser() user: AuthUser) {
    return this.paymentsService.getUserBalance(user.userId);
  }

  @Patch('accounts/deposit')
  @UsePipes(new CustomZodValidationPipe(DepositWithdrawDto))
  @ApiResponseOk('Amount deposited successfully')
  async deposit(
    @CurrentUser() user: AuthUser,
    @Body() data: DepositWithdrawDtoType,
  ) {
    return this.paymentsService.deposit(user.userId, data);
  }

  @Patch('accounts/withdraw')
  @UsePipes(new CustomZodValidationPipe(DepositWithdrawDto))
  @ApiResponseOk('Amount withdrawn successfully')
  async withdraw(
    @CurrentUser() user: AuthUser,
    @Body() data: DepositWithdrawDtoType,
  ) {
    return this.paymentsService.withdraw(user.userId, data);
  }

  @Get('accounts/transactions')
  @ApiResponseOk('User transactions retrieved successfully')
  async getTransactions(@CurrentUser() user: AuthUser) {
    return this.paymentsService.getTransactions(user.userId);
  }

  @Post('refund/:orderId')
  @ApiResponseOk('Payment refunded successfully')
  async refundPayment(
    @Param('orderId') orderId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentsService.refundPayment(orderId, user.userId);
  }
}

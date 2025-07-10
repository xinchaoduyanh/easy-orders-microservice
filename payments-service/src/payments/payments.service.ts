// payments-app/src/payments/payments.service.ts
import {
  Injectable,
  Logger,
  Inject,
  OnModuleInit,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaymentRequestPayload,
  PaymentResultPayload,
} from './payments.interface';
import {
  UserAccountDto,
  TransactionDto,
  DepositWithdrawDtoType,
} from './payments.dto';
import { PAYMENT_CONSTANTS } from '../constants/payment.constants';
import envConfig from '../../config';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject('KAFKA_PAYMENT_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('PaymentsService Kafka producer connected.');
    this.logger.log(`Environment: ${envConfig.NODE_ENV}`);
    this.logger.log(`Kafka Broker: ${envConfig.KAFKA_BROKER}`);
  }

  async processPayment(payload: PaymentRequestPayload): Promise<void> {
    this.logger.log(
      `Received payment request for Order ID: ${payload.orderId}, Amount: ${payload.amount}, User: ${payload.userId}`,
    );

    try {
      // Không cần parse DTO ở đây nữa, assume payload đã validate
      // Find or create user account
      let userAccount = await this.prisma.userAccount.findUnique({
        where: { userId: payload.userId },
      });

      if (!userAccount) {
        userAccount = await this.prisma.userAccount.create({
          data: {
            userId: payload.userId,
            balance: PAYMENT_CONSTANTS.DEFAULT_BALANCE,
          },
        });
        this.logger.log(
          `Created new user account for userId: ${payload.userId}`,
        );
      }

      // Check if user has sufficient balance
      if (userAccount.balance < payload.amount) {
        const status = 'declined';
        const message = `Insufficient balance. Required: $${payload.amount}, Available: $${userAccount.balance}`;

        // Create failed transaction record
        await this.prisma.transaction.create({
          data: {
            userAccount: {
              connect: {
                id: userAccount.id,
              },
            },
            orderId: payload.orderId,
            amount: payload.amount,
            type: PAYMENT_CONSTANTS.TRANSACTION_TYPES.PAYMENT,
            status: PAYMENT_CONSTANTS.TRANSACTION_STATUSES.FAILED,
          },
        });

        this.logger.warn(
          `Payment declined for order ${payload.orderId}: ${message}`,
        );

        const paymentResult: PaymentResultPayload = {
          orderId: payload.orderId,
          status: status,
        };

        await this.sendPaymentResult(paymentResult);
        return;
      }

      // Process payment - deduct from balance
      const updatedAccount = await this.prisma.userAccount.update({
        where: { id: userAccount.id },
        data: {
          balance: {
            decrement: payload.amount,
          },
        },
      });

      // Create successful transaction record
      await this.prisma.transaction.create({
        data: {
          userAccount: {
            connect: {
              id: userAccount.id,
            },
          },
          orderId: payload.orderId,
          amount: payload.amount,
          type: PAYMENT_CONSTANTS.TRANSACTION_TYPES.PAYMENT,
          status: PAYMENT_CONSTANTS.TRANSACTION_STATUSES.COMPLETED,
        },
      });

      const status = 'confirmed';
      const message = `Payment processed successfully. New balance: $${updatedAccount.balance}`;

      this.logger.log(
        `Payment confirmed for order ${payload.orderId}. ${message}`,
      );

      const paymentResult: PaymentResultPayload = {
        orderId: payload.orderId,
        status: status,
      };

      await this.sendPaymentResult(paymentResult);
    } catch (error) {
      this.logger.error(
        `Error processing payment for order ${payload.orderId}:`,
        error,
      );
      throw error;
    }
  }

  private async sendPaymentResult(
    paymentResult: PaymentResultPayload,
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.kafkaClient.emit(
          PAYMENT_CONSTANTS.KAFKA_TOPICS.PAYMENT_RESULTS,
          paymentResult,
        ),
      );
      this.logger.log(
        `Payment result sent for order ${paymentResult.orderId}: ${paymentResult.status}`,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Failed to emit payment result for order ${paymentResult.orderId}: ${errorMessage}`,
      );
      throw err;
    }
  }

  // REST API Methods
  async createUserAccount(data: { userId: string }): Promise<UserAccountDto> {
    const existingAccount = await this.prisma.userAccount.findUnique({
      where: { userId: data.userId },
    });

    if (existingAccount) {
      throw new BadRequestException('User account already exists');
    }

    const userAccount = await this.prisma.userAccount.create({
      data: {
        userId: data.userId,
        balance: PAYMENT_CONSTANTS.DEFAULT_BALANCE,
      },
    });

    return userAccount;
  }

  async createInitialDepositTransaction(
    userId: string,
    amount: number,
  ): Promise<TransactionDto> {
    const transaction = await this.prisma.transaction.create({
      data: {
        userAccount: {
          connect: {
            userId,
          },
        },
        orderId: `INITIAL_DEPOSIT_${Date.now()}`,
        amount,
        type: PAYMENT_CONSTANTS.TRANSACTION_TYPES.DEPOSIT,
        status: PAYMENT_CONSTANTS.TRANSACTION_STATUSES.COMPLETED,
      },
    });

    this.logger.log(
      `Initial deposit transaction created for userId ${userId}: $${amount}`,
    );

    return transaction;
  }

  async getUserBalance(userId: string): Promise<{ balance: number }> {
    const userAccount = await this.prisma.userAccount.findUnique({
      where: { userId },
    });

    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }

    return { balance: userAccount.balance };
  }

  async deposit(
    userId: string,
    data: DepositWithdrawDtoType,
  ): Promise<UserAccountDto> {
    const userAccount = await this.prisma.userAccount.findUnique({
      where: { userId },
    });

    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }

    const updatedAccount = await this.prisma.userAccount.update({
      where: { userId },
      data: {
        balance: {
          increment: data.amount,
        },
      },
    });

    // Create transaction record
    await this.prisma.transaction.create({
      data: {
        userAccount: {
          connect: {
            userId,
          },
        },
        orderId: `DEPOSIT_${Date.now()}`,
        amount: data.amount,
        type: PAYMENT_CONSTANTS.TRANSACTION_TYPES.DEPOSIT,
        status: PAYMENT_CONSTANTS.TRANSACTION_STATUSES.COMPLETED,
      },
    });

    return updatedAccount;
  }

  async withdraw(
    userId: string,
    data: DepositWithdrawDtoType,
  ): Promise<UserAccountDto> {
    const userAccount = await this.prisma.userAccount.findUnique({
      where: { userId },
    });

    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }

    if (userAccount.balance < data.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const updatedAccount = await this.prisma.userAccount.update({
      where: { userId },
      data: {
        balance: {
          decrement: data.amount,
        },
      },
    });

    // Create transaction record
    await this.prisma.transaction.create({
      data: {
        userAccount: {
          connect: {
            userId,
          },
        },
        orderId: `WITHDRAWAL_${Date.now()}`,
        amount: data.amount,
        type: PAYMENT_CONSTANTS.TRANSACTION_TYPES.WITHDRAWAL,
        status: PAYMENT_CONSTANTS.TRANSACTION_STATUSES.COMPLETED,
      },
    });

    return updatedAccount;
  }

  async getTransactions(userId: string): Promise<TransactionDto[]> {
    const userAccount = await this.prisma.userAccount.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }

    return userAccount.transactions;
  }

  async refundPayment(
    orderId: string,
    userId: string,
  ): Promise<UserAccountDto> {
    const userAccount = await this.prisma.userAccount.findUnique({
      where: { userId },
    });

    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }

    const transaction = await this.prisma.transaction.findFirst({
      where: {
        orderId,
        userAccount: { userId },
        type: PAYMENT_CONSTANTS.TRANSACTION_TYPES.PAYMENT,
        status: PAYMENT_CONSTANTS.TRANSACTION_STATUSES.COMPLETED,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Payment transaction not found');
    }

    // Refund the amount
    const updatedAccount = await this.prisma.userAccount.update({
      where: { userId },
      data: {
        balance: {
          increment: transaction.amount,
        },
      },
    });

    // Create refund transaction record
    await this.prisma.transaction.create({
      data: {
        userAccount: {
          connect: {
            userId,
          },
        },
        orderId: `REFUND_${orderId}`,
        amount: transaction.amount,
        type: PAYMENT_CONSTANTS.TRANSACTION_TYPES.REFUND,
        status: PAYMENT_CONSTANTS.TRANSACTION_STATUSES.COMPLETED,
      },
    });

    return updatedAccount;
  }
}

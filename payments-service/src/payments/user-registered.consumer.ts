import { Controller, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { EventPattern, Payload, ClientKafka } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { UserRegisteredPayload } from './payments.interface';
import { PAYMENT_CONSTANTS } from '../constants/payment.constants';
import envConfig from '../../config';

@Controller()
export class UserRegisteredConsumer implements OnModuleInit {
  private readonly logger = new Logger(UserRegisteredConsumer.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject('KAFKA_PAYMENT_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(
      PAYMENT_CONSTANTS.KAFKA_TOPICS.USER_REGISTERED,
    );
    await this.kafkaClient.connect();
    this.logger.log(
      `UserRegisteredConsumer initialized and listening for ${PAYMENT_CONSTANTS.KAFKA_TOPICS.USER_REGISTERED} events`,
    );
    this.logger.log(`Environment: ${envConfig.NODE_ENV}`);
    this.logger.log(`Kafka Broker: ${envConfig.KAFKA_BROKER}`);
  }

  @EventPattern(PAYMENT_CONSTANTS.KAFKA_TOPICS.USER_REGISTERED)
  async handleUserRegistered(@Payload() data: UserRegisteredPayload) {
    const now = new Date().toISOString();
    this.logger.log(
      `[${now}] [EVENT] Received user registered event for user: ${data.userId}`,
    );
    this.logger.log(
      `[${now}] [EVENT] Raw user registered data: ${JSON.stringify(data)}`,
    );

    try {
      // Create user account with default balance
      const userAccount = await this.paymentsService.createUserAccount({
        userId: data.userId,
      });

      this.logger.log(
        `Successfully created payment account for user ${data.userId} with balance: $${PAYMENT_CONSTANTS.DEFAULT_BALANCE}`,
      );

      // Create initial deposit transaction record
      await this.paymentsService.createInitialDepositTransaction(
        userAccount.userId,
        PAYMENT_CONSTANTS.DEFAULT_BALANCE,
      );

      this.logger.log(
        `Initial deposit transaction created for user ${data.userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error creating payment account for user ${data.userId}: ${error.message}`,
        error.stack,
      );
      // TODO: Implement retry mechanism or dead letter queue for failed account creation
    }
  }
}

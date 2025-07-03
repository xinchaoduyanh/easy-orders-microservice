import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { ResendService } from '../resend/resend.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  private consumer: Consumer;

  constructor(private readonly resendService: ResendService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    this.consumer = kafka.consumer({ groupId: 'notifications-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'order-delivered',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          console.error('Message value is null');
          return;
        }
        const data = JSON.parse(message.value.toString());
        console.log(
          `[NOTI] Nhận message từ Kafka: orderId=${data.orderId}, userEmail=${data.userEmail}`,
        );
        await this.resendService.sendOrderDeliveredEmail(data);
      },
    });
    console.log('Kafka consumer started, listening to order-delivered');
  }
}

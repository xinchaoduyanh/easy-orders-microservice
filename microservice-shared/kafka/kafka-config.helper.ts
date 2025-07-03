// shared-kafka/kafka-config.helper.ts
import { Injectable } from '@nestjs/common';
import { Transport, ClientOptions } from '@nestjs/microservices';

@Injectable()
export class KafkaConfigHelper {
  createConfigKafka(serviceName: string): ClientOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: serviceName,
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: `${serviceName}_consumer`,
          allowAutoTopicCreation: true,
          heartbeatInterval: 2000,
        },
      },
    };
  }
}

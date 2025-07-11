import { ClientOptions, MicroserviceOptions } from '@nestjs/microservices';
export declare class KafkaConfigHelper {
    createConfigKafka(serviceName: string): ClientOptions;
}
export declare function createKafkaConnectConfig(serviceName: string, brokers: string[]): MicroserviceOptions;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConfigHelper = void 0;
exports.createKafkaConnectConfig = createKafkaConnectConfig;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let KafkaConfigHelper = class KafkaConfigHelper {
    createConfigKafka(serviceName) {
        return {
            transport: microservices_1.Transport.KAFKA,
            options: {
                client: {
                    clientId: `${serviceName}-client`,
                    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                },
                consumer: {
                    groupId: `${serviceName}-consumer-group`,
                    allowAutoTopicCreation: true,
                    heartbeatInterval: 2000,
                },
            },
        };
    }
};
exports.KafkaConfigHelper = KafkaConfigHelper;
exports.KafkaConfigHelper = KafkaConfigHelper = __decorate([
    (0, common_1.Injectable)()
], KafkaConfigHelper);
function createKafkaConnectConfig(serviceName, brokers) {
    return {
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                clientId: `${serviceName}-main-consumer-client`,
                brokers: brokers,
            },
            consumer: {
                groupId: `${serviceName}-results-consumer-group-v2`,
                allowAutoTopicCreation: true,
                heartbeatInterval: 2000,
            },
        },
    };
}
//# sourceMappingURL=kafka-config.helper.js.map
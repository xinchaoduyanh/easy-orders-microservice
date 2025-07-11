"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KafkaModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const kafka_config_helper_1 = require("./kafka-config.helper");
let KafkaModule = KafkaModule_1 = class KafkaModule {
    static register(serviceNames) {
        const kafkaProviders = serviceNames.map((name) => ({
            provide: `KAFKA_${name.toUpperCase()}_SERVICE`,
            useFactory: (helper) => {
                const config = helper.createConfigKafka(name.toLowerCase());
                return microservices_1.ClientProxyFactory.create(config);
            },
            inject: [kafka_config_helper_1.KafkaConfigHelper],
        }));
        return {
            module: KafkaModule_1,
            providers: [kafka_config_helper_1.KafkaConfigHelper, ...kafkaProviders],
            exports: kafkaProviders,
            global: true,
        };
    }
};
exports.KafkaModule = KafkaModule;
exports.KafkaModule = KafkaModule = KafkaModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], KafkaModule);
//# sourceMappingURL=kafka.module.js.map
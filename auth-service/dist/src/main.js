"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const config_2 = require("../config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.enableCors({
        origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                clientId: `${config_2.default.AUTH_SERVICE_NAME}-main-consumer-client`,
                brokers: [config_2.default.KAFKA_BROKER],
            },
            consumer: {
                groupId: `${config_2.default.AUTH_SERVICE_NAME}-results-consumer-group-v2`,
            },
        },
    });
    await app.startAllMicroservices();
    const port = configService.get('PORT', config_2.default.HTTP_PORT);
    await app.listen(port);
    console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api`);
    console.log(`Environment: ${config_2.default.NODE_ENV}`);
    console.log(`Kafka Broker: ${config_2.default.KAFKA_BROKER}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
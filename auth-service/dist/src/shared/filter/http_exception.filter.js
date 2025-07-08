"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const nestjs_zod_1 = require("nestjs-zod");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter extends core_1.BaseExceptionFilter {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (exception instanceof nestjs_zod_1.ZodSerializationException) {
            const zodError = exception.getZodError();
            this.logger.error(`[ZodSerializationException] ${zodError.message} | Path: ${request.method} ${request.url}`);
            response.status(500).json({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'Zod serialization error',
                details: zodError.errors,
            });
            return;
        }
        if (exception.getStatus && exception.getStatus() === 422) {
            const errorResponse = exception.getResponse();
            this.logger.error(`[ZodValidationError] ${JSON.stringify(errorResponse)} | Path: ${request.method} ${request.url}`);
            response.status(422).json({
                statusCode: 422,
                error: 'Unprocessable Entity',
                message: 'Validation failed',
                details: errorResponse['message'] || errorResponse,
            });
            return;
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const errorResponse = exception.getResponse();
            if (errorResponse['message'] &&
                typeof errorResponse['message'] === 'string' &&
                errorResponse['message'].toLowerCase().includes('jwt')) {
                this.logger.error(`[JWT Error] ${errorResponse['message']} | Path: ${request.method} ${request.url}`);
            }
            this.logger.error(`[HttpException] ${JSON.stringify(errorResponse)} | Path: ${request.method} ${request.url} | Stack: ${exception.stack}`);
            response.status(status).json({
                statusCode: status,
                error: exception.name,
                message: errorResponse['message'] || errorResponse,
            });
            return;
        }
        this.logger.error(`[UnknownError] ${exception?.message || exception} | Path: ${request.method} ${request.url}`);
        response.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: exception?.message || 'Unknown error',
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http_exception.filter.js.map
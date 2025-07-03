import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodSerializationException } from 'nestjs-zod';

@Catch()
export class HttpExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Lỗi Zod khi serialize response
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();
      this.logger.error(
        `[ZodSerializationException] ${zodError.message} | Path: ${request.method} ${request.url}`,
      );
      response.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Zod serialization error',
        details: zodError.errors,
      });
      return;
    }

    // Lỗi Zod khi validate input (UnprocessableEntityException)
    if (exception.getStatus && exception.getStatus() === 422) {
      const errorResponse = exception.getResponse();
      this.logger.error(
        `[ZodValidationError] ${JSON.stringify(errorResponse)} | Path: ${request.method} ${request.url}`,
      );
      response.status(422).json({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'Validation failed',
        details: errorResponse['message'] || errorResponse,
      });
      return;
    }

    // Lỗi HTTP thông thường
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      this.logger.error(
        `[HttpException] ${JSON.stringify(errorResponse)} | Path: ${request.method} ${request.url}`,
      );
      response.status(status).json({
        statusCode: status,
        error: exception.name,
        message: errorResponse['message'] || errorResponse,
      });
      return;
    }

    // Lỗi không xác định (500)
    this.logger.error(
      `[UnknownError] ${exception?.message || exception} | Path: ${request.method} ${request.url}`,
    );
    response.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: exception?.message || 'Unknown error',
    });
  }
}

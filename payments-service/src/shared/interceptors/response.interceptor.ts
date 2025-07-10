import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_RESPONSE_MESSAGE } from '../decorators/response.decorator';

export interface Response<T> {
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const message = this.reflector.get<string>(
          API_RESPONSE_MESSAGE,
          context.getHandler(),
        );

        return {
          data,
          message: message || 'Success',
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

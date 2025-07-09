import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
export interface ResponseData<T = any> {
    data?: T;
    message?: string;
    statusCode: number;
}
export declare class ResponseInterceptor<T> implements NestInterceptor<T, ResponseData<T>> {
    private reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseData<T>>;
}

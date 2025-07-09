import { HttpStatus } from '@nestjs/common';
export interface ResponseOptions {
    status?: HttpStatus;
    message?: string;
}
export declare const RESPONSE_METADATA_KEY = "response_metadata";
export declare const ApiResponse: (options?: ResponseOptions) => import("@nestjs/common").CustomDecorator<string>;
export declare const ApiResponseOk: (message?: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const ApiResponseCreated: (message?: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const ApiResponseAccepted: (message?: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const ApiResponseNoContent: () => import("@nestjs/common").CustomDecorator<string>;

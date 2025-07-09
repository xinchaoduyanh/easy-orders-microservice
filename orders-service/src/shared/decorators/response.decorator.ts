import { SetMetadata } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

export interface ResponseOptions {
  status?: HttpStatus;
  message?: string;
}

export const RESPONSE_METADATA_KEY = 'response_metadata';

export const ApiResponse = (options: ResponseOptions = {}) => {
  return SetMetadata(RESPONSE_METADATA_KEY, {
    status: options.status || HttpStatus.OK,
    message: options.message,
  });
};

export const ApiResponseOk = (message?: string) =>
  ApiResponse({ status: HttpStatus.OK, message });
export const ApiResponseCreated = (message?: string) =>
  ApiResponse({ status: HttpStatus.CREATED, message });
export const ApiResponseAccepted = (message?: string) =>
  ApiResponse({ status: HttpStatus.ACCEPTED, message });
export const ApiResponseNoContent = () =>
  ApiResponse({ status: HttpStatus.NO_CONTENT });

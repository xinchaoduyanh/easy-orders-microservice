import { SetMetadata } from '@nestjs/common';

export const API_RESPONSE_MESSAGE = 'api_response_message';

export const ApiResponseOk = (message: string) =>
  SetMetadata(API_RESPONSE_MESSAGE, message);

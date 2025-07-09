import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';
import { ApiResponseOk } from './shared/decorators/response.decorator';

@Controller()
@UseInterceptors(ResponseInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponseOk('Hello fetched successfully')
  getHello(): string {
    return this.appService.getHello();
  }
}

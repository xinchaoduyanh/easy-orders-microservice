import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductSchema,
  UpdateProductSchema,
} from './products.dto';
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe';
import { ResponseInterceptor } from 'src/shared/interceptor/response.interceptor';
import {
  ApiResponseOk,
  ApiResponseCreated,
} from 'src/shared/decorators/response.decorator';

@Controller('products')
@UseInterceptors(ResponseInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponseCreated('Product created successfully')
  async create(
    @Body(new CustomZodValidationPipe(CreateProductSchema))
    createProductDto: CreateProductDto,
  ) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @ApiResponseOk('All products fetched successfully')
  async getAll() {
    return await this.productsService.getAll();
  }

  @Get(':id')
  @ApiResponseOk('Product fetched successfully')
  async getById(@Param('id') id: string) {
    const product = await this.productsService.getById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Patch(':id')
  @ApiResponseOk('Product updated successfully')
  async update(
    @Param('id') id: string,
    @Body(new CustomZodValidationPipe(UpdateProductSchema))
    updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiResponseOk('Product deleted successfully')
  async delete(@Param('id') id: string) {
    return await this.productsService.delete(id);
  }
}

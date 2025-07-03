import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductSchema,
  UpdateProductSchema,
} from './products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() data: CreateProductDto) {
    const parsed = CreateProductSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors.map((e) => e.message).join(', '),
      );
    }
    return await this.productsService.create(parsed.data);
  }

  @Get()
  async getAll() {
    return await this.productsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const product = await this.productsService.getById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    const parsed = UpdateProductSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors.map((e) => e.message).join(', '),
      );
    }
    return await this.productsService.update(id, parsed.data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productsService.delete(id);
  }
}

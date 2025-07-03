import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductSchema,
  UpdateProductSchema,
} from './products.dto';
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body(new CustomZodValidationPipe(CreateProductSchema))
    createProductDto: CreateProductDto,
  ) {
    return await this.productsService.create(createProductDto);
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
  async update(
    @Param('id') id: string,
    @Body(new CustomZodValidationPipe(UpdateProductSchema))
    updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productsService.delete(id);
  }
}

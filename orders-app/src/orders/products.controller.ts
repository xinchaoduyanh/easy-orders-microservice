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
import { PrismaService } from '../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() data: { name: string; price: number }) {
    if (!data.name || typeof data.price !== 'number') {
      throw new BadRequestException('Name and price are required');
    }
    return this.prisma.product.create({
      data: { name: data.name, price: data.price },
    });
  }

  @Get()
  async getAll() {
    return this.prisma.product.findMany();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; price?: number },
  ) {
    try {
      return await this.prisma.product.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Product not found');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Product not found');
    }
  }
}

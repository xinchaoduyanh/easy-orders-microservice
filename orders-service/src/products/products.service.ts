import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }

  async getAll() {
    return this.prisma.product.findMany();
  }

  async getById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      return await this.prisma.product.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Product not found');
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Product not found');
    }
  }
}

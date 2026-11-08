import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private cloud: CloudinaryService) {}

  findAll() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const image = file ? await this.cloud.upload(file, 'coffee-shop/products') : undefined;
    return this.prisma.product.create({ data: { ...dto, image } });
  }

  async update(id: string, dto: UpdateProductDto, file?: Express.Multer.File) {
    await this.findOne(id);
    const image = file ? await this.cloud.upload(file, 'coffee-shop/products') : undefined;
    return this.prisma.product.update({ where: { id }, data: { ...dto, ...(image && { image }) } });
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.product.delete({ where: { id } });
      return { deleted: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003')
        throw new ConflictException('Product is referenced by existing orders');
      throw e;
    }
  }
}

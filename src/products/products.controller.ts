import {
  Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { imagePipe } from '../common/image.pipe';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get() findAll() { return this.products.findAll(); }

  @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.products.findOne(id); }

  @Post() @Roles(Role.MANAGER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() dto: CreateProductDto, @UploadedFile(imagePipe()) file?: Express.Multer.File) {
    return this.products.create(dto, file);
  }

  @Patch(':id') @Roles(Role.MANAGER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile(imagePipe()) file?: Express.Multer.File,
  ) {
    return this.products.update(id, dto, file);
  }

  @Delete(':id') @Roles(Role.MANAGER, Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.products.remove(id); }
}

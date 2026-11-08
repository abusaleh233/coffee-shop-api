import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { SAFE_USER } from './user.select';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private cloud: CloudinaryService) {}

  findAll() {
    return this.prisma.user.findMany({ select: SAFE_USER, orderBy: { createdAt: 'desc' } });
  }

  async me(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SAFE_USER });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateRole(id: string, role: Role, actorId: string) {
    if (id === actorId) throw new ForbiddenException('Cannot change your own role');
    await this.me(id);
    return this.prisma.user.update({ where: { id }, data: { role }, select: SAFE_USER });
  }

  async remove(id: string, actorId: string) {
    if (id === actorId) throw new ForbiddenException('Cannot delete yourself');
    await this.me(id);
    await this.prisma.user.delete({ where: { id } });
    return { deleted: true };
  }

  async updateImage(id: string, file: Express.Multer.File) {
    const image = await this.cloud.upload(file, 'coffee-shop/users');
    return this.prisma.user.update({ where: { id }, data: { image }, select: SAFE_USER });
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';

const include = {
  items: { include: { product: { select: { id: true, name: true, image: true } } } },
} satisfies Prisma.OrderInclude;

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const qty = new Map<string, number>();
    dto.items.forEach((i) => qty.set(i.productId, (qty.get(i.productId) ?? 0) + i.quantity));

    const products = await this.prisma.product.findMany({ where: { id: { in: [...qty.keys()] } } });
    if (products.length !== qty.size) throw new BadRequestException('One or more products not found');

    const total = products.reduce((s, p) => s.add(p.price.mul(qty.get(p.id)!)), new Prisma.Decimal(0));

    return this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: products.map((p) => ({ productId: p.id, quantity: qty.get(p.id)!, price: p.price })),
        },
      },
      include,
    });
  }

  findMine(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, include, orderBy: { createdAt: 'desc' } });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { ...include, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING)
      throw new BadRequestException('Only PENDING orders can be updated');
    return this.prisma.order.update({ where: { id }, data: { status }, include });
  }
}

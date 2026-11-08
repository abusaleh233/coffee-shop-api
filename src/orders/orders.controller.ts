import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  create(@CurrentUser() u: { id: string }, @Body() dto: CreateOrderDto) { return this.orders.create(u.id, dto); }

  @Get('my')
  mine(@CurrentUser() u: { id: string }) { return this.orders.findMine(u.id); }

  @Get() @Roles(Role.MANAGER, Role.ADMIN)
  findAll() { return this.orders.findAll(); }

  @Patch(':id/status') @Roles(Role.MANAGER, Role.ADMIN)
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, dto.status);
  }
}

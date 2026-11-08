import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class OrderItemDto {
  @IsUUID() productId: string;
  @IsInt() @Min(1) quantity: number;
}

export class CreateOrderDto {
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus) status: OrderStatus;
}

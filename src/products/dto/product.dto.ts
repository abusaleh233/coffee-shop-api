import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString() name: string;
  @IsString() title: string;
  @IsString() description: string;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() price: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

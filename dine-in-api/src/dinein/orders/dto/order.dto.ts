import {
  IsArray, IsInt, IsMongoId, IsNotEmpty, IsString, Min, ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { DineInOrderStatus } from '../schemas/dinein-order.schema';

export class OrderItemInputDto {
  @ApiProperty({ example: '64f3a...' })
  @IsMongoId()
  menuItemId: string;

  @ApiProperty({ example: 2 })
  @IsInt() @Min(1)
  quantity: number;
}

export class PlaceOrderDto {
  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: DineInOrderStatus })
  @IsEnum(DineInOrderStatus)
  status: DineInOrderStatus;
}

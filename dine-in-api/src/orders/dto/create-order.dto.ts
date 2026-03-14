import { IsArray, IsNotEmpty, IsObject, ValidateNested, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  menuItem: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

class DeliveryDetailsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: DeliveryDetailsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryDetailsDto)
  deliveryDetails: DeliveryDetailsDto;
}

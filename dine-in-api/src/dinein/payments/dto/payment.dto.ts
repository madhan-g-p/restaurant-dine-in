import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({ example: '64f3a...' })
  @IsMongoId()
  orderId: string;

  @ApiProperty({ example: 450.5 })
  @IsNumber()
  @Min(0)
  amount: number;
}

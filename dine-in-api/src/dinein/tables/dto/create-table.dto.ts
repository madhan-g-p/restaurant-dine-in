import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ example: 'T1', description: 'Unique table number/label' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  tableNumber: string;

  @ApiProperty({ example: 1, description: 'Floor number (1-based)' })
  @IsInt()
  @Min(1)
  floorNumber: number;

  @ApiProperty({ example: 4, description: 'Number of seats at the table' })
  @IsInt()
  @Min(1)
  seatCount: number;

  @ApiPropertyOptional({ example: 120, description: 'X position on floor layout (px)' })
  @IsOptional()
  @IsNumber()
  positionX?: number;

  @ApiPropertyOptional({ example: 200, description: 'Y position on floor layout (px)' })
  @IsOptional()
  @IsNumber()
  positionY?: number;
}

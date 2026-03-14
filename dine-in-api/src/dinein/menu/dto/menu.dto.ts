import {
  IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsNumber,
  Min, IsEnum, Matches, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FoodType } from '../schemas/dinein-menu-item.schema';

// ── Category DTOs ─────────────────────────────────────────────────
export class CreateCategoryDto {
  @ApiProperty({ example: 'Starters' })
  @IsString() @IsNotEmpty() @MaxLength(80)
  name: string;

  @ApiPropertyOptional({ example: 'Light bites to get started' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @IsInt() @Min(0)
  displayOrder?: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

// ── Item DTOs ─────────────────────────────────────────────────────
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Paneer Tikka' })
  @IsString() @IsNotEmpty() @MaxLength(120)
  name: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ example: 250 })
  @IsNumber() @Min(0)
  price: number;

  @ApiProperty({ example: '64f3a...' })
  @IsString() @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ enum: FoodType })
  @IsEnum(FoodType)
  foodType: FoodType;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional() @IsString()
  @Matches(TIME_REGEX, { message: 'servingStartTime must be HH:MM' })
  servingStartTime?: string;

  @ApiPropertyOptional({ example: '22:00' })
  @IsOptional() @IsString()
  @Matches(TIME_REGEX, { message: 'servingEndTime must be HH:MM' })
  servingEndTime?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  imageUrl?: string;
}

export class UpdateMenuItemDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) price?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
  @ApiPropertyOptional({ enum: FoodType }) @IsOptional() @IsEnum(FoodType) foodType?: FoodType;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isAvailable?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() servingStartTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() servingEndTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
}

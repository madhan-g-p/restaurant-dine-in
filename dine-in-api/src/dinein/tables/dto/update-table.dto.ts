import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTableDto } from './create-table.dto';
import { TableStatus } from '../schemas/dinein-table.schema';

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @ApiPropertyOptional({ enum: TableStatus })
  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}

import {
  IsString, IsNotEmpty, MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitSessionDto {
  @ApiProperty({ example: 'T1', description: 'Table number from QR code' })
  @IsString() @IsNotEmpty()
  tableNumber: string;

  @ApiProperty({ description: 'SHA-256 browser fingerprint hash' })
  @IsString() @IsNotEmpty() @MaxLength(64)
  fingerprint: string;
}

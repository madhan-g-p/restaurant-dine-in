import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true, collection: 'dinein_tables' })
export class DineInTable extends Document {
  @Prop({ required: true, unique: true, trim: true })
  tableNumber: string;

  @Prop({ required: true, min: 1 })
  floorNumber: number;

  @Prop({ required: true, min: 1 })
  seatCount: number;

  @Prop({ default: 0 })
  positionX: number;

  @Prop({ default: 0 })
  positionY: number;

  @Prop({
    type: String,
    enum: Object.values(TableStatus),
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  // ── Pre-booking fields (future reservation feature) ──
  @Prop({ type: Date })
  reservedFrom?: Date;

  @Prop({ type: Date })
  reservedTo?: Date;

  @Prop({ type: String })
  reservedByName?: string;
}

export const DineInTableSchema = SchemaFactory.createForClass(DineInTable);

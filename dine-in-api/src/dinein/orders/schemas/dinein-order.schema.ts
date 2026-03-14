import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum DineInOrderStatus {
  ACTIVE = 'ACTIVE',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true, collection: 'dinein_orders' })
export class DineInOrder extends Document {
  @Prop({ type: Types.ObjectId, ref: 'DineInTable', required: true })
  tableId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DineInSession', required: true })
  sessionId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(DineInOrderStatus),
    default: DineInOrderStatus.ACTIVE,
  })
  status: DineInOrderStatus;

  @Prop({ type: Date })
  closedAt?: Date;
}

export const DineInOrderSchema = SchemaFactory.createForClass(DineInOrder);

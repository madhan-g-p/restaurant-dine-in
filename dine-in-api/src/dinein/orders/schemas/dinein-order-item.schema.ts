import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderItemStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
}

@Schema({ collection: 'dinein_order_items' })
export class DineInOrderItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'DineInOrder', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DineInMenuItem', required: true })
  menuItemId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  /** Price captured at time of order — immutable snapshot */
  @Prop({ required: true, min: 0 })
  priceSnapshot: number;

  @Prop({
    type: String,
    enum: Object.values(OrderItemStatus),
    default: OrderItemStatus.PENDING,
  })
  status: OrderItemStatus;
}

export const DineInOrderItemSchema = SchemaFactory.createForClass(DineInOrderItem);

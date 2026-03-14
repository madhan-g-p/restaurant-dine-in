import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { MenuItem } from '../../menu/schemas/menu-item.schema';

export enum OrderStatus {
  RECEIVED = 'Order Received',
  PREPARING = 'Preparing',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop([
    {
      menuItem: { type: MongooseSchema.Types.ObjectId, ref: 'MenuItem' },
      name: String,
      price: Number,
      quantity: Number,
    },
  ])
  items: any[];

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    type: {
      name: String,
      address: String,
      phone: String,
    },
  })
  deliveryDetails: any;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.RECEIVED,
  })
  status: OrderStatus;

  @Prop()
  estimatedDelivery: Date;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PaymentMethod {
  UPI_QR = 'UPI_QR',
  CASH = 'CASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true, collection: 'dinein_payments' })
export class PaymentRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'DineInOrder', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ type: String, enum: Object.values(PaymentMethod), default: PaymentMethod.UPI_QR })
  method: PaymentMethod;

  @Prop({ type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ default: false })
  verifiedByAdmin: boolean;

  /** PhonePe transactionId — populated only for PhonePe Collect flow */
  @Prop({ type: String })
  transactionId?: string;

  @Prop({ type: String })
  phonePeOrderId?: string;
}

export const PaymentRecordSchema = SchemaFactory.createForClass(PaymentRecord);

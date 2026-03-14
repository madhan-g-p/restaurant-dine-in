import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'dinein_sessions' })
export class DineInSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'DineInTable', required: true })
  tableId: Types.ObjectId;

  /** SHA-256 hash of userAgent|resolution|timezone|language */
  @Prop({ required: true })
  browserFingerprint: string;

  @Prop({ required: true, default: () => new Date() })
  lastActiveAt: Date;

  @Prop({ default: false })
  expired: boolean;
}

export const DineInSessionSchema = SchemaFactory.createForClass(DineInSession);

// MongoDB TTL index: auto-expire sessions 6 hours after lastActiveAt
DineInSessionSchema.index({ lastActiveAt: 1 }, { expireAfterSeconds: 21600 });

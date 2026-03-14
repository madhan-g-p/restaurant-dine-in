import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum FoodType {
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
  VEGAN = 'VEGAN',
}

@Schema({ timestamps: true, collection: 'dinein_menu_items' })
export class DineInMenuItem extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'DineInMenuCategory', required: true })
  categoryId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(FoodType),
    required: true,
  })
  foodType: FoodType;

  @Prop({ default: true })
  isAvailable: boolean;

  /** Format: "HH:MM" e.g. "07:00" — null means no time restriction */
  @Prop({ type: String })
  servingStartTime?: string;

  @Prop({ type: String })
  servingEndTime?: string;

  @Prop({ type: String })
  imageUrl?: string;
}

export const DineInMenuItemSchema = SchemaFactory.createForClass(DineInMenuItem);

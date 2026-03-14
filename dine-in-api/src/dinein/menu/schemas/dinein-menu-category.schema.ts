import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'dinein_menu_categories' })
export class DineInMenuCategory extends Document {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const DineInMenuCategorySchema =
  SchemaFactory.createForClass(DineInMenuCategory);

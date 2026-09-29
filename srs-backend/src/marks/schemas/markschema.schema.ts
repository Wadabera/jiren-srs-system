import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarkSchemaDocument = MarkSchema & Document;

@Schema({ timestamps: true })
export class MarkSchema {
  @Prop({ required: true, unique: true })
  teacherId: string;

  @Prop([
    {
      label: { type: String, required: true }, // e.g. column_1, column_2 or custom names
      max: { type: Number, required: true },
    },
  ])
  columns: { label: string; max: number }[];
}

export const MarkSchemaModel = SchemaFactory.createForClass(MarkSchema);

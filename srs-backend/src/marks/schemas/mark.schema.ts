import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MarkDocument = Mark & Document;

@Schema({ timestamps: true })
export class Mark {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true })
  subjectCode: string;

  @Prop({ type: [Number], required: true })
  scores: number[];

  @Prop({ required: true })
  total: number;
}

export const MarkModel = SchemaFactory.createForClass(Mark);

// Compound index to ensure one record per student per teacher/subject
MarkModel.index({ studentId: 1, teacherId: 1, subjectCode: 1 }, { unique: true });

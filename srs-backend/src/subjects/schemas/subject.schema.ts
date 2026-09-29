import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true, unique: true })
  subjectCode: string; // Auto-generated based on grade (e.g. 9000, 1000)

  @Prop({ required: true })
  subjectName: string;

  @Prop({ required: true })
  grade: number;

  @Prop()
  stream: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

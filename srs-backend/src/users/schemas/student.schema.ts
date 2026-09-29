import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, unique: true })
  studentId: string; // E.g., '1000'

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  stream: string;

  @Prop({ required: true })
  grade: string;

  @Prop({ required: true })
  class: string;

  @Prop()
  photo: string; // base64 string

  @Prop()
  banner: string; // base64 string or URL
}

export const StudentSchema = SchemaFactory.createForClass(Student);

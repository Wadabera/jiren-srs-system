import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: true, unique: true })
  teacherId: string; // E.g., '100'

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
  subjectCode: string;

  @Prop({ required: true })
  grade: string;

  @Prop({ required: true, type: [String] })
  classes: string[]; // E.g., ['A', 'B', 'C']

  @Prop()
  photo: string; // base64 string

  @Prop()
  background: string;

  @Prop()
  banner: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

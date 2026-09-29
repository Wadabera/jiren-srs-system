import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FileDoc extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  subjectCode: string;

  @Prop({ required: true })
  grade: number;

  @Prop({ required: true })
  teacherId: string;
}

export const FileSchema = SchemaFactory.createForClass(FileDoc);

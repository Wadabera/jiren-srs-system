import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Timetable extends Document {
  @Prop({ required: true })
  grade: number;

  @Prop({ required: true })
  class: string;

  @Prop({ required: true })
  dayOfWeek: string; // e.g., 'Monday'

  @Prop({ required: true })
  startTime: string; // e.g., '08:00'

  @Prop({ required: true })
  endTime: string; // e.g., '08:45'

  @Prop({ required: true })
  subjectCode: string;

  @Prop({ required: true })
  teacherId: string;
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);

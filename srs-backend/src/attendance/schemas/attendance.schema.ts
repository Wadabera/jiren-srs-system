import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true })
  subjectCode: string;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD format

  @Prop({ required: true, enum: ['Present', 'Absent', 'Late'] })
  status: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Compound index to ensure one record per student per subject per date
AttendanceSchema.index({ studentId: 1, subjectCode: 1, date: 1 }, { unique: true });

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(@InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>) {}

  async saveBatch(records: any[]) {
    // Upsert each record
    const promises = records.map(record => {
      const { studentId, teacherId, subjectCode, date, status } = record;
      return this.attendanceModel.findOneAndUpdate(
        { studentId, subjectCode, date },
        { status, teacherId },
        { new: true, upsert: true }
      ).exec();
    });
    await Promise.all(promises);
    return { success: true };
  }

  async getByClassAndDate(teacherId: string, date: string) {
    return this.attendanceModel.find({ teacherId, date }).exec();
  }

  async getStudentAttendance(studentId: string) {
    return this.attendanceModel.find({ studentId }).sort({ date: -1 }).exec();
  }
}

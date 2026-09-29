import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('batch')
  saveBatch(@Body() records: any[]) {
    return this.attendanceService.saveBatch(records);
  }

  @Get('teacher/:teacherId')
  getByClassAndDate(@Param('teacherId') teacherId: string, @Query('date') date: string) {
    return this.attendanceService.getByClassAndDate(teacherId, date);
  }

  @Get('student/:studentId')
  getStudentAttendance(@Param('studentId') studentId: string) {
    return this.attendanceService.getStudentAttendance(studentId);
  }
}

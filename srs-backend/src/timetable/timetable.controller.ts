import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('timetable')
@UseGuards(JwtAuthGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  create(@Body() createDto: CreateTimetableDto) {
    return this.timetableService.create(createDto);
  }

  @Get()
  findAll() {
    return this.timetableService.findAll();
  }

  @Get('class')
  findByClass(@Query('grade') grade: string, @Query('class') className: string) {
    return this.timetableService.findByClass(Number(grade), className);
  }

  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.timetableService.findByTeacher(teacherId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.timetableService.delete(id);
  }
}

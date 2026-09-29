import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateMarkSchemaDto } from './dto/create-markschema.dto';
import { UpsertMarkDto } from './dto/upsert-mark.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('marks')
@UseGuards(JwtAuthGuard)
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Post('schema')
  createSchema(@Body() createSchemaDto: CreateMarkSchemaDto) {
    return this.marksService.createSchema(createSchemaDto);
  }

  @Get('schema/:teacherId')
  getSchema(@Param('teacherId') teacherId: string) {
    return this.marksService.getSchema(teacherId);
  }

  @Post()
  upsertMark(@Body() upsertMarkDto: UpsertMarkDto) {
    return this.marksService.upsertMark(upsertMarkDto);
  }

  @Get('teacher/:teacherId')
  getMarksByTeacher(@Param('teacherId') teacherId: string) {
    return this.marksService.getMarksByTeacher(teacherId);
  }

  @Get('student/:studentId')
  getMarksByStudent(@Param('studentId') studentId: string) {
    return this.marksService.getMarksByStudent(studentId);
  }
}

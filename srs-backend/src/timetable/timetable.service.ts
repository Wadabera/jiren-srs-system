import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timetable } from './schemas/timetable.schema';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name) private timetableModel: Model<Timetable>,
  ) {}

  async create(createDto: any): Promise<Timetable> {
    const created = new this.timetableModel(createDto);
    return created.save();
  }

  async findAll(): Promise<Timetable[]> {
    return this.timetableModel.find().exec();
  }

  async findByClass(grade: number, className: string): Promise<Timetable[]> {
    return this.timetableModel.find({ grade, class: className }).sort({ startTime: 1 }).exec();
  }

  async findByTeacher(teacherId: string): Promise<Timetable[]> {
    return this.timetableModel.find({ teacherId }).sort({ dayOfWeek: 1, startTime: 1 }).exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.timetableModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Timetable entry ${id} not found`);
    }
  }
}

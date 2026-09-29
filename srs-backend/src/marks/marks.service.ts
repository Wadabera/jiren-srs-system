import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mark, MarkDocument } from './schemas/mark.schema';
import { MarkSchema, MarkSchemaDocument } from './schemas/markschema.schema';
import { CreateMarkSchemaDto } from './dto/create-markschema.dto';
import { UpsertMarkDto } from './dto/upsert-mark.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectModel(Mark.name) private markModel: Model<MarkDocument>,
    @InjectModel(MarkSchema.name) private markSchemaModel: Model<MarkSchemaDocument>,
  ) {}

  async createSchema(createSchemaDto: CreateMarkSchemaDto) {
    const { teacherId, columns } = createSchemaDto;

    // Overwrite existing schema and all marks for this teacher (replicating PHP DROP TABLE behavior)
    await this.markSchemaModel.findOneAndDelete({ teacherId }).exec();
    await this.markModel.deleteMany({ teacherId }).exec();

    const newSchema = new this.markSchemaModel({
      teacherId,
      columns,
    });
    return newSchema.save();
  }

  async getSchema(teacherId: string) {
    const schema = await this.markSchemaModel.findOne({ teacherId }).exec();
    if (!schema) {
      throw new NotFoundException('Mark schema not found for this teacher');
    }
    return schema;
  }

  async upsertMark(upsertMarkDto: UpsertMarkDto) {
    const { studentId, teacherId, subjectCode, scores } = upsertMarkDto;
    const total = scores.reduce((sum, score) => sum + score, 0);

    return this.markModel.findOneAndUpdate(
      { studentId, teacherId, subjectCode },
      { scores, total },
      { new: true, upsert: true }, // Insert if not exists, update if exists
    ).exec();
  }

  async getMarksByTeacher(teacherId: string) {
    return this.markModel.find({ teacherId }).exec();
  }

  async getMarksByStudent(studentId: string) {
    // We also need to bring the schema along so the frontend knows what the columns mean
    const marks = await this.markModel.find({ studentId }).exec();
    const result: any[] = [];
    
    for (const mark of marks) {
      const schema = await this.markSchemaModel.findOne({ teacherId: mark.teacherId }).exec();
      result.push({
        mark,
        schema: schema ? schema.columns : [],
      });
    }
    
    return result;
  }
}

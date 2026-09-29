import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(@InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const { subjectName, grade, stream } = createSubjectDto;

    // Replication of the original PHP logic: Check for duplicates
    const existing = await this.subjectModel.findOne({ subjectName, grade, stream }).exec();
    if (existing) {
      throw new BadRequestException('THIS SUBJECT HAS ALREADY BEEN ADDED!');
    }

    // Generate subject_code logic from PHP
    // $sql="SELECT MAX(subject_code) FROM subject WHERE subject_code LIKE '$grade%'";
    const regex = new RegExp(`^${grade}`);
    const subjectsInGrade = await this.subjectModel.find({ subjectCode: regex }).exec();
    
    let nextCode = '';
    if (subjectsInGrade.length === 0) {
      if (grade === 9) {
        nextCode = `${grade}000`;
      } else {
        nextCode = `${grade}00`;
      }
    } else {
      const maxCode = Math.max(...subjectsInGrade.map(s => parseInt(s.subjectCode, 10)));
      if (maxCode < 10000) {
        nextCode = (maxCode + 1).toString();
      } else {
        throw new BadRequestException('The database is full! (cannot add more subjects)');
      }
    }

    const createdSubject = new this.subjectModel({
      subjectCode: nextCode,
      subjectName,
      grade,
      stream: (grade === 11 || grade === 12) ? stream : '',
    });

    return createdSubject.save();
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().exec();
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { Student, StudentDocument } from './schemas/student.schema';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { Director, DirectorDocument } from './schemas/director.schema';
import { CreateStudentDto, CreateTeacherDto, CreateDirectorDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(Director.name) private directorModel: Model<DirectorDocument>,
  ) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async getProfile(username: string, role: string) {
    if (role === 'student') {
      return this.studentModel.findOne({ username }).exec();
    } else if (role === 'teacher') {
      return this.teacherModel.findOne({ username }).exec();
    } else if (role === 'director') {
      return this.directorModel.findOne({ username }).exec();
    }
    throw new BadRequestException('Invalid role');
  }

  private async generateNextId(model: Model<any>, idField: string, startFrom: number): Promise<string> {
    const docs = await model.find().select(idField).exec();
    if (!docs || docs.length === 0) {
      return startFrom.toString();
    }
    const maxId = Math.max(...docs.map(d => parseInt(d[idField], 10)));
    return (maxId + 1).toString();
  }

  async createStudent(createStudentDto: CreateStudentDto) {
    const existing = await this.userModel.findOne({ username: createStudentDto.username });
    if (existing) {
      throw new BadRequestException('Username is already taken!');
    }

    const hashedPassword = await bcrypt.hash(createStudentDto.password || '12345678', 10);
    const nextId = await this.generateNextId(this.studentModel, 'studentId', 1000);

    const user = new this.userModel({
      fullname: createStudentDto.fullname,
      username: createStudentDto.username,
      password: hashedPassword,
      email: createStudentDto.email,
      role: 'student',
    });
    await user.save();

    const student = new this.studentModel({
      studentId: nextId,
      fullname: createStudentDto.fullname,
      username: createStudentDto.username,
      email: createStudentDto.email,
      phone: createStudentDto.phone,
      stream: createStudentDto.stream,
      grade: createStudentDto.grade,
      class: createStudentDto.class,
      photo: createStudentDto.photo,
    });
    return student.save();
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const existing = await this.userModel.findOne({ username: createTeacherDto.username });
    if (existing) {
      throw new BadRequestException('Username is already taken!');
    }

    const hashedPassword = await bcrypt.hash(createTeacherDto.password || '12345678', 10);
    const nextId = await this.generateNextId(this.teacherModel, 'teacherId', 100);

    const classesArray = (createTeacherDto.classes || '').replace(/\s/g, '').split(',').filter(Boolean);

    const user = new this.userModel({
      fullname: createTeacherDto.fullname,
      username: createTeacherDto.username,
      password: hashedPassword,
      email: createTeacherDto.email,
      role: 'teacher',
    });
    await user.save();

    const teacher = new this.teacherModel({
      teacherId: nextId,
      fullname: createTeacherDto.fullname,
      username: createTeacherDto.username,
      email: createTeacherDto.email,
      phone: createTeacherDto.phone,
      stream: createTeacherDto.stream,
      subjectCode: createTeacherDto.subjectCode,
      grade: createTeacherDto.grade,
      classes: classesArray,
      background: createTeacherDto.background,
      photo: createTeacherDto.photo,
    });
    return teacher.save();
  }

  async createDirector(createDirectorDto: CreateDirectorDto) {
    const existing = await this.userModel.findOne({ username: createDirectorDto.username });
    if (existing) {
      throw new BadRequestException('Username is already taken!');
    }

    const hashedPassword = await bcrypt.hash(createDirectorDto.password || '12345678', 10);

    const user = new this.userModel({
      fullname: createDirectorDto.fullname,
      username: createDirectorDto.username,
      password: hashedPassword,
      email: createDirectorDto.email,
      role: 'director',
    });
    await user.save();

    const director = new this.directorModel({
      fullname: createDirectorDto.fullname,
      username: createDirectorDto.username,
      email: createDirectorDto.email,
      photo: createDirectorDto.photo,
    });
    return director.save();
  }

  async findAllStudents() {
    return this.studentModel.find().exec();
  }

  async findAllTeachers() {
    return this.teacherModel.find().exec();
  }

  async findAllDirectors() {
    return this.directorModel.find().exec();
  }

  async getDashboardStats() {
    const totalStudents = await this.studentModel.countDocuments();
    const totalTeachers = await this.teacherModel.countDocuments();
    return {
      totalStudents,
      totalTeachers,
      totalUsers: totalStudents + totalTeachers,
    };
  }

  async findStudentById(id: string) {
    const s = await this.studentModel.findOne({ studentId: id }).exec();
    if (!s) throw new NotFoundException('Student not found');
    return s;
  }

  async findTeacherById(id: string) {
    const t = await this.teacherModel.findOne({ teacherId: id }).exec();
    if (!t) throw new NotFoundException('Teacher not found');
    return t;
  }

  async deleteUser(type: string, id: string) {
    let username = '';
    if (type === 'student') {
      const s = await this.studentModel.findOneAndDelete({ studentId: id }).exec();
      if(s) username = s.username;
    } else if (type === 'teacher') {
      const t = await this.teacherModel.findOneAndDelete({ teacherId: id }).exec();
      if(t) username = t.username;
    } else if (type === 'director') {
      const d = await this.directorModel.findByIdAndDelete(id).exec();
      if(d) username = d.username;
    }
    
    if (username) {
      await this.userModel.findOneAndDelete({ username }).exec();
    }
    return { success: true };
  }

  async updateProfile(username: string, role: string, updateData: any) {
    const userUpdate: any = {};
    if (updateData.fullname) userUpdate.fullname = updateData.fullname;
    if (updateData.email) userUpdate.email = updateData.email;
    if (updateData.photo) userUpdate.photo = updateData.photo;
    if (updateData.banner) userUpdate.banner = updateData.banner;
    if (updateData.password) {
      userUpdate.password = await bcrypt.hash(updateData.password, 10);
    }
    await this.userModel.findOneAndUpdate({ username }, userUpdate).exec();

    const specificUpdate: any = { ...updateData };
    delete specificUpdate.password;

    if (role === 'student') {
      return this.studentModel.findOneAndUpdate({ username }, specificUpdate, { new: true }).exec();
    } else if (role === 'teacher') {
      return this.teacherModel.findOneAndUpdate({ username }, specificUpdate, { new: true }).exec();
    } else if (role === 'director') {
      return this.directorModel.findOneAndUpdate({ username }, specificUpdate, { new: true }).exec();
    }
    throw new BadRequestException('Invalid role');
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedToken }).exec();
  }

  async removeRefreshToken(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }).exec();
  }
}
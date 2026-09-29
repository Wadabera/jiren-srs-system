import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request, Patch, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateStudentDto, CreateTeacherDto, CreateDirectorDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../files/cloudinary.service';
import * as multer from 'multer';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('students')
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.usersService.createStudent(createStudentDto);
  }

  @Post('teachers')
  createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.usersService.createTeacher(createTeacherDto);
  }

  @Post('directors')
  createDirector(@Body() createDirectorDto: CreateDirectorDto) {
    return this.usersService.createDirector(createDirectorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.username, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('students')
  findAllStudents() {
    return this.usersService.findAllStudents();
  }

  @UseGuards(JwtAuthGuard)
  @Get('teachers')
  findAllTeachers() {
    return this.usersService.findAllTeachers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('directors')
  findAllDirectors() {
    return this.usersService.findAllDirectors();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.usersService.getDashboardStats();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.usersService.updateProfile(req.user.username, req.user.role, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/images')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ], { storage: multer.memoryStorage() }))
  async updateImages(
    @Request() req,
    @UploadedFiles() files: { photo?: Express.Multer.File[], banner?: Express.Multer.File[] }
  ) {
    console.log('UsersController: Received files keys:', Object.keys(files || {}));
    const updateData: any = {};
    
    if (files.photo && files.photo[0]) {
      const result = await this.cloudinaryService.uploadFile(files.photo[0]);
      updateData.photo = result.secure_url;
    }
    
    if (files.banner && files.banner[0]) {
      const result = await this.cloudinaryService.uploadFile(files.banner[0]);
      updateData.banner = result.secure_url;
    }
    
    return this.usersService.updateProfile(req.user.username, req.user.role, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':type/:id')
  deleteUser(@Param('type') type: string, @Param('id') id: string) {
    return this.usersService.deleteUser(type, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':type/:id')
  async adminUpdateUser(
    @Param('type') type: string, 
    @Param('id') id: string, 
    @Body() updateData: any
  ) {
    // 1. Find the target user's username first
    let targetUsername = '';
    if (type === 'student') {
      const s = await this.usersService.findStudentById(id);
      targetUsername = s.username;
    } else if (type === 'teacher') {
      const t = await this.usersService.findTeacherById(id);
      targetUsername = t.username;
    }
    
    return this.usersService.updateProfile(targetUsername, type, updateData);
  }
}

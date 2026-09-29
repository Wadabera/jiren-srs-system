import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body, Res, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileDoc } from './schemas/file.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';
import type { Response } from 'express';
import * as fs from 'fs';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    @InjectModel(FileDoc.name) private fileModel: Model<FileDoc>,
    private readonly cloudinaryService: CloudinaryService
  ) {
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; subjectCode: string; grade: number; teacherId: string }
  ) {
    const newFile = new this.fileModel({
      title: body.title,
      filename: file.filename,
      mimetype: file.mimetype,
      path: file.path,
      subjectCode: body.subjectCode,
      grade: body.grade,
      teacherId: body.teacherId
    });
    return newFile.save();
  }

  @Get()
  async getFiles(@Query('grade') grade?: string, @Query('subjectCode') subjectCode?: string) {
    const query: any = {};
    if (grade) query.grade = Number(grade);
    if (subjectCode) query.subjectCode = subjectCode;
    return this.fileModel.find(query).sort({ createdAt: -1 }).exec();
  }

  @Get('download/:filename')
  download(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: './uploads' });
  }

  @Post('cloudinary-upload')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async uploadToCloudinary(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);
    return { url: result.secure_url };
  }
}

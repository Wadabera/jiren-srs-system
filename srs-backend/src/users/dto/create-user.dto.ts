import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^.{8,}$/)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(['student', 'teacher', 'director'])
  @IsNotEmpty()
  role: string;
}

export class CreateStudentDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  stream?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  class?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}

export class CreateTeacherDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  stream?: string;

  @IsOptional()
  @IsString()
  subjectCode?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  classes?: string;

  @IsOptional()
  @IsString()
  background?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}

export class CreateDirectorDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  photo?: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^.{8,}$/)
  newPassword: string;
}
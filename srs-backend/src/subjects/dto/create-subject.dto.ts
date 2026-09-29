import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  subjectName: string;

  @IsNumber()
  @IsNotEmpty()
  grade: number;

  @IsString()
  @IsOptional()
  stream?: string;
}

import { IsNotEmpty, IsString, IsArray, IsNumber } from 'class-validator';

export class UpsertMarkDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsString()
  @IsNotEmpty()
  subjectCode: string;

  @IsArray()
  @IsNumber({}, { each: true })
  scores: number[];
}

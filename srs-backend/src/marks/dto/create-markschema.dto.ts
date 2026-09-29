import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class MarkColumnDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @IsNotEmpty()
  max: number;
}

export class CreateMarkSchemaDto {
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkColumnDto)
  columns: MarkColumnDto[];
}

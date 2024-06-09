import { Transform } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinDate,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  limitDate?: Date;

  @IsOptional()
  @IsString()
  @IsMongoId()
  author?: string | Types.ObjectId;
}

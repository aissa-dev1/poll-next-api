import {
  IsNotEmpty,
  Length,
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePollDto {
  @IsNotEmpty({ message: 'User id is required' })
  @IsString({ message: 'User id must be a string' })
  userId: string;

  @IsNotEmpty({ message: 'Poll question is required' })
  @IsString({ message: 'Poll question must be a string' })
  @Length(1, 50, { message: 'Poll question must be 1-50 characters long' })
  question: string;

  @IsNotEmpty({ message: 'Poll options is required' })
  @IsArray({ message: 'Poll options must be an array' })
  @ArrayMinSize(1, { message: 'Poll options must contain at least one option' })
  @ArrayMaxSize(10, {
    message: 'Poll options can contain no more than ten options',
  })
  options: string[];

  @IsNotEmpty({ message: 'Poll category is required' })
  @IsString({ message: 'Poll category must be a string' })
  @Length(1, 50, { message: 'Poll category must be 1-50 characters long' })
  category: string;
}

import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export function IsValidInput(input = 'Input') {
  return applyDecorators(
    IsNotEmpty({ message: `${input} is required` }),
    IsString({ message: `${input} must be a string` }),
    Length(2, 50, { message: `${input} must be 2-50 characters long` }),
  );
}

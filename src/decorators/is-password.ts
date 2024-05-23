import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, Length } from 'class-validator';

export function IsPassword(field = 'Password') {
  return applyDecorators(
    IsNotEmpty({ message: `${field} is required` }),
    Length(4, 20, { message: `${field} must be 4-20 characters long` }),
  );
}

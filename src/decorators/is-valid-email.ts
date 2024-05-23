import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';

export function IsValidEmail() {
  return applyDecorators(
    IsNotEmpty({ message: 'Email is required' }),
    IsEmail({}, { message: 'Invalid email format' }),
  );
}

import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(4, 20, { message: 'Password must be 4-20 characters long' })
  password: string;
}

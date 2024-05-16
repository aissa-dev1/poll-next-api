import { IsNotEmpty, IsEmail, Length, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(4, 20, { message: 'Password must be 4-20 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @Length(2, 50, { message: 'Full name must be 2-50 characters long' })
  fullName: string;
}

export class ChangeUserNameDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @Length(2, 50, { message: 'Full name must be 2-50 characters long' })
  fullName: string;
}

export class DeleteUserDto {
  @IsNotEmpty({ message: 'Password is required' })
  @Length(4, 20, { message: 'Password must be 4-20 characters long' })
  password: string;
}

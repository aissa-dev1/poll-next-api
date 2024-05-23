import { IsString } from 'class-validator';
import { IsPassword } from 'src/decorators/is-password';
import { IsValidEmail } from 'src/decorators/is-valid-email';
import { IsValidInput } from 'src/decorators/is-valid-input';

export class CreateUserDto {
  @IsValidEmail()
  email: string;

  @IsPassword()
  password: string;

  @IsValidInput('Full name')
  fullName: string;
}

export class ChangeUserNameDto {
  @IsValidInput('Full name')
  fullName: string;
}

export class ChangeUserAvatarDto {
  @IsValidInput('Avatar')
  avatar: string;
}

export class ChangeUserBioDto {
  @IsString({ message: 'Bio must be a string' })
  bio: string;
}

export class ChangeUserPasswordDto {
  @IsPassword('Current Password')
  currentPassword: string;

  @IsPassword('New Password')
  newPassword: string;

  @IsPassword('r-new Password')
  rnewPassword: string;
}

export class DeleteUserDto {
  @IsPassword()
  password: string;
}

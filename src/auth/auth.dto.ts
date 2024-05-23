import { IsPassword } from 'src/decorators/is-password';
import { IsValidEmail } from 'src/decorators/is-valid-email';

export class LoginDto {
  @IsValidEmail()
  email: string;

  @IsPassword()
  password: string;
}

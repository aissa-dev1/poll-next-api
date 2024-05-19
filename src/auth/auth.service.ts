import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(dto: CreateUserDto) {
    return await this.usersService.createOne(dto);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new NotFoundException('Invalid credentials');
    }

    return { authToken: user.authToken };
  }
}

import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangeUserNameParams,
  DeleteUserParams,
  FindUserParams,
} from './types';
import { ChangeUserNameDto, DeleteUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param() params: FindUserParams) {
    return await this.usersService.findOne(params);
  }

  @Patch('change-name/:id')
  async changeName(
    @Body() dto: ChangeUserNameDto,
    @Param() params: ChangeUserNameParams,
  ) {
    return this.usersService.changeName(dto, params);
  }

  @Delete(':id')
  async deleteOne(
    @Body() dto: DeleteUserDto,
    @Param() params: DeleteUserParams,
  ) {
    return await this.usersService.deleteOne(dto, params);
  }
}

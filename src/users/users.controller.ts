import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangeUserAvatarParams,
  ChangeUserBioParams,
  ChangeUserNameParams,
  ChangeUserPasswordParams,
  DeleteUserParams,
  FindUserParams,
  FindUserWithTokenParams,
} from './types';
import {
  ChangeUserAvatarDto,
  ChangeUserBioDto,
  ChangeUserNameDto,
  ChangeUserPasswordDto,
  DeleteUserDto,
} from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id/with-polls')
  async findOneWithPolls(@Param() params: FindUserParams) {
    return await this.usersService.findOneWithPolls(params);
  }

  @Get(':id/without-polls')
  async findOneWithoutPolls(@Param() params: FindUserParams) {
    return await this.usersService.findOneWithoutPolls(params);
  }

  @Get(':id/minimized')
  async findOneMinimized(@Param() params: FindUserParams) {
    return await this.usersService.findOneMinimized(params);
  }

  @Get(':authToken/findone-with-token')
  async findOneWithToken(@Param() params: FindUserWithTokenParams) {
    return await this.usersService.findOneWithToken(params);
  }

  @Patch('change-name/:id')
  async changeName(
    @Body() dto: ChangeUserNameDto,
    @Param() params: ChangeUserNameParams,
  ) {
    return this.usersService.changeName(dto, params);
  }

  @Patch('change-avatar/:id')
  async changeAvatar(
    @Body() dto: ChangeUserAvatarDto,
    @Param() params: ChangeUserAvatarParams,
  ) {
    return this.usersService.changeAvatar(dto, params);
  }

  @Patch('change-bio/:id')
  async changeBio(
    @Body() dto: ChangeUserBioDto,
    @Param() params: ChangeUserBioParams,
  ) {
    return this.usersService.changeBio(dto, params);
  }

  @Patch('change-password/:id')
  async changePassword(
    @Body() dto: ChangeUserPasswordDto,
    @Param() params: ChangeUserPasswordParams,
  ) {
    return this.usersService.changePassword(dto, params);
  }

  @Delete(':id')
  async deleteOne(
    @Body() dto: DeleteUserDto,
    @Param() params: DeleteUserParams,
  ) {
    return await this.usersService.deleteOne(dto, params);
  }
}

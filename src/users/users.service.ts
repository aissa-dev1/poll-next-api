import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import {
  ChangeUserAvatarDto,
  ChangeUserBioDto,
  ChangeUserNameDto,
  ChangeUserPasswordDto,
  CreateUserDto,
  DeleteUserDto,
} from './users.dto';
import { v4 as uuidv4 } from 'uuid';
import { hashText } from 'src/utils/hash-text';
import {
  ChangeUserAvatarParams,
  ChangeUserBioParams,
  ChangeUserNameParams,
  ChangeUserPasswordParams,
  DeleteUserParams,
  FindUserParams,
  FindUserWithTokenParams,
} from './types';
import { Poll } from 'src/polls/poll.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Poll.name) private pollModel: Model<Poll>,
  ) {}

  async findOneWithPolls(params: FindUserParams) {
    const user = await this.userModel.findById(params.id, {
      authToken: false,
      password: false,
    });
    const polls = await this.pollModel.find({
      userId: params.id,
    });

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    return { user, polls };
  }

  async findOneWithoutPolls(params: FindUserParams) {
    const user = await this.userModel.findById(params.id, {
      authToken: false,
      password: false,
    });

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    return { user };
  }

  async findOneMinimized(params: FindUserParams) {
    const user = await this.userModel.findById(params.id, {
      authToken: false,
      email: false,
      password: false,
      bio: false,
    });

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    return { user };
  }

  async findOneWithToken(params: FindUserWithTokenParams) {
    if (!params.authToken) return;
    const user = await this.userModel.findOne(
      {
        authToken: params.authToken,
      },
      {
        password: false,
      },
    );

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    const polls = await this.pollModel.find({
      userId: user._id,
    });
    return { user, polls };
  }

  async createOne(dto: CreateUserDto) {
    const user = await this.findOneByEmail(dto.email);

    if (user) {
      throw new ForbiddenException(
        'Email is already linked with another account',
      );
    }

    const newUser = await this.userModel.create({
      authToken: uuidv4(),
      email: dto.email,
      password: await hashText(dto.password),
      fullName: dto.fullName,
      avatar: 'user-avatar-default.svg',
      bio: '',
    });
    await newUser.save();
    return {
      message: `Hello ${newUser.fullName.split(' ')[0]} you will be redirected to the login page`,
    };
  }

  async changeName(dto: ChangeUserNameDto, params: ChangeUserNameParams) {
    const user = await this.findOneById(params.id);

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    await user.updateOne({
      fullName: dto.fullName,
    });
    return { message: `Your new name is ${dto.fullName}` };
  }

  async changeAvatar(dto: ChangeUserAvatarDto, params: ChangeUserAvatarParams) {
    const user = await this.findOneById(params.id);

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    await user.updateOne({
      avatar: dto.avatar,
    });
    return { message: 'Your avatar changed successfully' };
  }

  async changeBio(dto: ChangeUserBioDto, params: ChangeUserBioParams) {
    const user = await this.findOneById(params.id);

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }

    await user.updateOne({
      bio: dto.bio,
    });
    return { message: 'Your bio changed successfully' };
  }

  async changePassword(
    dto: ChangeUserPasswordDto,
    params: ChangeUserPasswordParams,
  ) {
    const user = await this.findOneById(params.id);

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }
    if (dto.newPassword !== dto.rnewPassword) {
      throw new BadRequestException(
        'The new password must be similar to r-new password',
      );
    }

    const passwordMatch = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect password, try again');
    }

    await user.updateOne({
      password: await hashText(dto.newPassword),
    });
    return { message: 'Your password changed successfully' };
  }

  async deleteOne(dto: DeleteUserDto, params: DeleteUserParams) {
    const user = await this.findOneById(params.id);
    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }
    if (!passwordMatch) {
      throw new ForbiddenException(
        "You don't have permission to delete this account",
      );
    }

    await user.deleteOne();
    return '';
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}

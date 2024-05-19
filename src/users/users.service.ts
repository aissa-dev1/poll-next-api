import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { ChangeUserNameDto, CreateUserDto, DeleteUserDto } from './users.dto';
import { v4 as uuidv4 } from 'uuid';
import { hashText } from 'src/utils/hash-text';
import {
  ChangeUserNameParams,
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

  async deleteOne(dto: DeleteUserDto, params: DeleteUserParams) {
    const user = await this.findOneById(params.id);
    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!user) {
      throw new NotFoundException('No user found with the given id');
    }
    if (!passwordMatch) {
      throw new ForbiddenException(
        "You don't have permission to delete this user",
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

import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { User } from '../users/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class VerifyAuthToken implements NestMiddleware {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;
    const user = await this.userModel.findOne({ authToken });

    if (!user) {
      throw new ForbiddenException("You don't have access to this endpoint!");
    }

    next();
  }
}

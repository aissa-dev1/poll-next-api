import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PollsModule } from './polls/polls.module';
import { VerifyAuthToken } from './middlewares/verify-authtoken';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { PollsController } from './polls/polls.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
        dbName: 'poll-next-db',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PollsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyAuthToken)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'users/:id/with-polls', method: RequestMethod.GET },
        { path: 'users/:id/without-polls', method: RequestMethod.GET },
        { path: 'users/:id/minimized', method: RequestMethod.GET },
        { path: 'polls', method: RequestMethod.GET },
        { path: 'polls/:id', method: RequestMethod.GET },
      )
      .forRoutes(UsersController, PollsController);
  }
}

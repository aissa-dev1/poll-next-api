import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Poll, PollSchema } from './poll.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poll.name, schema: PollSchema }]),
  ],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [
    MongooseModule.forFeature([{ name: Poll.name, schema: PollSchema }]),
  ],
})
export class PollsModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePollDto } from './polls.dto';
import { PollsService } from './polls.service';
import {
  DeletePollParams,
  FindPollParams,
  LikePollParams,
  LikePollQuery,
  VotePollOptionParams,
  VotePollOptionQuery,
} from './types';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  async findAll() {
    return this.pollsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: FindPollParams) {
    return this.pollsService.findOne(params);
  }

  @Post('create-one')
  async createOne(@Body() dto: CreatePollDto) {
    return await this.pollsService.createOne(dto);
  }

  @Patch('like-one/:id')
  async likeOne(
    @Param() params: LikePollParams,
    @Query() query: LikePollQuery,
  ) {
    return await this.pollsService.likeOne(params, query);
  }

  @Patch('vote-one-option/:id')
  async voteOneOption(
    @Param() params: VotePollOptionParams,
    @Query() query: VotePollOptionQuery,
  ) {
    return await this.pollsService.voteOneOption(params, query);
  }

  @Delete(':id')
  async deleteOne(@Param() params: DeletePollParams) {
    return await this.pollsService.deleteOne(params);
  }
}

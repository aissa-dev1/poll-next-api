import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePollDto } from './polls.dto';
import { Model } from 'mongoose';
import { Poll } from './poll.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  DeletePollParams,
  FindPollParams,
  LikePollParams,
  LikePollQuery,
  PollOption,
  VotePollOptionParams,
  VotePollOptionQuery,
} from './types';
import { v4 as uuidv4 } from 'uuid';
import { shuffleArray } from 'src/utils/shuffle-array';

@Injectable()
export class PollsService {
  constructor(@InjectModel(Poll.name) private pollModel: Model<Poll>) {}

  async findAll() {
    const polls = await this.pollModel.find();
    const newPolls = shuffleArray(polls);
    return { polls: newPolls };
  }

  async findOne(params: FindPollParams) {
    const poll = await this.findOneById(params.id);

    if (!poll) {
      throw new NotFoundException('No poll matches the given id');
    }

    return { poll };
  }

  async findOneById(id: string) {
    const poll = await this.pollModel.findById(id);
    return poll;
  }

  async createOne(dto: CreatePollDto) {
    const setupOptions = (dtoOptions: string[]): PollOption[] => {
      const options: PollOption[] = [];
      for (const option of dtoOptions) {
        options.push({ id: uuidv4(), name: option, voters: [] });
      }
      return options;
    };
    const newPoll = await this.pollModel.create({
      ...dto,
      options: setupOptions(dto.options),
      likes: [],
    });
    await newPoll.save();
    return { message: `Poll with name ${dto.question} created successfully` };
  }

  async likeOne(params: LikePollParams, query: LikePollQuery) {
    const poll = await this.findOneById(params.id);
    const setupLikeOperation = (prev: string[]): string[] => {
      const newLikes: string[] = [...prev];

      if (poll.likes.includes(query.fanId)) {
        const fanIndex = poll.likes.indexOf(query.fanId);
        newLikes.splice(fanIndex, 1);
        return newLikes;
      }

      newLikes.push(query.fanId);
      return newLikes;
    };
    await poll.updateOne({
      likes: setupLikeOperation(poll.likes),
    });
    return '';
  }

  async voteOneOption(
    params: VotePollOptionParams,
    query: VotePollOptionQuery,
  ) {
    const poll = await this.findOneById(params.id);
    const parsedIndex = parseInt(query.index);
    const setupVoteOperation = (prev: PollOption[]): PollOption[] => {
      const options = [...prev];
      if (isNaN(parsedIndex) || parsedIndex < 0) {
        return;
      }
      for (const option of options) {
        if (option.voters.includes(query.fanId)) return;
      }
      options[parsedIndex].voters.push(query.fanId);
      return options;
    };
    await poll.updateOne({
      options: setupVoteOperation(poll.options),
    });
    return '';
  }

  async deleteOne(params: DeletePollParams) {
    const poll = await this.findOneById(params.id);

    if (!poll) {
      throw new NotFoundException('No poll found with the given id');
    }

    await poll.deleteOne();
    return '';
  }
}

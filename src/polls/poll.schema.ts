import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PollOption } from './types';

@Schema()
export class Poll extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  question: string;

  @Prop()
  options: PollOption[];

  @Prop({ required: true })
  category: string;

  @Prop()
  likes: string[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);

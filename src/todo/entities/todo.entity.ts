import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Auth } from 'src/auth/entities/auth.entity';

@Schema({ timestamps: true, versionKey: false })
export class Todo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: Date, default: null })
  limitDate: Date;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true })
  author: Auth;

  @Prop({ default: true })
  status: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

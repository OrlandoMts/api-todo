import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Todo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  // TODO: Validate date
  // @Prop()
  // // @isDate()
  // limitDate: string;

  @Prop({ default: false })
  completed: boolean;

  // TODO: reference to auth author
  // author

  @Prop({ default: true })
  status: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import { Document } from 'mongoose';

import { Role } from 'src/common/secure';

@Schema({ timestamps: true, versionKey: false })
export class Auth extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  @IsEnum(Role)
  role: string;

  @Prop({ default: true })
  status: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
// export const AuthSchema = SchemaFactory.createForClass(Auth).plugin(
//   removeVersionKeyPlugin,
// );

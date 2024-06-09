import { Types } from 'mongoose';

export interface JwtItf {
  _id: Types.ObjectId | string;
  username: string;
  role: string;
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogInAuthDto, SignUpAuthDto } from './dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Auth.name)
    private readonly authMod: Model<Auth>,
  ) {}

  private _handleError(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`User already exists`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Check server logs`);
  }

  async signUp(signUpAuthDto: SignUpAuthDto) {
    try {
      const data = await this.authMod.create(signUpAuthDto);
      return data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async logIn(logInAuthDto: LogInAuthDto) {
    console.log('hey');
    return 'This action login a user';
  }
}

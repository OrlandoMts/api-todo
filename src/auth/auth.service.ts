import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { SignUpAuthDto } from './dto';
import { Auth } from './entities/auth.entity';
import { JwtItf } from './interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Auth.name)
    private readonly authMod: Model<Auth>,
    private jwtService: JwtService,
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

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.authMod.findOne({ username, status: true });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async logIn(req: any) {
    const { user } = req;
    const payload: JwtItf = {
      username: user.username,
      _id: user._id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

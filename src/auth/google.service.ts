import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';

import { Role } from 'src/common/secure';
import { encryptPassword, generatePassword } from 'src/common/utils';
import { SignUpAuthDto } from './dto';
import { Auth } from './entities/auth.entity';
import { JwtItf } from './interface';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private client: OAuth2Client;

  constructor(
    @InjectModel(Auth.name)
    private readonly authMod: Model<Auth>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.client = new OAuth2Client(process.env.ID_CLIENT_G);
  }

  private _handleError(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Check logs', error.message);
  }

  async startFlowLogin(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.ID_CLIENT_G,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const username = (payload.email as string).split('@');

    return await this.login(email, ...username);
  }

  async login(email: string, username?: string) {
    let existingUser: Auth;

    try {
      existingUser = await this.authMod.findOne({ email }).exec();
    } catch (error) {
      this._handleError(error);
    }

    if (!existingUser) {
      try {
        const password = generatePassword(8, 1, 1, 1, 1);
        const pwdEncrypted = encryptPassword(password);
        const body: SignUpAuthDto = {
          email,
          username,
          password: pwdEncrypted,
          role: Role.User,
        };
        existingUser = await this.authMod.create(body);
      } catch (error) {
        this._handleError(error);
      }
    }

    // Generate payload to JWT
    const payload: JwtItf = {
      username: existingUser.username,
      _id: existingUser._id as string,
      role: existingUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: this.configService.get<string>('idClientG'),
          client_secret: this.configService.get<string>('secretClientG'),
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to refresh the access token.');
    }
  }

  async getProfile(token: string) {
    try {
      return axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { Role } from 'src/common/secure';
import { PayloadGoogleItf, UserGoogleItf } from '../interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('idClientG'),
      clientSecret: configService.get<string>('secretClientG'),
      callbackURL: configService.get<string>('callbackUrlG'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, emails } = profile;
    const username = (emails[0].value as string).split('@');

    const user: UserGoogleItf = {
      provider: 'google',
      email: emails[0].value,
      username: username[0],
      role: Role.User,
      // name: `${name.givenName} ${name.familyName}`,
      // picture: photos[0].value,
    };

    const payload: PayloadGoogleItf = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}

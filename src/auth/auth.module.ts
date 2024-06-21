import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Auth, AuthSchema } from './entities/auth.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { GoogleStrategy, JwtStrategy, LocalStrategy } from './guard';
import { PasswordHashPipe } from './pipe';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleService,
    PasswordHashPipe,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
  ],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: '15m' }, //24h
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}

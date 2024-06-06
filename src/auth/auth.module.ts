import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './entities/auth.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordHashPipe } from './pipe';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordHashPipe],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
})
export class AuthModule {}

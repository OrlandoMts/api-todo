import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './auth/auth.module';
import { EnvConfiguration } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [EnvConfiguration] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/browser'),
    }),
    MongooseModule.forRoot(process.env.MONGODB, { dbName: 'todo' }),
    AuthModule,
  ],
})
export class AppModule {}

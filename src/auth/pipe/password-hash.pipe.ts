import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  constructor(
    @Inject(ConfigService) private readonly configSrv: ConfigService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.password) {
      const saltRounds = this.configSrv.get<number>('saltRounds');
      const salt = genSaltSync(saltRounds);
      value.password = hashSync(value.password, salt);
    }
    return value;
  }
}

import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from 'src/common/secure';

export class SignUpAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  // @IsString()
  // @MinLength(4)
  // @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password too weak',
  // })
  // password: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: 'Password too weak' },
  )
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

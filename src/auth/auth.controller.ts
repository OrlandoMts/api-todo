import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto';
import { PasswordHashPipe } from './pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordHashPipe: PasswordHashPipe,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @UsePipes(PasswordHashPipe)
  create(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }

  @Post('login')
  login(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.logIn(signUpAuthDto);
  }
}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { Roles } from 'src/common/decorator';
import { RolesGuard } from 'src/common/guard';
import { Role } from 'src/common/secure';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import { PasswordHashPipe } from './pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @UsePipes(PasswordHashPipe)
  create(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.logIn(req);
  }

  // NOTE: Endpoint to test rolesGuard
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}

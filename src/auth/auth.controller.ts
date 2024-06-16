import {
  Body,
  Controller,
  Get,
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
import { GoogleService } from './google.service';
import { GoogleOauthGuard, JwtAuthGuard, LocalAuthGuard } from './guard';
import { PasswordHashPipe } from './pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleSrv: GoogleService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @UsePipes(PasswordHashPipe)
  async create(@Body() signUpAuthDto: SignUpAuthDto) {
    return await this.authService.signUp(signUpAuthDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return await this.authService.logIn(req);
  }

  // NOTE: Endpoint to test rolesGuard
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('profile')
  async getProfile(@Request() req: any) {
    return await req.user;
  }

  // @UseGuards(CheckTokenExpiryGuard)
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Request() req: unknown) {
    // Redirige a Google para autenticación
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google/redirect')
  async googleAuthRedirect(@Request() req: any) {
    return this.googleSrv.googleLogin(req.user);
  }
}

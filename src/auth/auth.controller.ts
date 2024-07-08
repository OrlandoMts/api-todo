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
import {
  CheckTokenExpiryGuard,
  GoogleOauthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
} from './guard';
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

  @UseGuards(CheckTokenExpiryGuard)
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Request() req: unknown) {
    // Redirige a Google para autenticación
  }

  @Post('google')
  async loginWithGoogle(@Body() body) {
    const { idToken } = body;
    return this.googleSrv.startFlowLogin(idToken);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google/redirect')
  async googleAuthRedirect(@Request() req: any) {
    const { email } = req.user;
    return this.googleSrv.login(email);
  }

  @Post('logout')
  async logout() {
    // Only response a confirmation message
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refresh_token: string) {
    return this.authService.refresh(refresh_token);
  }
}

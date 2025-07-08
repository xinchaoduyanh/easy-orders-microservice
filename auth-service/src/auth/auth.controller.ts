import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import CustomZodValidationPipe from '../shared/pipes/custom-zod-validation.pipe';
import {
  RegisterSchema,
  RegisterDto,
  LoginSchema,
  LoginDto,
  RefreshTokenSchema,
  RefreshTokenDto,
  User,
} from './auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../shared/decorators/current-user.decorator';

// Response types
interface AuthResponse {
  user?: User;
  access_token: string;
  refresh_token: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
}

interface LogoutResponse {
  message: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new CustomZodValidationPipe(RegisterSchema))
  async register(@Body() body: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  @UsePipes(new CustomZodValidationPipe(LoginSchema))
  async login(@Body() body: LoginDto): Promise<AuthResponse> {
    return this.authService.login(body);
  }

  @Post('refresh')
  @UsePipes(new CustomZodValidationPipe(RefreshTokenSchema))
  async refresh(@Body() body: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refresh(body);
  }

  @Post('logout')
  @UsePipes(new CustomZodValidationPipe(RefreshTokenSchema))
  async logout(@Body() body: RefreshTokenDto): Promise<LogoutResponse> {
    return this.authService.logout(body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@CurrentUser() user: any): Promise<User> {
    return this.authService.me(user);
  }

  @Post('revoke-all')
  @UseGuards(AuthGuard('jwt'))
  async revokeAll(@CurrentUser() user: any): Promise<LogoutResponse> {
    return this.authService.revokeAll(user.id);
  }

  // OAuth endpoints
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport will handle the redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.googleOAuth(req.user);
    const redirectUri = req.query.redirect_uri as string;
    if (redirectUri) {
      // Encode user info as base64 to avoid long query string
      const userInfo = Buffer.from(JSON.stringify(result.user)).toString('base64');
      const url = `${redirectUri}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&user=${userInfo}`;
      return res.redirect(url);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Passport will handle the redirect
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.githubOAuth(req.user);
    const redirectUri = req.query.redirect_uri as string;
    if (redirectUri) {
      const userInfo = Buffer.from(JSON.stringify(result.user)).toString('base64');
      const url = `${redirectUri}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&user=${userInfo}`;
      return res.redirect(url);
    }
    return res.status(HttpStatus.OK).json(result);
  }
}

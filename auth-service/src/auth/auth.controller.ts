import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  UseInterceptors,
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
import { ResponseInterceptor } from '../shared/interceptors/response.interceptor';
import { ApiResponseOk, ApiResponseCreated } from '../shared/decorators/response.decorator';
import envConfig from '../../config';

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
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new CustomZodValidationPipe(RegisterSchema))
  @ApiResponseCreated('User registered successfully')
  async register(@Body() body: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  @UsePipes(new CustomZodValidationPipe(LoginSchema))
  @ApiResponseCreated('Login successful')
  async login(@Body() body: LoginDto): Promise<AuthResponse> {
    return this.authService.login(body);
  }

  @Post('refresh')
  @UsePipes(new CustomZodValidationPipe(RefreshTokenSchema))
  @ApiResponseOk('Token refreshed successfully')
  async refresh(@Body() body: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refresh(body);
  }

  @Post('logout')
  @UsePipes(new CustomZodValidationPipe(RefreshTokenSchema))
  @ApiResponseOk('Logout successful')
  async logout(@Body() body: RefreshTokenDto): Promise<LogoutResponse> {
    return this.authService.logout(body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponseOk('User profile retrieved successfully')
  async me(@CurrentUser() user: any): Promise<User> {
    return this.authService.me(user);
  }

  @Post('revoke-all')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponseOk('All tokens revoked successfully')
  async revokeAll(@CurrentUser() user: any): Promise<LogoutResponse> {
    return this.authService.revokeAll(user.id);
  }

  // OAuth endpoints
  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    const redirectUri = req.query.redirect_uri as string;
    const state = Buffer.from(JSON.stringify({ redirectUri })).toString('base64');
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${envConfig.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(envConfig.GOOGLE_CALLBACK_URL)}` +
      `&response_type=code` +
      `&scope=email%20profile` +
      `&state=${encodeURIComponent(state)}`;
    return res.redirect(authUrl);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiResponseOk('Google OAuth successful')
  async googleCallback(@Req() req: Request, @Res() res: Response): Promise<AuthResponse | void> {
    // Lấy redirectUri từ req.user (do strategy trả về)
    const redirectUri = (req.user as User).redirectUri || '/';
    console.log('BE OAUTH: redirectUri FE muốn nhận lại =', redirectUri);

    const callbackResult = await this.authService.googleOAuthCallback(req.user, redirectUri);
    if (callbackResult.redirectUrl) {
      return res.redirect(callbackResult.redirectUrl);
    }
    return callbackResult.result;
  }

  @Get('github')
  async githubAuth(@Req() req: Request, @Res() res: Response) {
    const redirectUri = req.query.redirect_uri as string;
    const state = Buffer.from(JSON.stringify({ redirectUri })).toString('base64');
    const authUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${envConfig.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(envConfig.GITHUB_CALLBACK_URL)}` +
      `&scope=user:email` +
      `&state=${encodeURIComponent(state)}`;
    return res.redirect(authUrl);
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiResponseOk('GitHub OAuth successful')
  async githubCallback(@Req() req: Request, @Res() res: Response): Promise<AuthResponse | void> {
    // Giải mã state để lấy redirectUri
    let redirectUri = '/';
    if (req.query.state) {
      try {
        const stateObj = JSON.parse(Buffer.from(req.query.state as string, 'base64').toString());
        redirectUri = stateObj.redirectUri || '/';
      } catch (e) {
        redirectUri = '/';
      }
    }
    console.log('BE OAUTH: redirectUri FE muốn nhận lại =', redirectUri);
    const callbackResult = await this.authService.githubOAuthCallback(req.user, redirectUri);
    if (callbackResult.redirectUrl) {
      return res.redirect(callbackResult.redirectUrl);
    }
    return callbackResult.result;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, RefreshTokenDto, User } from './auth.dto';
import { v4 as uuidv4 } from 'uuid';
import envConfig from '../../config';
import { omit } from 'lodash';

// Constants
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const BCRYPT_ROUNDS = 12;

// Types
interface TokenPayload {
  id: string;
  email: string;
  provider: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Convert database user to User type (without sensitive fields)
   */
  private toUserType(dbUser: any): User | null {
    if (!dbUser) return null;
    return omit(dbUser, ['password', 'createdAt', 'updatedAt']) as User;
  }

  /**
   * Generate JWT access token and refresh token
   */
  private async generateTokens(user: any): Promise<TokenResponse> {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      provider: user.provider,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      secret: envConfig.JWT_SECRET,
    });

    const refresh_token = `${uuidv4()}.${uuidv4()}`;
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN);

    await this.prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId: user.id,
        expiresAt,
      },
    });

    return { access_token, refresh_token };
  }

  /**
   * Check if user account is active
   */
  private validateUserStatus(user: any): void {
    if (user.status === 'INACTIVE') {
      throw new UnauthorizedException('Account is inactive');
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterDto): Promise<{ success: boolean; message?: string }> {
    const { email, password, firstName, lastName } = data;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, message: 'Email already registered' };
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        provider: 'LOCAL',
        status: 'UNVERIFIED',
      },
    });

    return { success: true, message: 'User registered successfully' };
  }

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.validateUserStatus(user);

    const tokens = await this.generateTokens(user);
    return { user: this.toUserType(user), ...tokens };
  }

  /**
   * Validate user credentials (for Passport strategy)
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password || user.status === 'INACTIVE') return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return this.toUserType(user);
  }

  /**
   * Refresh access token
   */
  async refresh(data: RefreshTokenDto): Promise<AuthResponse> {
    const { refreshToken } = data;

    const tokenDoc = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenDoc || tokenDoc.isRevoked || tokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Token rotation: revoke old token
    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });

    const user = await this.prisma.user.findUnique({ where: { id: tokenDoc.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    this.validateUserStatus(user);

    const tokens = await this.generateTokens(user);
    return { user: this.toUserType(user), ...tokens };
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(data: RefreshTokenDto): Promise<{ message: string }> {
    const { refreshToken } = data;

    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Revoke all refresh tokens for user
   */
  async revokeAll(userId: string): Promise<{ message: string }> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });

    return { message: 'All refresh tokens revoked' };
  }

  /**
   * Handle Google OAuth
   */
  async googleOAuth(profile: any): Promise<AuthResponse> {
    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          provider: 'GOOGLE',
          providerId: profile.providerId,
          firstName: profile.name,
          avatar: profile.avatar,
          status: 'VERIFIED',
        },
      });
    }

    this.validateUserStatus(user);

    const tokens = await this.generateTokens(user);
    return { user: this.toUserType(user), ...tokens };
  }

  /**
   * Handle Google OAuth callback with redirect logic
   */
  async googleOAuthCallback(
    profile: any,
    redirectUri?: string,
  ): Promise<{ redirectUrl?: string; result?: AuthResponse }> {
    const result = await this.googleOAuth(profile);

    if (redirectUri) {
      // Encode user info as URI component (JSON string)
      const userInfo = encodeURIComponent(JSON.stringify(result.user));
      const redirectUrl = `${redirectUri}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&user=${userInfo}`;
      // Xóa log debug
      return { redirectUrl };
    }

    return { result };
  }

  /**
   * Handle GitHub OAuth
   */
  async githubOAuth(profile: any): Promise<AuthResponse> {
    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          provider: 'GITHUB',
          providerId: profile.providerId,
          firstName: profile.name,
          avatar: profile.avatar,
          status: 'VERIFIED',
        },
      });
    }

    this.validateUserStatus(user);

    const tokens = await this.generateTokens(user);
    return { user: this.toUserType(user), ...tokens };
  }

  /**
   * Handle GitHub OAuth callback with redirect logic
   */
  async githubOAuthCallback(
    profile: any,
    redirectUri?: string,
  ): Promise<{ redirectUrl?: string; result?: AuthResponse }> {
    const result = await this.githubOAuth(profile);

    if (redirectUri) {
      // Encode user info as URI component (JSON string)
      const userInfo = encodeURIComponent(JSON.stringify(result.user));
      const redirectUrl = `${redirectUri}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&user=${userInfo}`;
      return { redirectUrl };
    }

    return { result };
  }

  /**
   * Get current user profile
   */
  async me(user: any): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { id: user.id } });
    return this.toUserType(userData);
  }
}

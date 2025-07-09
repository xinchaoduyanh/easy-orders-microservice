import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, RefreshTokenDto, User } from './auth.dto';
interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private toUserType;
    private generateTokens;
    private validateUserStatus;
    register(data: RegisterDto): Promise<{
        success: boolean;
        message?: string;
    }>;
    login(data: LoginDto): Promise<AuthResponse>;
    validateUser(email: string, password: string): Promise<User | null>;
    refresh(data: RefreshTokenDto): Promise<AuthResponse>;
    logout(data: RefreshTokenDto): Promise<{
        message: string;
    }>;
    revokeAll(userId: string): Promise<{
        message: string;
    }>;
    googleOAuth(profile: any): Promise<AuthResponse>;
    googleOAuthCallback(profile: any, redirectUri?: string): Promise<{
        redirectUrl?: string;
        result?: AuthResponse;
    }>;
    githubOAuth(profile: any): Promise<AuthResponse>;
    githubOAuthCallback(profile: any, redirectUri?: string): Promise<{
        redirectUrl?: string;
        result?: AuthResponse;
    }>;
    me(user: any): Promise<User | null>;
}
export {};

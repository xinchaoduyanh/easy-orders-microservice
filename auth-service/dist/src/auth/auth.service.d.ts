import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, RefreshTokenDto, User } from './auth.dto';
import { ClientKafka } from '@nestjs/microservices';
interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly kafkaClient;
    constructor(prisma: PrismaService, jwtService: JwtService, kafkaClient: ClientKafka);
    private toUserType;
    private generateTokens;
    private validateUserStatus;
    private emitUserRegisteredEvent;
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

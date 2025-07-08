import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, User } from './auth.dto';
import { Request, Response } from 'express';
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
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<RegisterResponse>;
    login(body: LoginDto): Promise<AuthResponse>;
    refresh(body: RefreshTokenDto): Promise<AuthResponse>;
    logout(body: RefreshTokenDto): Promise<LogoutResponse>;
    me(user: any): Promise<User>;
    revokeAll(user: any): Promise<LogoutResponse>;
    googleAuth(): Promise<void>;
    googleCallback(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    githubAuth(): Promise<void>;
    githubCallback(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export {};

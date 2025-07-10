import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponse } from './auth.dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<any>;
    login(body: LoginDto): Promise<AuthResponse>;
    refresh(body: RefreshTokenDto): Promise<any>;
    logout(body: RefreshTokenDto): Promise<any>;
    me(user: any): Promise<any>;
    revokeAll(user: any): Promise<any>;
    googleAuth(req: Request, res: Response): Promise<void>;
    googleCallback(req: Request, res: Response): Promise<any>;
    githubAuth(req: Request, res: Response): Promise<void>;
    githubCallback(req: Request, res: Response): Promise<any>;
}

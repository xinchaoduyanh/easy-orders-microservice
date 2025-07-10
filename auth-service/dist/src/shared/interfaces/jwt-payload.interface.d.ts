export interface JwtPayload {
    userId: string;
    email: string;
    provider: string;
    iat: number;
    exp: number;
}
export interface AuthUser {
    userId: string;
    email: string;
    provider: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: AuthUser;
}

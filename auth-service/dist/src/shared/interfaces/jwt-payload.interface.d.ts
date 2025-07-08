export interface JwtPayload {
    sub: string;
    email: string;
    provider: string;
    iat: number;
    exp: number;
}
export interface AuthUser {
    id: string;
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

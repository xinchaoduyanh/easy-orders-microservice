export interface JwtPayload {
  userId: string; // User ID
  email: string;
  provider: string; // LOCAL, GOOGLE, GITHUB
  iat: number;
  exp: number;
}

export interface AuthUser {
  userId: string; // Được map từ userId trong JWT payload
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

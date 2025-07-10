export interface JwtPayload {
  userId: string; // User ID
  email: string;
  provider: string; // LOCAL, GOOGLE, GITHUB
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

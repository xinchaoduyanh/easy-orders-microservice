import { z } from 'zod';

// Base schemas with validation messages
export const EmailSchema = z.string().email('Invalid email format').min(1, 'Email is required');

export const PasswordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password is too long');

export const NameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name is too long')
  .optional();

// User type without sensitive fields
export type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  provider: 'LOCAL' | 'GOOGLE' | 'GITHUB';
  providerId?: string | null;
  status: 'UNVERIFIED' | 'VERIFIED' | 'INACTIVE';
};

// Request DTOs
export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  firstName: NameSchema,
  lastName: NameSchema,
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(10, 'Refresh token is invalid')
    .max(500, 'Refresh token is too long'),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;

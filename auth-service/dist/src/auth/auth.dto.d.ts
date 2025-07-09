import { z } from 'zod';
export declare const EmailSchema: z.ZodString;
export declare const PasswordSchema: z.ZodString;
export declare const NameSchema: z.ZodOptional<z.ZodString>;
export type User = {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    provider: 'LOCAL' | 'GOOGLE' | 'GITHUB';
    providerId?: string | null;
    status: 'UNVERIFIED' | 'VERIFIED' | 'INACTIVE';
    redirectUri?: string;
};
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}, {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export type LoginDto = z.infer<typeof LoginSchema>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken?: string;
}, {
    refreshToken?: string;
}>;
export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;

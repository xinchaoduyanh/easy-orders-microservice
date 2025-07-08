"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenSchema = exports.LoginSchema = exports.RegisterSchema = exports.NameSchema = exports.PasswordSchema = exports.EmailSchema = void 0;
const zod_1 = require("zod");
exports.EmailSchema = zod_1.z.string().email('Invalid email format').min(1, 'Email is required');
exports.PasswordSchema = zod_1.z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long');
exports.NameSchema = zod_1.z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name is too long')
    .optional();
exports.RegisterSchema = zod_1.z.object({
    email: exports.EmailSchema,
    password: exports.PasswordSchema,
    firstName: exports.NameSchema,
    lastName: exports.NameSchema,
});
exports.LoginSchema = zod_1.z.object({
    email: exports.EmailSchema,
    password: exports.PasswordSchema,
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z
        .string()
        .min(10, 'Refresh token is invalid')
        .max(500, 'Refresh token is too long'),
});
//# sourceMappingURL=auth.dto.js.map
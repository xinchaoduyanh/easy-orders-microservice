"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const config_1 = require("../../config");
const lodash_1 = require("lodash");
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    toUserType(dbUser) {
        if (!dbUser)
            return null;
        return (0, lodash_1.omit)(dbUser, ['password', 'createdAt', 'updatedAt']);
    }
    async generateTokens(user) {
        const payload = {
            id: user.id,
            email: user.email,
            provider: user.provider,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
        };
        const access_token = this.jwtService.sign(payload, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            secret: config_1.default.JWT_SECRET,
        });
        const refresh_token = `${(0, uuid_1.v4)()}.${(0, uuid_1.v4)()}`;
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN);
        await this.prisma.refreshToken.create({
            data: {
                token: refresh_token,
                userId: user.id,
                expiresAt,
            },
        });
        return { access_token, refresh_token };
    }
    validateUserStatus(user) {
        if (user.status === 'INACTIVE') {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
    }
    async register(data) {
        const { email, password, firstName, lastName } = data;
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            return { success: false, message: 'Email already registered' };
        }
        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
        await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                provider: 'LOCAL',
                status: 'UNVERIFIED',
            },
        });
        return { success: true, message: 'User registered successfully' };
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.validateUserStatus(user);
        const tokens = await this.generateTokens(user);
        return { user: this.toUserType(user), ...tokens };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password || user.status === 'INACTIVE')
            return null;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return null;
        return this.toUserType(user);
    }
    async refresh(data) {
        const { refreshToken } = data;
        const tokenDoc = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!tokenDoc || tokenDoc.isRevoked || tokenDoc.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        await this.prisma.refreshToken.update({
            where: { token: refreshToken },
            data: { isRevoked: true },
        });
        const user = await this.prisma.user.findUnique({ where: { id: tokenDoc.userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        this.validateUserStatus(user);
        const tokens = await this.generateTokens(user);
        return { user: this.toUserType(user), ...tokens };
    }
    async logout(data) {
        const { refreshToken } = data;
        await this.prisma.refreshToken.updateMany({
            where: { token: refreshToken },
            data: { isRevoked: true },
        });
        return { message: 'Logged out successfully' };
    }
    async revokeAll(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId },
            data: { isRevoked: true },
        });
        return { message: 'All refresh tokens revoked' };
    }
    async googleOAuth(profile) {
        let user = await this.prisma.user.findUnique({ where: { email: profile.email } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    provider: 'GOOGLE',
                    providerId: profile.providerId,
                    firstName: profile.name,
                    avatar: profile.avatar,
                    status: 'VERIFIED',
                },
            });
        }
        this.validateUserStatus(user);
        const tokens = await this.generateTokens(user);
        return { user: this.toUserType(user), ...tokens };
    }
    async googleOAuthCallback(profile, redirectUri) {
        const result = await this.googleOAuth(profile);
        if (redirectUri) {
            const userInfo = encodeURIComponent(JSON.stringify(result.user));
            const redirectUrl = `${redirectUri}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&user=${userInfo}`;
            console.log('BE OAUTH: Sẽ redirect về FE URL =', redirectUrl);
            return { redirectUrl };
        }
        return { result };
    }
    async githubOAuth(profile) {
        let user = await this.prisma.user.findUnique({ where: { email: profile.email } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    provider: 'GITHUB',
                    providerId: profile.providerId,
                    firstName: profile.name,
                    avatar: profile.avatar,
                    status: 'VERIFIED',
                },
            });
        }
        this.validateUserStatus(user);
        const tokens = await this.generateTokens(user);
        return { user: this.toUserType(user), ...tokens };
    }
    async githubOAuthCallback(profile, redirectUri) {
        const result = await this.githubOAuth(profile);
        if (redirectUri) {
            const userInfo = encodeURIComponent(JSON.stringify(result.user));
            const redirectUrl = `${redirectUri}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&user=${userInfo}`;
            return { redirectUrl };
        }
        return { result };
    }
    async me(user) {
        const userData = await this.prisma.user.findUnique({ where: { id: user.id } });
        return this.toUserType(userData);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
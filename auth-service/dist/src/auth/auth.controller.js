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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const custom_zod_validation_pipe_1 = require("../shared/pipes/custom-zod-validation.pipe");
const auth_dto_1 = require("./auth.dto");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../shared/decorators/current-user.decorator");
const response_interceptor_1 = require("../shared/interceptors/response.interceptor");
const response_decorator_1 = require("../shared/decorators/response.decorator");
const config_1 = require("../../config");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(body) {
        return this.authService.register(body);
    }
    async login(body) {
        return this.authService.login(body);
    }
    async refresh(body) {
        return this.authService.refresh(body);
    }
    async logout(body) {
        return this.authService.logout(body);
    }
    async me(user) {
        return this.authService.me(user);
    }
    async revokeAll(user) {
        return this.authService.revokeAll(user.id);
    }
    async googleAuth(req, res) {
        const redirectUri = req.query.redirect_uri;
        const state = Buffer.from(JSON.stringify({ redirectUri })).toString('base64');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${config_1.default.GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(config_1.default.GOOGLE_CALLBACK_URL)}` +
            `&response_type=code` +
            `&scope=email%20profile` +
            `&state=${encodeURIComponent(state)}`;
        return res.redirect(authUrl);
    }
    async googleCallback(req, res) {
        const redirectUri = req.user.redirectUri || '/';
        console.log('BE OAUTH: redirectUri FE muốn nhận lại =', redirectUri);
        const callbackResult = await this.authService.googleOAuthCallback(req.user, redirectUri);
        if (callbackResult.redirectUrl) {
            return res.redirect(callbackResult.redirectUrl);
        }
        return callbackResult.result;
    }
    async githubAuth(req, res) {
        const redirectUri = req.query.redirect_uri;
        const state = Buffer.from(JSON.stringify({ redirectUri })).toString('base64');
        const authUrl = `https://github.com/login/oauth/authorize?` +
            `client_id=${config_1.default.GITHUB_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(config_1.default.GITHUB_CALLBACK_URL)}` +
            `&scope=user:email` +
            `&state=${encodeURIComponent(state)}`;
        return res.redirect(authUrl);
    }
    async githubCallback(req, res) {
        let redirectUri = '/';
        if (req.query.state) {
            try {
                const stateObj = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                redirectUri = stateObj.redirectUri || '/';
            }
            catch (e) {
                redirectUri = '/';
            }
        }
        console.log('BE OAUTH: redirectUri FE muốn nhận lại =', redirectUri);
        const callbackResult = await this.authService.githubOAuthCallback(req.user, redirectUri);
        if (callbackResult.redirectUrl) {
            return res.redirect(callbackResult.redirectUrl);
        }
        return callbackResult.result;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UsePipes)(new custom_zod_validation_pipe_1.default(auth_dto_1.RegisterSchema)),
    (0, response_decorator_1.ApiResponseCreated)('User registered successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new custom_zod_validation_pipe_1.default(auth_dto_1.LoginSchema)),
    (0, response_decorator_1.ApiResponseCreated)('Login successful'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UsePipes)(new custom_zod_validation_pipe_1.default(auth_dto_1.RefreshTokenSchema)),
    (0, response_decorator_1.ApiResponseOk)('Token refreshed successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UsePipes)(new custom_zod_validation_pipe_1.default(auth_dto_1.RefreshTokenSchema)),
    (0, response_decorator_1.ApiResponseOk)('Logout successful'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, response_decorator_1.ApiResponseOk)('User profile retrieved successfully'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('revoke-all'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, response_decorator_1.ApiResponseOk)('All tokens revoked successfully'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "revokeAll", null);
__decorate([
    (0, common_1.Get)('google'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, response_decorator_1.ApiResponseOk)('Google OAuth successful'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Get)('github'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    (0, response_decorator_1.ApiResponseOk)('GitHub OAuth successful'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
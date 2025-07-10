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
exports.GithubStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_github2_1 = require("passport-github2");
const config_1 = require("../../../config");
let GithubStrategy = class GithubStrategy extends (0, passport_1.PassportStrategy)(passport_github2_1.Strategy, 'github') {
    constructor() {
        const config = {
            clientID: config_1.default.GITHUB_CLIENT_ID,
            clientSecret: config_1.default.GITHUB_CLIENT_SECRET,
            callbackURL: config_1.default.GITHUB_CALLBACK_URL,
            scope: ['user:email'],
        };
        super(config);
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, username, emails, photos } = profile;
        const user = {
            provider: 'GITHUB',
            providerId: id,
            email: emails && emails[0] ? emails[0].value : undefined,
            name: username,
            avatar: photos && photos[0] ? photos[0].value : undefined,
        };
        done(null, user);
    }
};
exports.GithubStrategy = GithubStrategy;
exports.GithubStrategy = GithubStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GithubStrategy);
//# sourceMappingURL=github.strategy.js.map
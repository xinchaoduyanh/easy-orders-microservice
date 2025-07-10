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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("../../../config");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor() {
        super({
            clientID: config_1.default.GOOGLE_CLIENT_ID,
            clientSecret: config_1.default.GOOGLE_CLIENT_SECRET,
            callbackURL: config_1.default.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
    }
    async validate(req, accessToken, refreshToken, profile, done) {
        let redirectUri;
        if (req.query.state) {
            try {
                const stateDecoded = Buffer.from(req.query.state, 'base64').toString();
                const stateObj = JSON.parse(stateDecoded);
                redirectUri = stateObj.redirectUri;
            }
            catch (e) {
                redirectUri = undefined;
            }
        }
        req.redirectUri = redirectUri;
        const { id, emails, displayName, photos } = profile;
        const user = {
            provider: 'GOOGLE',
            providerId: id,
            email: emails[0].value,
            name: displayName,
            avatar: photos[0]?.value,
        };
        done(null, { ...user, redirectUri });
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map
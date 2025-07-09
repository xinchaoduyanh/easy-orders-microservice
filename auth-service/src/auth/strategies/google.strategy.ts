import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import envConfig from '../../../config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: envConfig.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true, // Cho phép truyền req vào validate
    });
    // Xóa log debug
  }

  async validate(
    req: any, // Thêm req vào signature
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    let redirectUri;
    // Xóa log debug
    if (req.query.state) {
      try {
        const stateDecoded = Buffer.from(req.query.state as string, 'base64').toString();
        const stateObj = JSON.parse(stateDecoded);
        redirectUri = stateObj.redirectUri;
      } catch (e) {
        redirectUri = undefined;
      }
    }
    // Lưu redirectUri vào req.user hoặc req.session để callback dùng
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
}

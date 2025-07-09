import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import envConfig from '../../../config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    const config = {
      clientID: envConfig.GITHUB_CLIENT_ID,
      clientSecret: envConfig.GITHUB_CLIENT_SECRET,
      callbackURL: envConfig.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    };
    console.log('GITHUB OAUTH: Strategy config =', config);
    super(config);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    // Log chi tiết để debug callback GitHub
    console.log('GITHUB OAUTH: accessToken =', accessToken);
    console.log('GITHUB OAUTH: refreshToken =', refreshToken);
    console.log('GITHUB OAUTH: profile =', profile);
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
}

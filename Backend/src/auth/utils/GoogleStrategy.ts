import { Injectable, Scope } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID:
        '871502115190-7m1nqt0ntq6fk6g2ljjg52s9pvoe50j2.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: `${process.env.BACK_URL}/api/auth/google/redirect`,
      scope: ['profile', 'email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { emails, photos, name } = profile;
      const user = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        accessToken,
      } as any;

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}

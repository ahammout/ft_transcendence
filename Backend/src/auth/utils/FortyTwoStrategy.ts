import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-42';
import { AuthService } from '../auth.service';
import { UserData } from './auth.types';
@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42school') {
  constructor(private readonly authService: AuthService) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      scopes: ['public'],
      clientID: `${process.env.FORTY_TWO_APP_UID}`,
      clientSecret: `${process.env.FORTY_TWO_APP_SECRET}`,
      callbackURL: `${process.env.BACK_URL}/api/auth/42school/redirect`,
      profileFields: {
        id: (obj) => String(obj.id),
        username: 'login',
        displayName: 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        profileUrl: 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image.link',
      },

      scope: 'public',
    });
  }
  //zid kolha
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): Promise<void> {
    try {
      const { id, displayName, name, profileUrl, emails, photos } = profile;
      const login = displayName; // Use displayName as login

      const user: UserData = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        token: '',
        password: '',
        username: login,
        profileUrl: profileUrl || '',
      };

      const tokens = await this.authService.signInWithFortyTwo(user);
      done(null, user);
    } catch (error) {
      done(new UnauthorizedException('42 School login failed'), null);
    }
  }
}

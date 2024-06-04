import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
type JwtPayload = {
  sub: string;
  email: string;
};

// ziiidd
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies['token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: `${process.env.ACCESS_TOKEN}`,
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}

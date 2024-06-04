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
exports.FortyTwoStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const auth_service_1 = require("../auth.service");
let FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42school') {
    constructor(authService) {
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
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        try {
            const { id, displayName, name, profileUrl, emails, photos } = profile;
            const login = displayName;
            const user = {
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
        }
        catch (error) {
            done(new common_1.UnauthorizedException('42 School login failed'), null);
        }
    }
};
exports.FortyTwoStrategy = FortyTwoStrategy;
exports.FortyTwoStrategy = FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], FortyTwoStrategy);
//# sourceMappingURL=FortyTwoStrategy.js.map
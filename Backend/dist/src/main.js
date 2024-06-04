"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.setGlobalPrefix('api');
    app.use(session({
        secret: `${process.env.SESSION_SECRET}`,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 30 * 60 * 1000,
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(cookieParser());
    app.enableCors({
        origin: `${process.env.FRONT_URL}`,
        credentials: true,
    });
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map
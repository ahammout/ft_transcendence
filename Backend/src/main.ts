import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: `${process.env.SESSION_SECRET}`,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 30 * 60 * 1000,
      },
    }),
  );
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

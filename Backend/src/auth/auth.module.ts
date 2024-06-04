// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { AtStrategy, RtStrategy } from './strategies';
// import {GoogleStrategy} from './utils/GoogleStrategy';
// import { JwtModule } from '@nestjs/jwt';
// import {SessionSerializer} from "./utils/Serialis"

// @Module({
//   imports: [JwtModule.register({})],
//   controllers: [AuthController],
//   providers: [AuthService,AtStrategy,RtStrategy,GoogleStrategy , SessionSerializer],
// })
// export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { AtStrategy, RtStrategy } from './strategies';
// import { GoogleStrategy } from './utils/GoogleStrategy';
// import { JwtModule } from '@nestjs/jwt';
// import { SessionSerializer } from './utils/Serialis';

// @Module({
//   imports: [JwtModule.register({})],
//   controllers: [AuthController],
//   // providers: [AuthService, AtStrategy, RtStrategy, GoogleStrategy, SessionSerializer],
//   providers: [AuthService, AtStrategy, RtStrategy, GoogleStrategy, SessionSerializer],
// })
// export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { AtStrategy, RtStrategy } from './strategies';
// import { GoogleStrategy } from './utils/GoogleStrategy';
// import { JwtModule } from '@nestjs/jwt';
// import { SessionSerializer } from './utils/Serialis';
// import {FortyTwoStrategy} from './utils/FortyTwoStrategy'

// @Module({
//   imports: [JwtModule.register({})],
//   controllers: [AuthController],
//   providers: [AuthService, AtStrategy, FortyTwoStrategy, ,RtStrategy, GoogleStrategy, SessionSerializer],
// })
// export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { AtStrategy, RtStrategy } from './strategies';
// import { GoogleStrategy } from './utils/GoogleStrategy';
// import { JwtModule } from '@nestjs/jwt';
// import { SessionSerializer } from './utils/Serialis';
// import { FortyTwoStrategy } from './utils/FortyTwoStrategy';

// @Module({
//   imports: [JwtModule.register({})],
//   controllers: [AuthController],
//   providers: [AuthService, AtStrategy, FortyTwoStrategy, RtStrategy, GoogleStrategy, SessionSerializer],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategies';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { JwtModule } from '@nestjs/jwt';
import { SessionSerializer } from './utils/Serialis';
import { FortyTwoStrategy } from './utils/FortyTwoStrategy'; // Make sure to import the FortyTwoStrategy
import { ChatModule } from 'src/chat/chat.module';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [JwtModule.register({}), ChatModule],
  controllers: [AuthController],
  providers: [
    ChatService,
    AuthService,
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    FortyTwoStrategy,
    SessionSerializer,
  ], // Add FortyTwoStrategy here
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { myGetWay } from './getway';
import { AuthService } from '../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [myGetWay, AuthService, ChatService],
})
export class GetwayModule {}

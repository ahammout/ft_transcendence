import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MessagesService } from './messages/messages.service';
import { MessagesModule } from './messages/messages.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ChatController],
  providers: [ChatService, MessagesService, AuthService],
  imports: [MessagesModule, JwtModule.register({})],
})
export class ChatModule {}

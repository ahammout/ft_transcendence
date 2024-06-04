import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';

@Module({
  providers: [
    GameService,
    GameGateway,
    MatchHistoryService,
    AuthService,
    JwtService,
    ChatService,
  ],
})
export class GameModule {}

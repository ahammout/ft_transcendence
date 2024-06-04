import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GetwayModule } from './auth/getway/getway.module';
import { GameModule } from './game/game.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    GetwayModule,
    GameModule,
    ChatModule,
    MatchHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

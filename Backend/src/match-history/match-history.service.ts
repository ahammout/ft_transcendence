import { Injectable } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchHistoryService {
  constructor(private readonly prismService: PrismaService) {}

  async getMatchHistory(userId: number) {
    const matchHistory = await this.prismService.game.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return matchHistory;
  }

  async createMatchHistory(roomData: any) {
    const game = await this.prismService.game.create({
      data: {
        player1: roomData.players[0].playerName,
        player2: roomData.players[1].playerName,
        winner: roomData.winner.toString(),
        player1Score: roomData.players[0].score,
        player2Score: roomData.players[1].score,
        users: {
          create: [
            { userId: roomData.players[0].playerId },
            { userId: roomData.players[1].playerId },
          ],
        },
      },
    });
  }
}

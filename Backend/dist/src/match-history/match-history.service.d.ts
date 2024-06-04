import { PrismaService } from 'src/prisma/prisma.service';
export declare class MatchHistoryService {
    private readonly prismService;
    constructor(prismService: PrismaService);
    getMatchHistory(userId: number): Promise<{
        id: string;
        player1: string;
        player2: string;
        player1Score: number;
        player2Score: number;
        winner: string;
        createdAt: Date;
    }[]>;
    createMatchHistory(roomData: any): Promise<void>;
}

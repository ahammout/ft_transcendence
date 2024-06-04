import { MatchHistoryService } from './match-history.service';
import { Request } from 'express';
export declare class MatchHistoryController {
    private readonly matchHistoryService;
    constructor(matchHistoryService: MatchHistoryService);
    getMatchHistory(req: Request): Promise<{
        id: string;
        player1: string;
        player2: string;
        player1Score: number;
        player2Score: number;
        winner: string;
        createdAt: Date;
    }[]>;
    getMatchHistoryById(id: number): Promise<{
        id: string;
        player1: string;
        player2: string;
        player1Score: number;
        player2Score: number;
        winner: string;
        createdAt: Date;
    }[]>;
}

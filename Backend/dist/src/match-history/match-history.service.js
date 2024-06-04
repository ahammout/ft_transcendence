"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchHistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MatchHistoryService = class MatchHistoryService {
    constructor(prismService) {
        this.prismService = prismService;
    }
    async getMatchHistory(userId) {
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
    async createMatchHistory(roomData) {
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
};
exports.MatchHistoryService = MatchHistoryService;
exports.MatchHistoryService = MatchHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchHistoryService);
//# sourceMappingURL=match-history.service.js.map
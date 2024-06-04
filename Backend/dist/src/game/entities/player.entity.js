"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(socketId, playerNo, score, x, y, playerId, playerName, playerImg) {
        this.socketId = socketId;
        this.playerNo = playerNo;
        this.score = score;
        this.x = x;
        this.y = y;
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerImg = playerImg;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.entity.js.map
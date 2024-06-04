"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const crypto_1 = require("crypto");
class Room {
    constructor(ball, winner) {
        this.players = [];
        this.id = (0, crypto_1.randomUUID)();
        this.ball = ball;
        this.winner = winner;
    }
}
exports.Room = Room;
//# sourceMappingURL=room.entity.js.map
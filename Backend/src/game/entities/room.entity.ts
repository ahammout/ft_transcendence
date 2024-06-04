import { randomUUID } from "crypto";
import { Ball } from "./ball.entity";
import { Player } from "./player.entity";

export class Room {
    id: string;
    players: Array<Player> = [];
    ball: Ball;
    winner: number;

    constructor(ball: Ball, winner: number) {
        this.id = randomUUID();
        this.ball = ball;
        this.winner = winner;
    }
}
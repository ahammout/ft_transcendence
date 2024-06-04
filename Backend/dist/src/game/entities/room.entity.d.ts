import { Ball } from "./ball.entity";
import { Player } from "./player.entity";
export declare class Room {
    id: string;
    players: Array<Player>;
    ball: Ball;
    winner: number;
    constructor(ball: Ball, winner: number);
}

export class Player {
  socketId: string;
  playerNo: number;
  score: number;
  x: number;
  y: number;
  playerId: number;
  playerName: string;
  playerImg: string;

  constructor(
    socketId: string,
    playerNo: number,
    score: number,
    x: number,
    y: number,
    playerId: number,
    playerName: string,
    playerImg: string,
  ) {
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

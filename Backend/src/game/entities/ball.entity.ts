export class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    speed: number,
    velocityX: number,
    velocityY: number,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }
}

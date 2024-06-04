import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ namespace: 'game', cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private GameService: GameService) {}
  @WebSocketServer()
  server: Server;
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    this.GameService.joinGame(client, data, this.server);
  }

  @SubscribeMessage('getPlayerNo')
  handleGetPlayerNo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    this.GameService.getPlayerNo(client, this.server);
  }

  @SubscribeMessage('invite')
  handleInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {}

  @SubscribeMessage('move')
  handleMove(@ConnectedSocket() client: Socket, @MessageBody() data: any): any {
    this.GameService.movePaddle(client, data, this.server);
  }

  @SubscribeMessage('leave')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    this.GameService.leaveGame(client, this.server);
  }

  @SubscribeMessage('inviteSent')
  handleInviteSent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    this.GameService.inviteSent(client, data, this.server);
  }

  @SubscribeMessage('inviteAccepted')
  handleInviteAccepted(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    this.GameService.inviteAccepted(client, data, this.server);
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): any {
    this.GameService.addInvited(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket): any {
    this.GameService.removeInvited(client);
    this.GameService.leaveGame(client, this.server);
  }
}

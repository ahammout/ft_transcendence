import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private GameService;
    constructor(GameService: GameService);
    server: Server;
    handleJoin(client: Socket, data: any): any;
    handleGetPlayerNo(client: Socket, data: any): any;
    handleInvite(client: Socket, data: any): any;
    handleMove(client: Socket, data: any): any;
    handleLeave(client: Socket, data: any): any;
    handleInviteSent(client: Socket, data: any): any;
    handleInviteAccepted(client: Socket, data: any): any;
    handleConnection(client: Socket, ...args: any[]): any;
    handleDisconnect(client: Socket): any;
}

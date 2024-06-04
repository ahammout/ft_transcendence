import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth.service';
export declare class myGetWay implements OnGatewayConnection, OnGatewayDisconnect {
    private authService;
    server: Server;
    constructor(authService: AuthService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    onNewMessage(body: any): void;
    join(body: any, client: Socket): void;
    ingame(client: Socket): Promise<void>;
    outgame(client: Socket): Promise<void>;
}

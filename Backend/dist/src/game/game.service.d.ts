import { Server, Socket } from 'socket.io';
import { Room } from './entities/room.entity';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { AuthService } from 'src/auth/auth.service';
declare class invited {
    id: number;
    socketId: string;
}
export declare class GameService {
    private readonly matchHistoryService;
    private readonly authService;
    constructor(matchHistoryService: MatchHistoryService, authService: AuthService);
    rooms: Array<Room>;
    invitedList: Array<invited>;
    addInvited(client: Socket): Promise<void>;
    removeInvited(client: Socket): Promise<void>;
    inviteSent(client: Socket, data: any, server: Server): void;
    inviteAccepted(client: Socket, data: any, server: Server): void;
    getPlayerNo(client: Socket, server: Server): void;
    joinGame(client: Socket, data: any, server: Server): void;
    movePaddle(client: Socket, data: any, server: Server): void;
    leaveGame(client: Socket, server: Server): void;
}
export {};

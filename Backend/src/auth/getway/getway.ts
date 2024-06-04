import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth.service';
import { Inject, forwardRef } from '@nestjs/common';

interface Pair {
  id: number;
  socketsId: string[];
}

const arrayOfPairs: Pair[] = [];

@WebSocketGateway({ namespace: 'users', cors: true })
export class myGetWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const cookies = client.handshake.headers.cookie;
    if (!cookies) {
      return;
    }
    const userId = await this.authService.getUserId(cookies);
    if (!userId) {
      return;
    }
    const foundPair = arrayOfPairs.find((pair) => pair.id === userId);
    const foundIndex = arrayOfPairs.findIndex((pair) => pair.id === userId);

    if (foundPair) {
      foundPair.socketsId.push(client.id);
      arrayOfPairs.splice(foundIndex, 1, foundPair);
    } else {
      const newPair: Pair = { id: userId, socketsId: [] };
      newPair.socketsId.push(client.id);
      arrayOfPairs.push(newPair);
    }

    const addOnline = this.authService.addOnline(userId);
    this.server.emit('user_connected', { userId: userId });
    if (!addOnline) {
      return;
    }
  }
  async handleDisconnect(client: Socket) {
    const cookies = client.handshake.headers.cookie;
    if (!cookies) {
      return;
    }
    const userId = await this.authService.getUserId(cookies);
    if (!userId) {
      return;
    }
    const foundPair = arrayOfPairs.find((pair) => pair.id === userId);
    const foundIndex = arrayOfPairs.findIndex((pair) => pair.id === userId);
    if (foundPair) {
      const foundSocketIndex = foundPair.socketsId.findIndex(
        (socketId) => socketId === client.id,
      );
      if (foundSocketIndex !== -1) {
        foundPair.socketsId.splice(foundSocketIndex, 1);
        if (foundPair.socketsId.length === 0) {
          arrayOfPairs.splice(foundIndex, 1);
          const offlineupdate = this.authService.addOffline(userId);
          this.server.emit('user_disconnected', { userId: userId });
          if (!offlineupdate) {
            return;
          }
        } else {
          arrayOfPairs.splice(foundIndex, 1, foundPair);
        }
      }
    }
  }

  @SubscribeMessage('notification')
  onNewMessage(@MessageBody() body: any) {
    this.server.to(body.friendId).emit('notification', body);
    this.authService.addFriendRequest(body.userId, body.friendId);
    this.authService.addNotification(body.friendId, body.message);
  }

  @SubscribeMessage('join')
  join(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    client.join(body.id);
  }

  /* orakib */

  @SubscribeMessage('ingame')
  async ingame(@ConnectedSocket() client: Socket) {
    const cookies = client.handshake.headers.cookie;
    if (!cookies) {
      return;
    }
    const userId = await this.authService.getUserId(cookies);
    if (!userId) {
      return;
    }

    const addInGame = this.authService.addInGame(userId);
    this.server.emit('user_ingame', { userId: userId });

    if (!addInGame) {
      return;
    }
  }

  @SubscribeMessage('outgame')
  async outgame(@ConnectedSocket() client: Socket) {
    const cookies = client.handshake.headers.cookie;
    if (!cookies) {
      return;
    }
    const userId = await this.authService.getUserId(cookies);
    if (!userId) {
      return;
    }

    const addOutGame = this.authService.addOutGame(userId);
    this.server.emit('user_outgame', { userId: userId });
    if (!addOutGame) {
      return;
    }
  }

  /* orakib */
}

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Body } from '@nestjs/common';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io'

type KickBody = {
  channelId: string,
  memberId: number,
}

@WebSocketGateway({ namespace: 'chat', cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const postMessage = await this.messagesService.create(createMessageDto);
    this.server.to(createMessageDto.channelId).emit(`message/${postMessage.channelId}`, postMessage);
    return (postMessage);
  }

  // channelId: Channel.id, memberId: memberId
  // @SubscribeMessage('kick')
  // async kick(body: KickBody) {
  //   // const postMessage = await this.messagesService.kick(createMessageDto);
  //   console.log("Calling for a kick", body);
  //   this.server.to(body.channelId).emit(`kick/${body.memberId}`, "You're kicked");
  // }

  @SubscribeMessage('join')
  joinRoom(
    client: Socket,
    channelId: string,
    ) {
      client.join(channelId);
  }
}
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

// import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(@Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  // This function it's about creating a new message.
  async create(createMessageDto: CreateMessageDto) {
    // Check If the channel It's exist or not before creating the message

    const created = await this.prisma.messages.create({
      data: {
        content: createMessageDto.text,
        channel: {
          connect: {
            id: createMessageDto.channelId,
          },
        },
        sender: {
          connect: {
            id: createMessageDto.userId,
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        sender: true,
        channel: true,  
        senderId: true,
        channelId: true,
        content: true,
      }
    })
    return created;
  }
 
}
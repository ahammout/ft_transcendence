import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMessageDto: CreateMessageDto): Promise<{
        id: string;
        createdAt: Date;
        senderId: number;
        channelId: string;
        content: string;
        sender: {
            id: number;
            nickname: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            hashedRt: string;
            avatar: string;
            password: string;
            updateState: boolean;
            state: import(".prisma/client").$Enums.State;
            faState: boolean;
            twoFactorEnabled: boolean;
            is2FAuthenticated: boolean;
            twoFactorSecret: string;
            wins: number;
            loses: number;
        };
        channel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            avatar: string;
            password: string;
            subject: string;
            type: import(".prisma/client").$Enums.Type;
        };
    }>;
}

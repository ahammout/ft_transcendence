import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
interface JoinDto {
    name: string;
    type: string;
    password: string;
}
export default JoinDto;
export declare class ChatService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    findOne(id: string, user: any, blockList: any): Promise<{
        status: string;
        data: {
            members: ({
                member: {
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
            } & {
                id: string;
                channelId: string;
                memberId: number;
                role: import(".prisma/client").$Enums.Role;
                ban: boolean;
                status: boolean;
            })[];
            Messages: ({
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
            } & {
                id: string;
                createdAt: Date;
                senderId: number;
                channelId: string;
                content: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            avatar: string;
            password: string;
            subject: string;
            type: import(".prisma/client").$Enums.Type;
        };
    } | {
        status: string;
        data: string;
    }>;
    createDirectChannel(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        avatar: string;
        password: string;
        subject: string;
        type: import(".prisma/client").$Enums.Type;
    }>;
    createChannel(createChannelDto: any, Owner: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        avatar: string;
        password: string;
        subject: string;
        type: import(".prisma/client").$Enums.Type;
    } | "failed">;
    create(createChannelDto: Prisma.ChannelsCreateInput, user: Prisma.UserCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        avatar: string;
        password: string;
        subject: string;
        type: import(".prisma/client").$Enums.Type;
    } | "failed" | "duplicated">;
    inviteFriend(Body: any): Promise<{
        status: string;
        UpdatedChannel: string;
    } | {
        status: string;
        UpdatedChannel: {
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
    join(joinDto: JoinDto, user: any): Promise<"duplicated" | {
        status: string;
        UpdatedChannel: string;
    } | {
        status: string;
        UpdatedChannel: {
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
    leave(id: string, user: any): Promise<{
        status: string;
        leaveStatus: string;
    }>;
    findAll(user: any): Promise<"error" | ({
        members: ({
            member: {
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
        } & {
            id: string;
            channelId: string;
            memberId: number;
            role: import(".prisma/client").$Enums.Role;
            ban: boolean;
            status: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        avatar: string;
        password: string;
        subject: string;
        type: import(".prisma/client").$Enums.Type;
    })[]>;
    getMember(id: string, user: any): Promise<any>;
    getChannelMembers(id: string): Promise<{
        status: string;
        data: any;
    }>;
    updateChannelName(id: string, newName: string): Promise<{
        status: string;
        UpdatedChannel: string;
    } | {
        status: string;
        UpdatedChannel: {
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
    UpdateChannelAvatar(id: string, newAvatar: string): Promise<{
        status: string;
        updated: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            avatar: string;
            password: string;
            subject: string;
            type: import(".prisma/client").$Enums.Type;
        };
    } | {
        status: string;
        updated: string;
    }>;
    update(id: string, updateChannelDto: Prisma.ChannelsUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        avatar: string;
        password: string;
        subject: string;
        type: import(".prisma/client").$Enums.Type;
    }>;
    setAdmin(body: any): Promise<Prisma.BatchPayload>;
    unsetAdmin(body: any): Promise<Prisma.BatchPayload>;
    kickMember(body: any): Promise<Prisma.BatchPayload>;
    banMember(body: any): Promise<Prisma.BatchPayload>;
    unbanMember(body: any): Promise<Prisma.BatchPayload>;
    muteMember(body: any): Promise<{
        id: string;
        channelId: string;
        memberId: string;
        muteDate: Date;
        duration: number;
    }>;
    unmuteMember(body: any): Promise<Prisma.BatchPayload>;
    removeAll(): Promise<Prisma.BatchPayload>;
    remove(id: string, userId: number): Promise<{
        status: string;
        removed: string;
        updated?: undefined;
    } | {
        status: string;
        removed: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            avatar: string;
            password: string;
            subject: string;
            type: import(".prisma/client").$Enums.Type;
        };
        updated?: undefined;
    } | {
        status: string;
        updated: string;
        removed?: undefined;
    }>;
    RemoveChat(id: string): Promise<{
        status: string;
        removed: string;
        updated?: undefined;
    } | {
        status: string;
        removed: Prisma.BatchPayload;
        updated?: undefined;
    } | {
        status: string;
        updated: string;
        removed?: undefined;
    }>;
}

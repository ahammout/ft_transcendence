"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("@nestjs/jwt/dist/jwt.service");
const bcrypt = require("bcrypt");
const console_1 = require("console");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async findOne(id, user, blockList) {
        const channel = await this.prisma.channels.findUnique({ where: { id, }, include: { members: { include: { member: true } }, Messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } } } });
        if (!channel)
            return ({ status: "404", data: channel });
        const member = await this.prisma.membership.findFirst({
            where: {
                memberId: user.id,
                channelId: id,
            },
            include: { member: true },
        });
        if (!member) {
            return ({ status: "500", data: 'Not a member' });
        }
        if (member.ban === true) {
            return ({ status: "404", data: 'baned' });
        }
        const msgs = channel.Messages?.filter((msg) => !blockList?.data?.includes(msg?.senderId));
        return ({ status: "101", data: { ...channel, Messages: msgs } });
    }
    async createDirectChannel(body) {
        const randomOne = body.memberOne.toString();
        const randomTwo = body.memberTwo.toString();
        const directName = `${randomOne}_${randomTwo}`;
        console.log(directName);
        const channel = await this.prisma.channels.findUnique({
            where: {
                name: directName,
                type: "DIRECT",
            },
        });
        if (!channel) {
            const newChannel = await this.prisma.channels.create({
                data: {
                    name: directName,
                    type: "DIRECT",
                    members: {
                        create: [
                            {
                                role: "OWNER",
                                ban: false,
                                status: true,
                                member: {
                                    connect: {
                                        id: body.memberOne,
                                    },
                                },
                            },
                            {
                                role: "BASIC",
                                ban: false,
                                status: true,
                                member: {
                                    connect: {
                                        id: body.memberTwo,
                                    },
                                },
                            }
                        ]
                    }
                }
            });
            return (newChannel);
        }
    }
    async createChannel(createChannelDto, Owner) {
        try {
            const newChannel = await this.prisma.channels.create({
                data: {
                    ...createChannelDto,
                    password: await bcrypt.hash(createChannelDto.password, 10),
                    members: {
                        create: {
                            role: "OWNER",
                            ban: false,
                            status: true,
                            member: {
                                connect: {
                                    id: Owner.id,
                                },
                            },
                        }
                    }
                }
            });
            return (newChannel);
        }
        catch (e) {
            return ("failed");
        }
    }
    async create(createChannelDto, user) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                name: createChannelDto.name,
            },
        });
        try {
            if (channel)
                throw new Error('Channel already exist');
            const newChannel = await this.createChannel(createChannelDto, user);
            return (newChannel);
        }
        catch (e) {
            return ("duplicated");
        }
    }
    async inviteFriend(Body) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                id: Body.channelId,
            },
        });
        if (channel) {
            const membership = await this.prisma.membership.findMany({
                where: {
                    channelId: channel.id,
                    memberId: Body.friendId,
                },
                include: { channel: true },
            });
            if (membership.length >= 1) {
                return ({ status: "404", UpdatedChannel: "Member Already exist" });
            }
            const UpdatedChannel = await this.prisma.channels.update({
                where: { id: channel.id },
                data: {
                    members: {
                        create: {
                            role: "BASIC",
                            ban: false,
                            status: false,
                            member: {
                                connect: {
                                    id: Body.friendId,
                                },
                            },
                        },
                    }
                },
            });
            return ({ status: '101', UpdatedChannel: UpdatedChannel });
        }
    }
    async join(joinDto, user) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                name: joinDto.name,
            },
        });
        try {
            if (!channel)
                return ({ status: '404', UpdatedChannel: "Channel not found" });
            const membership = await this.prisma.membership.findMany({
                where: {
                    channelId: channel.id,
                    memberId: user.id,
                },
                include: { channel: true },
            });
            if ((!membership.length) && (channel.type === "PRIVATE")) {
                return ({ status: '404', UpdatedChannel: "You're not invited to this channel" });
            }
            if ((membership.length === 1) && (!membership[0].status) && (channel.type === "PRIVATE")) {
                if ((joinDto.type !== "PRIVATE")) {
                    return ({ status: '404', UpdatedChannel: "This channel it's private" });
                }
                await this.prisma.membership.updateMany({
                    where: {
                        channelId: channel.id,
                        memberId: user.id,
                    },
                    data: {
                        status: true
                    },
                });
                return ({ status: '101', UpdatedChannel: channel });
            }
            if (membership.length)
                return ({ status: '404', UpdatedChannel: "you're already member on this channel" });
            if (channel.type === "PUBLIC") {
                if ((joinDto.type !== "PUBLIC")) {
                    return ({ status: '404', UpdatedChannel: "This channel it's public" });
                }
                const UpdatedChannel = await this.prisma.channels.update({
                    where: { id: channel.id },
                    data: {
                        members: {
                            create: {
                                role: "BASIC",
                                ban: false,
                                status: true,
                                member: {
                                    connect: {
                                        id: user.id,
                                    },
                                },
                            },
                        }
                    },
                });
                return ({ status: '101', UpdatedChannel: UpdatedChannel });
            }
            else if (channel.type === "PROTECTED") {
                if (!(joinDto.type === "PROTECTED"))
                    return ({ status: '404', UpdatedChannel: "This Channel it's protected by a password" });
                if (!bcrypt.compareSync(joinDto.password, channel.password))
                    return ({ status: '404', UpdatedChannel: "Password not matched" });
                const UpdatedChannel = await this.prisma.channels.update({
                    where: { id: channel.id },
                    data: {
                        members: {
                            create: {
                                role: "BASIC",
                                ban: false,
                                status: true,
                                member: {
                                    connect: {
                                        id: user.id,
                                    },
                                },
                            },
                        }
                    },
                });
                return ({ status: '101', UpdatedChannel: UpdatedChannel });
            }
            else {
                return ({ status: '404', UpdatedChannel: "unexpected error happened" });
            }
        }
        catch (e) {
            return ("duplicated");
        }
    }
    async leave(id, user) {
        try {
            const member = await this.prisma.membership.findFirst({
                where: {
                    memberId: user.id,
                    channelId: id,
                },
                include: { member: true },
            });
            if (member.role === 'OWNER') {
                this.remove(id, user.id);
            }
            await this.prisma.membership.deleteMany({ where: { channelId: id, memberId: user.id }, });
            return ({ status: '101', leaveStatus: "Leaved The channel" });
        }
        catch (e) {
            return ({ status: '404', leaveStatus: "Unexpected error happened" });
        }
    }
    async findAll(user) {
        try {
            const membership = await this.prisma.membership.findMany({
                where: { memberId: user.id },
                include: { channel: { include: { members: { include: { member: true } } } } },
            });
            const AllChannels = membership.filter(membership => (membership.status === true && membership.ban === false)).map(membership => membership.channel);
            if (AllChannels)
                return (AllChannels);
            else
                throw new console_1.error;
        }
        catch (exp) {
            return ("error");
        }
    }
    async getMember(id, user) {
        try {
            const member = await this.prisma.membership.findFirst({
                where: {
                    channelId: id,
                    memberId: user.id,
                },
                include: {
                    mute: true,
                }
            });
            if (!member) {
                return ("404");
            }
            return (member);
        }
        catch (error) {
            return (error);
        }
    }
    async getChannelMembers(id) {
        try {
            const members = await this.prisma.membership.findMany({
                where: {
                    channelId: id,
                },
                include: {
                    member: true,
                    mute: true,
                }
            });
            return ({ status: "101", data: members });
        }
        catch (error) {
            return ({ status: "404", data: error });
        }
    }
    async updateChannelName(id, newName) {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    name: newName,
                },
            });
            if (channel) {
                return ({ status: '404', UpdatedChannel: "duplicated" });
            }
            const updated = await this.prisma.channels.update({
                where: {
                    id,
                },
                data: {
                    name: newName,
                },
            });
            return ({ status: '101', UpdatedChannel: updated });
        }
        catch (erorr) {
            return ({ status: '404', UpdatedChannel: "Unexpected error happened" });
        }
    }
    async UpdateChannelAvatar(id, newAvatar) {
        try {
            const updated = await this.prisma.channels.update({
                where: {
                    id,
                },
                data: {
                    avatar: newAvatar,
                },
            });
            return ({ status: '101', updated: updated });
        }
        catch (erorr) {
            return ({ status: '404', updated: "Unexpected error happened" });
        }
    }
    async update(id, updateChannelDto) {
        return this.prisma.channels.update({
            where: {
                id,
            },
            data: updateChannelDto,
        });
    }
    async setAdmin(body) {
        const newMembership = await this.prisma.membership.updateMany({
            where: {
                channelId: body.channelId,
                memberId: body.memberId,
            },
            data: {
                role: "ADMIN",
            },
        });
        return (newMembership);
    }
    async unsetAdmin(body) {
        const newMembership = await this.prisma.membership.updateMany({
            where: {
                channelId: body.channelId,
                memberId: body.memberId,
            },
            data: {
                role: "BASIC",
            },
        });
        return (newMembership);
    }
    async kickMember(body) {
        const kicked = await this.prisma.membership.deleteMany({ where: { channelId: body.channelId, memberId: body.memberId },
        });
        return (kicked);
    }
    async banMember(body) {
        const newMembership = await this.prisma.membership.updateMany({
            where: {
                channelId: body.channelId,
                memberId: body.memberId,
            },
            data: {
                ban: true,
            },
        });
        return (newMembership);
    }
    async unbanMember(body) {
        const newMembership = await this.prisma.membership.updateMany({
            where: {
                channelId: body.channelId,
                memberId: body.memberId,
            },
            data: {
                ban: false,
            },
        });
        return (newMembership);
    }
    async muteMember(body) {
        const member = await this.prisma.membership.findFirst({
            where: {
                channelId: body.channelId,
                memberId: body.memberId,
            },
        });
        const checkMute = await this.prisma.mute.findFirst({
            where: {
                channelId: body.channelId,
                memberId: member.id,
            },
        });
        if (checkMute) {
            const newMuted = await this.prisma.mute.update({
                where: {
                    channelId: body.channelId,
                    memberId: member.id,
                },
                data: {
                    duration: parseInt(body.duration, 10),
                },
            });
            return (newMuted);
        }
        const newMuted = await this.prisma.mute.create({
            data: {
                channel: {
                    connect: {
                        id: body.channelId,
                    }
                },
                member: {
                    connect: {
                        id: member.id,
                    },
                },
                duration: parseInt(body.duration, 10),
            },
        });
        return (newMuted);
    }
    async unmuteMember(body) {
        const member = await this.prisma.membership.findFirst({
            where: {
                channelId: body.channelId,
                memberId: body.memberId,
            },
        });
        const Unmuted = await this.prisma.mute.deleteMany({
            where: {
                channelId: body.channelId,
                memberId: member.id,
            },
        });
        return (Unmuted);
    }
    async removeAll() {
        return (this.prisma.channels.deleteMany({}));
    }
    async remove(id, userId) {
        try {
            const Channel = await this.prisma.channels.findUnique({ where: { id, }, include: { members: true, Messages: true } });
            if (!Channel) {
                return ({ status: '404', removed: "Channel not found" });
            }
            const member = await this.prisma.membership.findFirst({
                where: {
                    memberId: userId,
                    channelId: Channel.id,
                },
                include: { member: true },
            });
            if (member.role === 'OWNER') {
                await this.prisma.mute.deleteMany({ where: { channelId: Channel.id } });
                await this.prisma.messages.deleteMany({ where: { channelId: Channel.id } });
                await this.prisma.membership.deleteMany({ where: { channelId: Channel.id }, });
                const removed = await this.prisma.channels.delete({
                    where: {
                        id: id,
                    },
                });
                return ({ status: '101', removed: removed });
            }
        }
        catch (e) {
            return ({ status: '404', updated: "Unexpected error happened" });
        }
    }
    async RemoveChat(id) {
        try {
            const Channel = await this.prisma.channels.findUnique({ where: { id, }, include: { members: true, Messages: true } });
            if (!Channel) {
                return ({ status: '404', removed: "Channel not found" });
            }
            const removed = await this.prisma.messages.deleteMany({ where: { channelId: Channel.id } });
            return ({ status: '101', removed: removed });
        }
        catch (e) {
            return ({ status: '404', updated: "Unexpected error happened" });
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => prisma_service_1.PrismaService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => jwt_service_1.JwtService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_service_1.JwtService])
], ChatService);
//# sourceMappingURL=chat.service.js.map
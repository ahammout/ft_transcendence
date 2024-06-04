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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const argon = require("argon2");
const otplib_1 = require("otplib");
const chat_service_1 = require("../chat/chat.service");
const otplib = require("otplib");
let AuthService = class AuthService {
    constructor(prisma, chatService, jwtService) {
        this.prisma = prisma;
        this.chatService = chatService;
        this.jwtService = jwtService;
    }
    async enableTwoFactorAuth(nickname) {
        const secret = otplib.authenticator.generateSecret();
        await this.saveSecretKey(nickname, secret);
        const otpauthURL = otplib.authenticator.keyuri(nickname, 'pingpongGmae', secret);
        return otpauthURL;
    }
    async saveSecretKey(nickname, secretKey) {
        await this.prisma.user.update({
            where: { nickname: nickname },
            data: { twoFactorSecret: secretKey },
        });
    }
    async removeSecretKey(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: null, twoFactorEnabled: false },
        });
    }
    async toggle2FAStatus(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return null;
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                faState: !user.faState,
            },
        });
        return updatedUser;
    }
    async verifyTOTPCode(user, totpCode) {
        const secretKey = user.twoFactorSecret;
        const isCodeValid = otplib_1.authenticator.verify({
            token: totpCode,
            secret: secretKey,
        });
        if (!isCodeValid) {
            return null;
        }
        user.twoFactorEnabled = true;
        const upadate = await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                twoFactorEnabled: true,
                is2FAuthenticated: true,
            },
        });
        return upadate;
    }
    async disableTwoFactorAuth(userId) {
        await this.removeSecretKey(userId);
    }
    async set2FaTrue(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return null;
        }
        const upadate = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                is2FAuthenticated: true,
            },
        });
        return upadate;
    }
    async set2FaFalse(userId) {
        const upadate = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                is2FAuthenticated: false,
            },
        });
        return upadate;
    }
    async getBlockList(userId) {
        try {
            const blockList = await this.prisma.frinds.findMany({
                where: {
                    OR: [{ userId: userId }, { friendId: userId }],
                    status: 'BLOCKED',
                },
                select: {
                    userId: true,
                    friendId: true,
                },
            });
            const rt = blockList.map((item) => item.userId == userId ? item.friendId : item.userId);
            if (!blockList)
                return { status: '404', data: 'There no block list' };
            return { status: '101', data: rt };
        }
        catch (error) { }
    }
    async getAllFriends(userId) {
        try {
            const friends = await this.prisma.frinds.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    friend: true,
                    user: true,
                },
            });
            return friends;
        }
        catch (error) { }
    }
    async getAllFriendsById(friendId) {
        try {
            const friends = await this.prisma.frinds.findMany({
                where: {
                    userId: friendId,
                },
                include: {
                    friend: true,
                    user: true,
                },
            });
            return friends;
        }
        catch (error) { }
    }
    async getAllFrienfImSendRequest(userId, frienId) {
        try {
            const friends = await this.prisma.frinds.findMany({
                where: {
                    friendId: userId,
                    status: 'PENDING',
                },
                include: {
                    friend: true,
                    user: true,
                },
            });
            let status = false;
            if (friends) {
                friends.map((item) => {
                    if (item.userId === frienId) {
                        status = true;
                    }
                });
            }
            return { status: status };
        }
        catch (error) { }
    }
    async getAllFriendsBolckedMe(userId, frienId) {
        try {
            const friends = await this.prisma.frinds.findMany({
                where: {
                    friendId: userId,
                    status: 'BLOCKED',
                },
                include: {
                    friend: true,
                    user: true,
                },
            });
            let status = false;
            if (friends) {
                friends.map((item) => {
                    if (item.userId === frienId) {
                        status = true;
                    }
                });
            }
            return { status: status };
        }
        catch (error) { }
    }
    async getAllAcceptedFriends(userId) {
        try {
            const friends = await this.prisma.frinds.findMany({
                where: {
                    userId: userId,
                    status: 'ACCEPTED',
                },
                include: {
                    friend: true,
                    user: true,
                },
            });
            return friends;
        }
        catch (error) {
            throw new Error('Failed to get friends');
        }
    }
    async addFriendRequest(userId, friendId) {
        try {
            const frindship = await this.prisma.frinds.findFirst({
                where: {
                    userId: friendId,
                    friendId: userId,
                },
            });
            if (frindship) {
                return { status: '404', error: 'friend request already sent' };
            }
            await this.prisma.frinds.create({
                data: {
                    userId: friendId,
                    friendId: userId,
                    status: 'PENDING',
                    block: false,
                },
            });
        }
        catch (error) {
            throw new Error('Failed to add friend request');
        }
    }
    async cancelFriendRequest(userId, friendId) {
        try {
            await this.prisma.frinds.deleteMany({
                where: {
                    userId: userId,
                    friendId: friendId,
                },
            });
        }
        catch (error) {
            throw new Error('Failed to cancel friend request');
        }
    }
    async acceptFriendRequest(userId, friendId) {
        try {
            await this.prisma.frinds.updateMany({
                where: {
                    userId: userId,
                    friendId: friendId,
                },
                data: {
                    status: 'ACCEPTED',
                },
            });
            await this.prisma.frinds.create({
                data: {
                    userId: friendId,
                    friendId: userId,
                    status: 'ACCEPTED',
                    block: false,
                },
            });
            this.chatService.createDirectChannel({
                memberOne: userId,
                memberTwo: friendId,
            });
        }
        catch (error) {
            throw new Error('Failed to accept friend request');
        }
    }
    async blockUser(userId, friendId) {
        try {
            await this.prisma.frinds.updateMany({
                where: {
                    userId: userId,
                    friendId: friendId,
                },
                data: {
                    block: true,
                    status: 'BLOCKED',
                },
            });
            await this.prisma.frinds.deleteMany({
                where: {
                    userId: friendId,
                    friendId: userId,
                },
            });
        }
        catch (error) { }
    }
    async unblockUser(userId, friendId) {
        try {
            await this.prisma.frinds.updateMany({
                where: {
                    userId: userId,
                    friendId: friendId,
                },
                data: {
                    block: false,
                    status: 'ACCEPTED',
                },
            });
            await this.prisma.frinds.create({
                data: {
                    userId: friendId,
                    friendId: userId,
                    status: 'ACCEPTED',
                    block: false,
                },
            });
        }
        catch (error) {
            throw new Error('Failed to unblock user');
        }
    }
    async signInWithFortyTwo(user) {
        try {
            if (!user || !user.email) {
                throw new Error('Invalid user data');
            }
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    email: user.email,
                },
            });
            if (existingUser) {
                const tokens = await this.getTokens(existingUser.id, existingUser.email);
                await this.updateRtHash(existingUser.id, tokens.refresh_token);
                return tokens;
            }
            const hashedPassword = user.password
                ? await argon.hash(user.password)
                : '';
            const newUser = await this.prisma.user.create({
                data: {
                    email: user.email,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    nickname: '42school_user',
                    avatar: user.picture,
                    password: hashedPassword,
                },
            });
            const tokens = await this.getTokens(newUser.id, newUser.email);
            await this.updateRtHash(newUser.id, tokens.refresh_token);
            return tokens;
        }
        catch (error) {
            throw new common_2.UnauthorizedException('42 School login failed');
        }
    }
    async search(query) {
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    { nickname: { startsWith: query, mode: 'insensitive' } },
                    { firstName: { startsWith: query, mode: 'insensitive' } },
                    { lastName: { startsWith: query, mode: 'insensitive' } },
                ],
            },
        });
        return users;
    }
    async signInWithGoogle(user) {
        try {
            if (!user || !user.email) {
                throw new Error('Invalid user data');
            }
            const passwordToHash = user.password || 'defaultPassword';
            const hashedPassword = await argon.hash(passwordToHash);
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    email: user.email,
                },
            });
            if (existingUser) {
                const tokens = await this.getTokens(existingUser.id, existingUser.email);
                await this.updateRtHash(existingUser.id, tokens.refresh_token);
                return tokens;
            }
            const newUser = await this.prisma.user.create({
                data: {
                    email: user.email,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    nickname: 'google_user',
                    avatar: user.picture,
                    password: hashedPassword,
                },
            });
            const tokens = await this.getTokens(newUser.id, newUser.email);
            await this.updateRtHash(newUser.id, tokens.refresh_token);
            return tokens;
        }
        catch (error) {
            throw new common_2.UnauthorizedException('Google login failed');
        }
    }
    async singinLocal(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            return null;
        }
        const passwordMatches = await argon.verify(user.password, dto.password);
        if (!passwordMatches)
            return null;
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }
    async refresh(userId, rt) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('Acces Denied');
        const rtMatches = await argon.verify(user.hashedRt, rt);
        if (!rtMatches)
            throw new common_1.ForbiddenException('Acces Denied');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }
    async updateRtHash(userId, rt) {
        const hash = await argon.hash(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash,
            },
        });
    }
    async getTokens(userId, email) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: `${process.env.ACCESS_TOKEN}`,
                expiresIn: '2 days',
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: `${process.env.REFRESH_TOKEN}`,
                expiresIn: 60 * 60 * 24 * 7,
            }),
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        };
    }
    async singupLocal(dto) {
        if (dto.password !== dto.confirmPassword) {
            throw new Error('Password and Confirm Password do not match');
        }
        const hash = await argon.hash(dto.password);
        const nickname = this.generateNickname(dto.email);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                password: hash,
                nickname: nickname,
                avatar: 'https://res.cloudinary.com/dgmc7qcmk/image/upload/v1711300778/my-uploads/g1wk4cah5oemzb5zwjyj.png',
            },
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }
    async findUser(id) {
        try {
            if (id === undefined || id === null) {
                throw new Error('Invalid user ID');
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    generateNickname(email) {
        const username = email.split('@')[0];
        const randomNumber = Math.floor(Math.random() * 1000);
        const nickname = `${username}_${randomNumber}`;
        return nickname;
    }
    async editProfile(userId, data) {
        try {
            const updateData = {};
            if (data.firstName !== undefined) {
                updateData.firstName = data.firstName;
            }
            if (data.lastName !== undefined) {
                updateData.lastName = data.lastName;
            }
            if (data.nickname !== undefined) {
                updateData.nickname = data.nickname;
                const user = await this.prisma.user.findUnique({
                    where: {
                        nickname: data.nickname,
                    },
                });
                if (user) {
                    return null;
                }
            }
            if (data.newPassword !== undefined) {
                updateData.password = await argon.hash(data.newPassword);
            }
            if (data.nickname !== undefined) {
                const user = await this.prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                });
                await this.prisma.game.updateMany({
                    where: {
                        player1: user.nickname,
                    },
                    data: {
                        player1: data.nickname,
                    },
                });
                await this.prisma.game.updateMany({
                    where: {
                        player2: user.nickname,
                    },
                    data: {
                        player2: data.nickname,
                    },
                });
            }
            const user = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: updateData,
            });
            return user;
        }
        catch (error) {
            throw new Error('Failed to edit profile');
        }
    }
    async editUpdate(userId, data) {
        const password = await argon.hash(data.newPassword);
        const user = await this.prisma.user.findUnique({
            where: {
                nickname: data.nickname,
            },
        });
        if (user) {
            return null;
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                nickname: data.nickname,
                password,
                updateState: true,
            },
        });
        return updatedUser;
    }
    async editavatar(email, photoPath) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (photoPath === null || photoPath === '') {
            photoPath =
                'https://res.cloudinary.com/dgmc7qcmk/image/upload/v1711300778/my-uploads/g1wk4cah5oemzb5zwjyj.png';
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                email,
            },
            data: {
                avatar: photoPath,
            },
        });
        return updatedUser;
    }
    findUserByEmail(email) {
        const user = this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    }
    findUserByNickname(nickname) {
        const user = this.prisma.user.findUnique({
            where: {
                nickname,
            },
        });
        if (!user)
            return null;
        return user;
    }
    async findOneFriend(body) {
        const friend = await this.prisma.frinds.findFirst({
            where: {
                userId: body.userId,
                friendId: body.friendId,
            },
        });
        if (friend) {
            if (friend.status === 'ACCEPTED') {
                return { status: 'friend' };
            }
            if (friend.status === 'PENDING') {
                return { status: 'pending' };
            }
            if (friend.status === 'BLOCKED') {
                return { status: 'blocked' };
            }
        }
        return { status: 'notFriend' };
    }
    async addNotification(friendId, message) {
        try {
            await this.prisma.notification.create({
                data: {
                    owner: {
                        connect: {
                            id: friendId,
                        },
                    },
                    message: message,
                    read: false,
                },
            });
        }
        catch (error) { }
    }
    async getNotifications(userId) {
        try {
            const notifications = await this.prisma.notification.findMany({
                where: {
                    ownerId: userId,
                },
                orderBy: { createdAt: 'desc' },
            });
            await this.prisma.notification.updateMany({
                where: {
                    ownerId: userId,
                },
                data: {
                    read: true,
                },
            });
            return notifications;
        }
        catch (error) { }
    }
    async getNotificationByread(userId) {
        try {
            const notifications = await this.prisma.notification.findMany({
                where: {
                    ownerId: userId,
                },
            });
            return notifications;
        }
        catch (error) { }
    }
    async addInGame(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return;
        }
        try {
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    state: 'ONGAME',
                },
            });
        }
        catch (error) {
            throw new Error('Failed to add in game');
        }
    }
    async addOutGame(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return;
        }
        try {
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    state: 'ONLINE',
                },
            });
        }
        catch (error) {
            throw new Error('Failed to add out game');
        }
    }
    async addOnlineFromGame(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return;
        }
        try {
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    state: 'ONLINE',
                },
            });
        }
        catch (error) {
        }
    }
    async addOnline(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return;
        }
        if (user.state === 'ONGAME') {
            return;
        }
        try {
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    state: 'ONLINE',
                },
            });
        }
        catch (error) {
        }
    }
    async addOffline(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return;
        }
        if (user.state === 'ONGAME') {
            return;
        }
        try {
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    state: 'OFFLINE',
                },
            });
        }
        catch (error) {
            throw new Error('Failed to add offline');
        }
    }
    async getUserId(cookies) {
        try {
            const cookiePairs = cookies.split('; ');
            const tokenPair = cookiePairs.find((pair) => pair.startsWith('token='));
            if (!tokenPair) {
                return null;
            }
            const token = tokenPair.split('=')[1];
            const decoded = this.jwtService.decode(token);
            return decoded.sub;
        }
        catch (error) {
        }
    }
    async getIdBytoken(token) {
        const decoded = this.jwtService.decode(token);
        if (!decoded) {
            return null;
        }
        return decoded.sub;
    }
    async addWin(userId) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                wins: {
                    increment: 1,
                },
            },
        });
        return user;
    }
    async addLoss(userId) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                loses: {
                    increment: 1,
                },
            },
        });
        return user;
    }
    async getLeaderboard() {
        const users = await this.prisma.user.findMany({
            orderBy: {
                wins: 'desc',
            },
        });
        return users;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_3.Inject)((0, common_3.forwardRef)(() => prisma_service_1.PrismaService))),
    __param(1, (0, common_3.Inject)((0, common_3.forwardRef)(() => chat_service_1.ChatService))),
    __param(2, (0, common_3.Inject)((0, common_3.forwardRef)(() => jwt_1.JwtService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_service_1.ChatService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
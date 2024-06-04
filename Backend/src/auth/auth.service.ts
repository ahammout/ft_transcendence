import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Token } from './types';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '.prisma/client';

import { UnauthorizedException } from '@nestjs/common';
import { UserData } from './utils/auth.types';
import { forwardRef, Inject } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { EditProfileDto } from './dto/EditProfileDto';
import { authenticator } from 'otplib';
import { ChatService } from 'src/chat/chat.service';
import { updateDto } from './dto/updateDto';
import * as otplib from 'otplib';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService,
    @Inject(forwardRef(() => JwtService)) private jwtService: JwtService,
  ) {}

  //twoFactorAuthentication/////

  async enableTwoFactorAuth(nickname: string): Promise<string> {
    const secret = otplib.authenticator.generateSecret();
    await this.saveSecretKey(nickname, secret);
    const otpauthURL = otplib.authenticator.keyuri(
      nickname,
      'pingpongGmae',
      secret,
    );
    return otpauthURL;
  }

  async saveSecretKey(nickname: string, secretKey: string) {
    await this.prisma.user.update({
      where: { nickname: nickname },
      data: { twoFactorSecret: secretKey },
    });
  }

  async removeSecretKey(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: null, twoFactorEnabled: false },
    });
  }

  async toggle2FAStatus(userId: number) {
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

  async verifyTOTPCode(user: User, totpCode: string) {
    const secretKey = user.twoFactorSecret;

    const isCodeValid = authenticator.verify({
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

  async disableTwoFactorAuth(userId: number) {
    await this.removeSecretKey(userId);
  }

  async set2FaTrue(userId: number) {
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

  async set2FaFalse(userId: number) {
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

  //end  twoFactorAuthentication

  // frind ///////////

  async getBlockList(userId: number) {
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
      const rt = blockList.map((item: any) =>
        item.userId == userId ? item.friendId : item.userId,
      );
      if (!blockList) return { status: '404', data: 'There no block list' };
      return { status: '101', data: rt };
    } catch (error) {}
  }

  async getAllFriends(userId: number) {
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
    } catch (error) {}
  }

  async getAllFriendsById(friendId: number) {
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
    } catch (error) {}
  }

  async getAllFrienfImSendRequest(userId: number, frienId: number) {
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
    } catch (error) {}
  }

  async getAllFriendsBolckedMe(userId: number, frienId: number) {
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
    } catch (error) {}
  }

  async getAllAcceptedFriends(userId: number) {
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
    } catch (error) {
      throw new Error('Failed to get friends');
    }
  }


  async addFriendRequest(userId: number, friendId: number) {
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
    } catch (error) {
      throw new Error('Failed to add friend request');
    }
  }

  async cancelFriendRequest(userId: number, friendId: number): Promise<void> {
    try {
      await this.prisma.frinds.deleteMany({
        where: {
          userId: userId,
          friendId: friendId,
        },
      });
    } catch (error) {
      throw new Error('Failed to cancel friend request');
    }
  }

  /// Create a channel between two users after accepting the friend request.
  async acceptFriendRequest(userId: number, friendId: number): Promise<void> {
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
    } catch (error) {
      throw new Error('Failed to accept friend request');
    }
  }

  async blockUser(userId: number, friendId: number): Promise<void> {
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
    } catch (error) {}
  }

  async unblockUser(userId: number, friendId: number): Promise<void> {
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
      // await this.prisma.frinds.updateMany({
      //   where: {
      //     userId: friendId,
      //     friendId: userId,
      //   },
      //   data: {
      //     block: false,
      //     status: 'ACCEPTED',
      //   },
      // });

      await this.prisma.frinds.create({
        data: {
          userId: friendId,
          friendId: userId,
          status: 'ACCEPTED',
          block: false,
        },
      });
    } catch (error) {
      throw new Error('Failed to unblock user');
    }
  }
  /////////////////////

  async signInWithFortyTwo(user: UserData): Promise<Token> {
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
        const tokens = await this.getTokens(
          existingUser.id,
          existingUser.email,
        );
        await this.updateRtHash(existingUser.id, tokens.refresh_token);
        return tokens;
      }

      // Handle the case where the 42 School login does not provide a password
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
    } catch (error) {
      throw new UnauthorizedException('42 School login failed');
    }
  }

  async search(query: string): Promise<User[]> {
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

  async signInWithGoogle(user: UserData): Promise<Token> {
    try {

      if (!user || !user.email) {
        throw new Error('Invalid user data');
      }

      // Handle the case where the Google login does not provide a password
      const passwordToHash = user.password || 'defaultPassword'; // Set a default password if not provided
      const hashedPassword = await argon.hash(passwordToHash);

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        const tokens = await this.getTokens(
          existingUser.id,
          existingUser.email,
        );
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
    } catch (error) {
      throw new UnauthorizedException('Google login failed');
    }
  }

  async singinLocal(dto: AuthDto): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      return null;
    }
    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) return null;

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }


  async refresh(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Acces Denied');
    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Acces Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
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

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: `${process.env.ACCESS_TOKEN}`,
          expiresIn: '2 days',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: `${process.env.REFRESH_TOKEN}`,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async singupLocal(dto: AuthDto): Promise<Token> {
    // herer change Tokesn
    // Validate that the password and confirmPassword match
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
        avatar:
          'https://res.cloudinary.com/dgmc7qcmk/image/upload/v1711300778/my-uploads/g1wk4cah5oemzb5zwjyj.png', // Adjust with a default value
      },
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async findUser(id: number): Promise<User | null> {
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
    } catch (error) {
      throw error; // You may want to handle or log the error accordingly
    }
  }

  generateNickname(email: string): string {
    const username = email.split('@')[0];
    const randomNumber = Math.floor(Math.random() * 1000);
    const nickname = `${username}_${randomNumber}`;

    return nickname;
  }
  /***************************nabil****************************/
  async editProfile(userId: number, data: EditProfileDto): Promise<User> {
    try {
      const updateData: any = {};

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

      /* omar */
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
      /* omar */

      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: updateData,
      });
      return user;
    } catch (error) {
      throw new Error('Failed to edit profile');
    }
  }

  async editUpdate(userId: number, data: updateDto) {
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

  async editavatar(email: string, photoPath: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('User not found');
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

  findUserByEmail(email: string) {
    const user = this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  // friends
  findUserByNickname(nickname: string) {
    const user = this.prisma.user.findUnique({
      where: {
        nickname,
      },
    });
    if (!user) return null;
    return user;
  }

  async findOneFriend(body: any) {
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

  async addNotification(friendId: number, message: string) {
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
    } catch (error) {}
  }

  async getNotifications(userId: number) {
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
    } catch (error) {}
  }

  async getNotificationByread(userId: number) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          ownerId: userId,
        },
      });
      return notifications;
    } catch (error) {}
  }

  /* orakib */

  async addInGame(userId: number) {
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
    } catch (error) {
      throw new Error('Failed to add in game');
    }
  }

  async addOutGame(userId: number) {
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
    } catch (error) {
      throw new Error('Failed to add out game');
    }
  }

  async addOnlineFromGame(userId: number) {
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
    } catch (error) {
    }
  }

  /* orakib */

  async addOnline(userId: number) {
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
    } catch (error) {
    }
  }

  async addOffline(userId: number) {
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
    } catch (error) {
      throw new Error('Failed to add offline');
    }
  }

  async getUserId(cookies: string) {
    try {
      const cookiePairs = cookies.split('; ');
      const tokenPair = cookiePairs.find((pair) => pair.startsWith('token='));
      if (!tokenPair) {
        return null;
      }
      const token = tokenPair.split('=')[1];
      const decoded: any = this.jwtService.decode(token);
      return decoded.sub;
    } catch (error) {
    }
  }

  async getIdBytoken(token: any) {
    const decoded: any = this.jwtService.decode(token);
    if (!decoded) {
      return null;
    }

    return decoded.sub;
  }

  /*************************omar*************************/

  async addWin(userId: number) {
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

  async addLoss(userId: number) {
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
}

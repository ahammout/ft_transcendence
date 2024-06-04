import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { EditProfileDto } from './dto/EditProfileDto';
import { Token } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GoogelAuthGuard } from './utils/Guards';
import { FortyTwoAuthGuard } from './utils/FortytwoGarsd';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { updateDto } from './dto/updateDto';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  token: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /*************************omar*************************/

  @Get('leaderboard')
  @UseGuards(AuthGuard('jwt'))
  async getLeaderboard(@Req() req: Request, @Res() res: Response) {
    try {
      const leaderboard = await this.authService.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {}
  }
  //*************to_Fa**************//

  @Put('update-2fa-status')
  @UseGuards(AuthGuard('jwt'))
  async verifyTOTPP(@Req() req: Request, @Res() res: Response) {
    res.json({ message: 'Update TOTP code status verified successfully' });
    const lwtUser = req.user as any;
    const verifyCode = await this.authService.set2FaTrue(lwtUser.sub);
    if (!verifyCode) {
      return;
    }
  }

  @Post('enable')
  @UseGuards(AuthGuard('jwt'))
  async enableTwoFactorAuth(@Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as any;
    const user = await this.authService.findUserByEmail(jwtUser.email);
    const qrCodeUrl = await this.authService.enableTwoFactorAuth(user.nickname);
    res.json({ qrCodeUrl });
  }

  @Put('save-2fa-status')
  @UseGuards(AuthGuard('jwt'))
  async toggle2FAStatus(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const updatedUser = await this.authService.toggle2FAStatus(user.sub);
    if (!updatedUser) {
      return;
    }
    return res
      .status(HttpStatus.OK)
      .json({ message: '2FA status toggled successfully', user: updatedUser });
  }

  @Post('verify-totp')
  @UseGuards(AuthGuard('jwt'))
  async verifyTOTP(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { totpCode: string },
  ) {
    const lwtUser = req.user as any;
    const user = await this.authService.findUserByEmail(lwtUser.email);
    const verifyCode = await this.authService.verifyTOTPCode(
      user,
      body.totpCode,
    );
    if (!verifyCode) {
      return res.json({ message: 'Invalid TOTP code' });
    }
    res
      .status(HttpStatus.OK)
      .json({ message: 'TOTP code verified successfully' });
  }

  @Put('remove-secret-key')
  @UseGuards(AuthGuard('jwt'))
  async removeSecretKey(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    await this.authService.removeSecretKey(user.sub);
    res.json({ message: 'Secret key removed successfully' });
  }

  @Post('disable')
  @UseGuards(AuthGuard('jwt'))
  async disableTwoFactorAuth(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    await this.authService.disableTwoFactorAuth(user.sub);
    res.json({ message: '2FA disabled successfully' });
  }

  //*************end to_Fa**************//

  @Get('block_list')
  @UseGuards(AuthGuard('jwt'))
  async getBlockList(@Req() req: Request, @Res() res: Response) {
    try {
      const jwtUser = req.user as User;
      const user = await this.authService.findUserByEmail(jwtUser.email);
      const blockList = await this.authService.getBlockList(user.id);
      res.json(blockList);
    } catch (error) {}
  }

  // frindes request   /////////
  @Get('all_friends')
  @UseGuards(AuthGuard('jwt'))
  async getAllFriends(@Req() req: Request, @Res() res: Response) {
    try {
      // const jwtUser = req.user as User;
      // const friends = await this.authService.getAllFriends(jwtUser.id);
      const jwtUser = req.user as User;
      const user = await this.authService.findUserByEmail(jwtUser.email);
      const friends = await this.authService.getAllFriends(user.id);
      res.json(friends);
    } catch (error) {}
  }

  @Post('all_friends_by_friendId')
  @UseGuards(AuthGuard('jwt'))
  async getAllFriendsByFriendId(@Body() body: any, @Res() res: Response) {
    const friends = await this.authService.getAllFriendsById(body.friendId);
    res.json(friends);
  }

  @Get('all_accepted_friends')
  @UseGuards(AuthGuard('jwt'))
  async getAllaccptedfrinds(@Req() req: Request, @Res() res: Response) {
    try {
      const jwtUser = req.user as User;
      const user = await this.authService.findUserByEmail(jwtUser.email);
      const friends = await this.authService.getAllAcceptedFriends(user.id);
      res.json(friends);
    } catch (error) {}
  }

  @Post('add-friend')
  async addFriendRequest(@Body() requestData: any, @Res() res: Response) {
    try {
      const { userId, friendId } = requestData;

      await this.authService.addFriendRequest(userId, friendId);
      res.json('okokokok');
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }
  }

  @Post('cancel-friend-request')
  async cancelFriendRequest(@Body() requestData: any, @Res() res: Response) {
    try {
      const { userId, friendId } = requestData;
      await this.authService.cancelFriendRequest(userId, friendId);
      res.json('okokokok');
      // return res.redirect('/profile/' + requestData.friendId);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }
  }

  @Post('accept-friend')
  async acceptFriendRequest(@Body() requestData: any, @Res() res: Response) {
    try {
      const { userId, friendId } = requestData;

      await this.authService.acceptFriendRequest(userId, friendId);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Friend request accepted successfully.' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to accept friend request.' });
    }
  }

  @Post('block')
  async blockUser(@Body() requestData: any, @Res() res: Response) {
    try {
      const { userId, friendId } = requestData;

      await this.authService.blockUser(userId, friendId);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'User blocked successfully.' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to block user.' });
    }
  }
  @Post('unblock')
  async unblockUser(@Body() requestData: any, @Res() res: Response) {
    try {
      const { userId, friendId } = requestData;

      await this.authService.unblockUser(userId, friendId);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'User unblocked successfully.' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to unblock user.' });
    }
  }

  ///////// ///// end frinds   /////

  @Get('search')
  async search(@Query('q') query: string) {
    const results = await this.authService.search(query);
    return { results }; // Return search results
  }

  @Get('42school/login')
  @UseGuards(FortyTwoAuthGuard)
  handleFortyTwoLogin() {
    return { message: '42 School Authentication' };
  }

  @Get('42school/redirect')
  @UseGuards(FortyTwoAuthGuard)
  async handleFortyTwoRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const user: UserData | null = req.user as UserData;
      if (user) {
        const token: Token = await this.authService.signInWithFortyTwo(user);

        if (!token) {
          return;
        }
        const userId = await this.authService.getIdBytoken(token.access_token);
        await this.authService.set2FaFalse(userId);
        res.cookie('token', token.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.redirect(`${process.env.FRONT_URL}/User/update`);
      }
    } catch (error) {
      throw new UnauthorizedException('42 School login failed');
    }
  }

  @Get('/google/login')
  @UseGuards(GoogelAuthGuard)
  handleLogin() {
    return { mes: 'Google Authentication' };
  }

  @UseGuards(GoogelAuthGuard)
  @Get('google/redirect')
  async handleGoogleRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const user: UserData = req.user as UserData;
      if (user) {
        const token: Token = await this.authService.signInWithGoogle(user);
        res.cookie('token', token.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.redirect(`${process.env.FRONT_URL}/User/update`);
      }
    } catch (error) {
      throw new UnauthorizedException('Google login failed');
    }
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async singupLocal(@Body() dto: AuthDto, @Res() res: Response): Promise<void> {
    try {
      const emailExist = await this.authService.findUserByEmail(dto.email);
      if (emailExist) {
        res.json({
          message: 'Email already exist',
        });
      }
      const tokens = await this.authService.singupLocal(dto);

      res.cookie('token', tokens.access_token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.status(HttpStatus.CREATED).json(tokens);
    } catch (error) {}
  }

  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  async singinLocal(@Body() dto: AuthDto, @Res() res: Response): Promise<void> {
    const token = await this.authService.singinLocal(dto);

    if (!token) {
      res.json({ message: 'User or password failed' });
    }

    const userId = await this.authService.getIdBytoken(token.access_token);
    await this.authService.set2FaFalse(userId);

    if (token) {
      res.cookie('token', token.access_token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.status(HttpStatus.OK).json({ token });
    }
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request) {
    const user = req.user;
    return this.authService.refresh(user['sub'], user['refresh']); // hrre id
  }

  /*************************nabil*************************/

  @Post('get-all-add-friends')
  @UseGuards(AuthGuard('jwt'))
  async getAllFrienfImSendRequest(
    @Body() body: any,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const jwtUser = req.user as any;
    const pending = await this.authService.getAllFrienfImSendRequest(
      jwtUser.sub,
      body.friendId,
    );
    const blocked = await this.authService.getAllFriendsBolckedMe(
      jwtUser.sub,
      body.friendId,
    );
    res.json([pending, blocked]);
  }

  @Get('get-and-update-state')
  @UseGuards(AuthGuard('jwt'))
  async getNotification(@Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as any;

    const user = await this.authService.findUserByEmail(jwtUser.email);
    const notifications = await this.authService.getNotifications(user.id);
    res.json(notifications);
  }
  @Get('getNotificationByread')
  @UseGuards(AuthGuard('jwt'))
  async getNotificationByread(@Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as any;
    const user = await this.authService.findUserByEmail(jwtUser.email);
    const notifications = await this.authService.getNotificationByread(user.id);
    res.json(notifications);
  }
  @Put('edit-profile')
  @UseGuards(AuthGuard('jwt'))
  async editProfile(
    @Body() editProfileDto: EditProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const jwtUser = req.user as any;
    const fitredEditProfileDto = Object.fromEntries(
      Object.entries(editProfileDto).filter(
        ([key, value]) => key !== '' && value !== '',
      ),
    );
    const updatedUser = await this.authService.editProfile(
      jwtUser.sub,
      fitredEditProfileDto,
    );
    if (!updatedUser) {
      return res.json({ message: 'Nickname already exists' });
    }
    return res.json(updatedUser);
  }

  @Put('edit-update')
  @UseGuards(AuthGuard('jwt'))
  async editUpdate(
    @Body() updateDto: updateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const jwtUser = req.user as any;
    const updatedUser = await this.authService.editUpdate(
      jwtUser.sub,
      updateDto,
    );
    if (!updatedUser) {
      return res.json({ message: 'Nickname already exists' });
    }
    return res.json(updatedUser);
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as User;
    const user = await this.authService.findUserByEmail(jwtUser.email);
    if (!user) {
      return res.json({ message: 'User not found' });
    }
    res.json(user);
  }

  @Post('middleware')
  async getStatus(@Body() body: any) {
    const id = await this.authService.getIdBytoken(body.token);
    if (!id) {
      return { message: 'Token is not valid' };
    }
    return { message: 'Token is valid' };
  }

  @Get(':nickname')
  @UseGuards(AuthGuard('jwt'))
  async getUserByNickname(
    @Param('nickname') nickname: string,
    @Res() res: Response,
  ) {
    const user = await this.authService.findUserByNickname(nickname);
    if (!user) {
      return res.json({ message: 'User not found' });
    }
    res.json(user);
  }

  @Put('uploadPhoto')
  @UseGuards(AuthGuard('jwt'))
  async uploadPhoto(
    @Body() body: any,
    @Req() req: Request,
    @Param('url') url: string,
    @Res() res: Response,
  ) {
    const jwtUser = req.user as User;
    const user = await this.authService.findUserByEmail(jwtUser.email);
    const updatedUser = await this.authService.editavatar(
      user.email,
      body.photo,
    );
    return res.json(updatedUser);
  }

  @Post('findOneFriend')
  @UseGuards(AuthGuard('jwt'))
  async findOneFriend(@Body() body: any, @Res() res: Response) {
    const user = await this.authService.findOneFriend(body);
    return res.json(user);
  }
}

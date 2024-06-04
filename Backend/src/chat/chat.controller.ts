import { Controller, Get, Post, Body, Patch, Param,   Delete, UseGuards, Req, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Prisma, User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request , Response, response} from 'express';
import JoinDto from './chat.service';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly UserService: AuthService) {}


  // ****************************** Channel members management ******************************//
  @Post('set_admin')
  @UseGuards(AuthGuard('jwt'))
  async setAdmin(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const member = await this.chatService.setAdmin(body);
      if (!member){
        res.json({status: "404", newStatus: "error"})
      }
      res.json({status: "101", newStatus: member});
    } catch (error) {
      console.error('Error in set admin:', error);
    }
  }

  @Post('unset_admin')
  @UseGuards(AuthGuard('jwt'))
  async unsetAdmin(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const member = await this.chatService.unsetAdmin(body);
      if (!member){
        res.json({status: "404", newStatus: "error"})
      }
      res.json({status: "101", newStatus: member});
    } catch (error) {
      console.error('Error in unset:', error);
    }
  }

  @Post('kick-member')
  @UseGuards(AuthGuard('jwt'))
  async kickMember(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const kicked = await this.chatService.kickMember(body);
      if (!kicked){
        res.json({status: "404", newStatus: "error"})
      }
      res.json({status: "101", newStatus: kicked});
    } catch (error) {
      console.error('Error in kick:', error);
    }
  }

  @Post('mute-member')
  @UseGuards(AuthGuard('jwt'))
  async muteMember(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const muted = await this.chatService.muteMember(body);
      if (!muted){
        res.json({status: "404", newStatus: "error"})
      }
      res.json({status: "101", newStatus: muted});
    } catch (error) {
      console.error('Error in mute', error);
    }
  }
  
  @Post('unmute-member')
  @UseGuards(AuthGuard('jwt'))
  async unmuteMember(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const unmuted = await this.chatService.unmuteMember(body);
      if (!unmuted){
        res.json({status: "404", newStatus: "error"})
      }
      res.json({status: "101", newStatus: unmuted});
    } catch (error) {
      console.error('Error in unmute:', error);
    }
  }

  @Post('ban-member')
  @UseGuards(AuthGuard('jwt'))
  async banMember(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const member = await this.chatService.banMember(body);
      if (!member){
        res.json({status: "404", newStatus: "error"})
      }
      res.json({status: "101", newStatus: member});
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }


  

  @Post('unban-member')
  @UseGuards(AuthGuard('jwt'))
  async unbanMember(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const member = await this.chatService.unbanMember(body);
      if (!member){
        res.json({status: "404", newStatus: "error"})
      }
      res.json({status: "101", newStatus: member});
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }
  

  // ****************************** Channel members management ******************************//

  @Get('invite_friends')
  @UseGuards(AuthGuard('jwt'))
  async getFriends(@Req() req: Request, @Res() res: Response) {
    try {
      const jwtUser = req.user as User;
      const user = await this.UserService.findUserByEmail(jwtUser.email);
      const friends = await this.UserService.getAllAcceptedFriends(user.id);
      res.json({status: "101", friendsList: friends});
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }

  @Post('inviteFriend')
  @UseGuards(AuthGuard('jwt'))
  async inviteFriends(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Body() body: any) {
    const update = this.chatService.inviteFriend(body);
    res.json(update);
  }


  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createChatDto: Prisma.ChannelsCreateInput, @Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as User; 
    const user = await this.UserService.findUserByEmail(jwtUser.email)

    const newChannel =  await this.chatService.create(createChatDto, user);
     res.json(newChannel)
  }

  @Post("join")
  @UseGuards(AuthGuard('jwt'))
  async join(@Body() joinDto: JoinDto, @Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)

    const channel = await this.chatService.join(joinDto, user);
    res.json(channel);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)

    const allChanels = await this.chatService.findAll(user);
    res.json(allChanels);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {

    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)
    const blockList = await this.UserService.getBlockList(user.id);

    const channel = await this.chatService.findOne(id, user, blockList);
    res.json(channel);
  }

  @Get('ChannelMembers/:id')
  @UseGuards(AuthGuard('jwt'))
  async getAllChannelMembers(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)
    const members = await this.chatService.getChannelMembers(id);
    res.json(members);
  }

  @Get('channel-member/:id')
  @UseGuards(AuthGuard('jwt'))
  async getChannelMember(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)
    const member = await this.chatService.getMember(id, user);
    res.json(member);
  }

  @Patch('UpdateChannelName/:id')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateName(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Body() body: any) {
    const updated = await this.chatService.updateChannelName(id, body.name);
    res.json(updated);
  }

  @Patch('UpdateChannelAvatar/:id')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async UpdataAvatar(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Body() body: any) {
    const updated = await this.chatService.UpdateChannelAvatar(id, body.avatar);
    res.json(updated);
  }

  @Delete('leave/:id')
  @UseGuards(AuthGuard('jwt'))
  async leaveChannel(@Param('id') id: string, @Req() req: Request, @Res() res: Response){
    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)
    const leavedChannel =  await this.chatService.leave(id, user);
    res.json(leavedChannel)
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async removeAll(@Req() req: Request, @Res() res: Response){
    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)

    const remove = await this.chatService.removeAll();
    res.json(remove);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)
    const remove =  await this.chatService.remove(id, user.id);

    res.json(remove)
  }

  @Delete('direct/:id')
  @UseGuards(AuthGuard('jwt'))
  async RemoveChat(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const jwtUser = req.user as User;
    const user = await this.UserService.findUserByEmail(jwtUser.email)
    const remove =  await this.chatService.RemoveChat(id);

    res.json(remove)
  }
}
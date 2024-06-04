import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';

interface JoinDto {
  name: string,
  type: string,
  password: string,
}
export default JoinDto;

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
    @Inject(forwardRef(() => JwtService)) private jwtService: JwtService,
  ) {}

  async findOne(id: string, user: any, blockList: any) {

    const channel = await this.prisma.channels.findUnique({where: {id,}, include: {members: {include: {member: true}}, Messages: {include: {sender: true}, orderBy: {createdAt: 'asc'}}}});
    if (!channel)
      return ({status: "404", data: channel});
    const member = await this.prisma.membership.findFirst({
      where: {
        memberId: user.id,
        channelId: id,
      },
      include: { member: true },
    });
    if (!member){
      return ({status: "500", data: 'Not a member'})
    }
    if (member.ban === true){
      return ({status: "404", data: 'baned'});
    }
    const msgs = channel.Messages?.filter((msg: any) => !blockList?.data?.includes(msg?.senderId));
    return ({status: "101", data: { ...channel, Messages: msgs }});
  }


  // -------------------------------------- SECTION FOR THE DIRECT MESSAGES -------------------------------------//

  async createDirectChannel (body: any) {
    //----------- Create a channel:
    //------------- Channel Type: Direct:
    const randomOne = body.memberOne.toString();
    const randomTwo = body.memberTwo.toString();
    const directName = `${randomOne}_${randomTwo}`;
    console.log(directName);

    // Check If the channel exist or not.
    const channel = await this.prisma.channels.findUnique({
      where: {
        name: directName,
        type: "DIRECT",
      },
    });

    if (!channel){
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
      })
      return (newChannel);
    }
  }

  async createChannel(createChannelDto, Owner){
    try{
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
      })
       return (newChannel);
    }
    catch (e) {
        return ("failed");
    }
  }

  async create(createChannelDto: Prisma.ChannelsCreateInput, user:Prisma.UserCreateInput) {

    const channel = await this.prisma.channels.findUnique({
      where: {
        name: createChannelDto.name,
      },
    });
    try{
      if (channel)
        throw new Error('Channel already exist');
      const newChannel = await this.createChannel(createChannelDto, user);
      return (newChannel);
    }
    catch(e){
      return ("duplicated");
    }
  }

  async inviteFriend (Body: any){
    // before invite it check if it's banned or not
    const channel = await this.prisma.channels.findUnique({
      where: {
        id: Body.channelId,
      },
    });
    if (channel){
      const membership = await this.prisma.membership.findMany({
        where: {
          channelId: channel.id,
          memberId: Body.friendId,
        },
        include: {channel: true},
      });
      if (membership.length >= 1) {
        return ({status: "404", UpdatedChannel: "Member Already exist"});
      }
      const UpdatedChannel = await this.prisma.channels.update({
        where: {id: channel.id},
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
      })
      return ({status: '101', UpdatedChannel: UpdatedChannel});

    }
  }

  // Search for the channel if it's exist
  // if the channel not exist then announce it to the user: that the channel doesn't exist.
  // if it's exist by name check it's type
  // if the type is protected then the user must provide a password.
  // if it's exist and public then let the user join to the channel. 
  // if the channel private, then the user must be invited by before join the channel.
  // after joining the user must take the Basic role badge.

  async join(joinDto: JoinDto, user: any){
    const channel = await this.prisma.channels.findUnique({
      where: {
        name: joinDto.name,
      },
    });
    try{
      if (!channel)
      return ({status: '404', UpdatedChannel: "Channel not found"});
      // Check if the user is already a member on the channel;
      const membership = await this.prisma.membership.findMany({
        where: {
          channelId: channel.id,
          memberId: user.id,
        },
        include: {channel: true},
      });

      //************************************* Handle private channel ****************************************/
      if ((!membership.length) && (channel.type === "PRIVATE")){
        return ({status: '404', UpdatedChannel: "You're not invited to this channel"});
      }
      if ((membership.length === 1) && (!membership[0].status) && (channel.type === "PRIVATE")){
        if ((joinDto.type !== "PRIVATE")){
          return ({status: '404', UpdatedChannel: "This channel it's private"});
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
        return ({status: '101', UpdatedChannel: channel});
      }
      //************************************* Handle private channel ****************************************/
      // CHECK IF THE USER IS INVITED TO THE CHANNEL
      // Option1: Check if the user exists in the channels members
      if (membership.length)
        return ({status: '404', UpdatedChannel: "you're already member on this channel"});

      //************************************* Handle public channel ****************************************/
      if (channel.type === "PUBLIC"){
        if ((joinDto.type !== "PUBLIC")){
          return ({status: '404', UpdatedChannel: "This channel it's public"});
        }
        const UpdatedChannel = await this.prisma.channels.update({
          where: {id: channel.id},
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
        })
        return ({status: '101', UpdatedChannel: UpdatedChannel});
      }
      //************************************* Handle public channel ****************************************/

      //************************************* Handle protected channel ****************************************/
      else if (channel.type === "PROTECTED" ){
        if (!(joinDto.type === "PROTECTED"))
          return ({status: '404', UpdatedChannel: "This Channel it's protected by a password"});
        if (!bcrypt.compareSync(joinDto.password, channel.password))
          return ({status: '404', UpdatedChannel: "Password not matched"});
          // if matched let the user join.
          const UpdatedChannel = await this.prisma.channels.update({
            where: {id: channel.id},
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
          })
          return ({status: '101', UpdatedChannel: UpdatedChannel});
      }
      //************************************* Handle protected channel ****************************************/
      else{
        return ({status: '404', UpdatedChannel: "unexpected error happened"});
      }
    }
    catch(e){
      return ("duplicated");
    }
  }

  async leave(id: string, user: any){
    try {
      const member = await this.prisma.membership.findFirst({
        where: {
          memberId: user.id,
          channelId: id,
        },
        include: { member: true },
      });
      if (member.role === 'OWNER'){
        this.remove(id, user.id)
      }
      await this.prisma.membership.deleteMany({where: {channelId: id, memberId: user.id},})
      return ({status: '101', leaveStatus: "Leaved The channel"});
    }catch(e){
      return ({status: '404', leaveStatus: "Unexpected error happened"});
    }
  }

  async findAll(user: any) {
    try{
      const membership = await this.prisma.membership.findMany({
        where: {memberId: user.id},
        include: {channel: {include: {members: {include: {member: true}}}}},
      });
      const AllChannels = membership.filter(membership => (membership.status === true && membership.ban === false)).map(membership => membership.channel);

      if (AllChannels)
        return(AllChannels);
      else
        throw new error;
    }catch (exp){
      return ("error")
    }
  }

  async getMember(id: string, user: any){
    try {
      const member = await this.prisma.membership.findFirst({
        where : {
          channelId: id,
          memberId: user.id,
        },
        include: {
          mute: true,
        }
      })
      if (!member){
        return ("404");
      }
      return (member);
    }catch(error){
      return (error);
    }
  }

  async getChannelMembers(id: string) {
    try {
      const members = await this.prisma.membership.findMany({
        where : {
          channelId: id,
        },
        include: {
          member: true,
          mute: true,
        }
      })
      return ({status: "101", data: members});
      
    } catch (error) {
      return ({status: "404", data: error});
    }
  }

  async updateChannelName(id: string, newName: string){
    try{
      const channel = await this.prisma.channels.findUnique({
        where: {
          name: newName,
        },
      });
      if (channel){
        return ({status: '404', UpdatedChannel:  "duplicated"});
      }

      const updated = await this.prisma.channels.update({
        where: {
          id,
        },
        data: {
          name: newName,
        },
      });
      return ({status: '101', UpdatedChannel: updated});
    } catch(erorr){
      return ({status: '404', UpdatedChannel:  "Unexpected error happened"});
    }
  }

  async UpdateChannelAvatar(id: string, newAvatar: string){
    try{
      const updated = await this.prisma.channels.update({
        where: {
          id,
        },
        data: {
          avatar: newAvatar,
        },
      });
      return ({status: '101', updated: updated});
    } catch(erorr){
      return ({status: '404', updated:  "Unexpected error happened"});
    }
  }

  async update(id: string, updateChannelDto: Prisma.ChannelsUpdateInput) {
    return this.prisma.channels.update({
      where: {
        id,
      },
      data: updateChannelDto,
    });
  }

  // ****************************** Channel members management ******************************//

  async setAdmin(body: any){
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

  async unsetAdmin(body: any){
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

  async kickMember(body: any) {
      const kicked = await this.prisma.membership.deleteMany(
        {where: {channelId: body.channelId, memberId: body.memberId},
      })
      return (kicked);
  }

  async banMember(body: any) {
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
  
  async unbanMember(body: any) {
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
  
  async muteMember(body: any) {

    const member = await this.prisma.membership.findFirst({
      where : {
        channelId: body.channelId,
        memberId: body.memberId,
      },
    })

    const checkMute = await this.prisma.mute.findFirst({
      where : {
        channelId: body.channelId,
        memberId: member.id,
      },
    })

    if (checkMute){
      const newMuted = await this.prisma.mute.update({
        where : {
          channelId: body.channelId,
          memberId: member.id,
        },
        data: {
          duration: parseInt(body.duration, 10),
          },
        },
      )
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
      },
    )
    return (newMuted);  
  }

  async unmuteMember(body: any) {

    const member = await this.prisma.membership.findFirst({
      where : {
        channelId: body.channelId,
        memberId: body.memberId,
      },
    })
    const Unmuted = await this.prisma.mute.deleteMany({
      where : {
        channelId: body.channelId,
        memberId: member.id,
      },
      },
    )
    return (Unmuted);  
  }

  // ****************************** Channel members management ******************************//

  async removeAll() {
    return (this.prisma.channels.deleteMany({}))
  }

  async remove(id: string, userId: number) {
    try {
      // get the channel
      const Channel = await this.prisma.channels.findUnique({where: {id,}, include: {members: true, Messages: true}});
      if (!Channel){
        return ({status: '404', removed: "Channel not found"});
      }
      // check the user priveleges
      const member = await this.prisma.membership.findFirst({
        where: {
          memberId: userId,
          channelId: Channel.id,
        },
        include: { member: true },
      });
      if (member.role === 'OWNER'){

        // Remove the mutes
        await this.prisma.mute.deleteMany({where: {channelId: Channel.id}});
        // remove all the messages 
        await this.prisma.messages.deleteMany({where: {channelId: Channel.id}});

        // remove all the members
        await this.prisma.membership.deleteMany({where: {channelId: Channel.id},})
        // remove the channel
        const removed = await this.prisma.channels.delete({
          where: {
            id: id,
          },
        });
        return ({status: '101', removed: removed});
      }
    } catch(e){
      return ({status: '404', updated:  "Unexpected error happened"});
    }
  }


  async RemoveChat(id: string) {
    try {
      // get the channel
      const Channel = await this.prisma.channels.findUnique({where: {id,}, include: {members: true, Messages: true}});
      if (!Channel){
        return ({status: '404', removed: "Channel not found"});
      }
        // remove all the messages 
        const removed = await this.prisma.messages.deleteMany({where: {channelId: Channel.id}});
        // remove the channel
        return ({status: '101', removed: removed});
    } catch(e){
      return ({status: '404', updated:  "Unexpected error happened"});
    }
  }
}



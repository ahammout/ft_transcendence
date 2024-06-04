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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const client_1 = require("@prisma/client");
const auth_service_1 = require("../auth/auth.service");
const passport_1 = require("@nestjs/passport");
let ChatController = class ChatController {
    constructor(chatService, UserService) {
        this.chatService = chatService;
        this.UserService = UserService;
    }
    async setAdmin(body, req, res) {
        try {
            const member = await this.chatService.setAdmin(body);
            if (!member) {
                res.json({ status: "404", newStatus: "error" });
            }
            res.json({ status: "101", newStatus: member });
        }
        catch (error) {
            console.error('Error in set admin:', error);
        }
    }
    async unsetAdmin(body, req, res) {
        try {
            const member = await this.chatService.unsetAdmin(body);
            if (!member) {
                res.json({ status: "404", newStatus: "error" });
            }
            res.json({ status: "101", newStatus: member });
        }
        catch (error) {
            console.error('Error in unset:', error);
        }
    }
    async kickMember(body, req, res) {
        try {
            const kicked = await this.chatService.kickMember(body);
            if (!kicked) {
                res.json({ status: "404", newStatus: "error" });
            }
            res.json({ status: "101", newStatus: kicked });
        }
        catch (error) {
            console.error('Error in kick:', error);
        }
    }
    async muteMember(body, req, res) {
        try {
            const muted = await this.chatService.muteMember(body);
            if (!muted) {
                res.json({ status: "404", newStatus: "error" });
            }
            res.json({ status: "101", newStatus: muted });
        }
        catch (error) {
            console.error('Error in mute', error);
        }
    }
    async unmuteMember(body, req, res) {
        try {
            const unmuted = await this.chatService.unmuteMember(body);
            if (!unmuted) {
                res.json({ status: "404", newStatus: "error" });
            }
            res.json({ status: "101", newStatus: unmuted });
        }
        catch (error) {
            console.error('Error in unmute:', error);
        }
    }
    async banMember(body, req, res) {
        try {
            const member = await this.chatService.banMember(body);
            if (!member) {
                res.json({ status: "404", newStatus: "error" });
            }
            res.json({ status: "101", newStatus: member });
        }
        catch (error) {
            console.error('Error fetching friends:', error);
        }
    }
    async unbanMember(body, req, res) {
        try {
            const member = await this.chatService.unbanMember(body);
            if (!member) {
                res.json({ status: "404", newStatus: "error" });
            }
            res.json({ status: "101", newStatus: member });
        }
        catch (error) {
            console.error('Error fetching friends:', error);
        }
    }
    async getFriends(req, res) {
        try {
            const jwtUser = req.user;
            const user = await this.UserService.findUserByEmail(jwtUser.email);
            const friends = await this.UserService.getAllAcceptedFriends(user.id);
            res.json({ status: "101", friendsList: friends });
        }
        catch (error) {
            console.error('Error fetching friends:', error);
        }
    }
    async inviteFriends(req, res, id, body) {
        const update = this.chatService.inviteFriend(body);
        res.json(update);
    }
    async create(createChatDto, req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const newChannel = await this.chatService.create(createChatDto, user);
        res.json(newChannel);
    }
    async join(joinDto, req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const channel = await this.chatService.join(joinDto, user);
        res.json(channel);
    }
    async findAll(req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const allChanels = await this.chatService.findAll(user);
        res.json(allChanels);
    }
    async findOne(id, req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const blockList = await this.UserService.getBlockList(user.id);
        const channel = await this.chatService.findOne(id, user, blockList);
        res.json(channel);
    }
    async getAllChannelMembers(id, req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const members = await this.chatService.getChannelMembers(id);
        res.json(members);
    }
    async getChannelMember(id, req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const member = await this.chatService.getMember(id, user);
        res.json(member);
    }
    async updateName(req, res, id, body) {
        const updated = await this.chatService.updateChannelName(id, body.name);
        res.json(updated);
    }
    async UpdataAvatar(req, res, id, body) {
        const updated = await this.chatService.UpdateChannelAvatar(id, body.avatar);
        res.json(updated);
    }
    async leaveChannel(id, req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const leavedChannel = await this.chatService.leave(id, user);
        res.json(leavedChannel);
    }
    async removeAll(req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const remove = await this.chatService.removeAll();
        res.json(remove);
    }
    async remove(id, req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const remove = await this.chatService.remove(id, user.id);
        res.json(remove);
    }
    async RemoveChat(id, req, res) {
        const jwtUser = req.user;
        const user = await this.UserService.findUserByEmail(jwtUser.email);
        const remove = await this.chatService.RemoveChat(id);
        res.json(remove);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('set_admin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "setAdmin", null);
__decorate([
    (0, common_1.Post)('unset_admin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unsetAdmin", null);
__decorate([
    (0, common_1.Post)('kick-member'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "kickMember", null);
__decorate([
    (0, common_1.Post)('mute-member'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "muteMember", null);
__decorate([
    (0, common_1.Post)('unmute-member'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unmuteMember", null);
__decorate([
    (0, common_1.Post)('ban-member'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "banMember", null);
__decorate([
    (0, common_1.Post)('unban-member'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unbanMember", null);
__decorate([
    (0, common_1.Get)('invite_friends'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Post)('inviteFriend'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "inviteFriends", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("join"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "join", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('ChannelMembers/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllChannelMembers", null);
__decorate([
    (0, common_1.Get)('channel-member/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChannelMember", null);
__decorate([
    (0, common_1.Patch)('UpdateChannelName/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateName", null);
__decorate([
    (0, common_1.Patch)('UpdateChannelAvatar/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "UpdataAvatar", null);
__decorate([
    (0, common_1.Delete)('leave/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "leaveChannel", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "removeAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('direct/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "RemoveChat", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService, auth_service_1.AuthService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map
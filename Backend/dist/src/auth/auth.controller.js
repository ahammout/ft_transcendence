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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const EditProfileDto_1 = require("./dto/EditProfileDto");
const passport_1 = require("@nestjs/passport");
const Guards_1 = require("./utils/Guards");
const FortytwoGarsd_1 = require("./utils/FortytwoGarsd");
const common_2 = require("@nestjs/common");
const updateDto_1 = require("./dto/updateDto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async getLeaderboard(req, res) {
        try {
            const leaderboard = await this.authService.getLeaderboard();
            res.json(leaderboard);
        }
        catch (error) { }
    }
    async verifyTOTPP(req, res) {
        res.json({ message: 'Update TOTP code status verified successfully' });
        const lwtUser = req.user;
        const verifyCode = await this.authService.set2FaTrue(lwtUser.sub);
        if (!verifyCode) {
            return;
        }
    }
    async enableTwoFactorAuth(req, res) {
        const jwtUser = req.user;
        const user = await this.authService.findUserByEmail(jwtUser.email);
        const qrCodeUrl = await this.authService.enableTwoFactorAuth(user.nickname);
        res.json({ qrCodeUrl });
    }
    async toggle2FAStatus(req, res) {
        const user = req.user;
        const updatedUser = await this.authService.toggle2FAStatus(user.sub);
        if (!updatedUser) {
            return;
        }
        return res
            .status(common_1.HttpStatus.OK)
            .json({ message: '2FA status toggled successfully', user: updatedUser });
    }
    async verifyTOTP(req, res, body) {
        const lwtUser = req.user;
        const user = await this.authService.findUserByEmail(lwtUser.email);
        const verifyCode = await this.authService.verifyTOTPCode(user, body.totpCode);
        if (!verifyCode) {
            return res.json({ message: 'Invalid TOTP code' });
        }
        res
            .status(common_1.HttpStatus.OK)
            .json({ message: 'TOTP code verified successfully' });
    }
    async removeSecretKey(req, res) {
        const user = req.user;
        await this.authService.removeSecretKey(user.sub);
        res.json({ message: 'Secret key removed successfully' });
    }
    async disableTwoFactorAuth(req, res) {
        const user = req.user;
        await this.authService.disableTwoFactorAuth(user.sub);
        res.json({ message: '2FA disabled successfully' });
    }
    async getBlockList(req, res) {
        try {
            const jwtUser = req.user;
            const user = await this.authService.findUserByEmail(jwtUser.email);
            const blockList = await this.authService.getBlockList(user.id);
            res.json(blockList);
        }
        catch (error) { }
    }
    async getAllFriends(req, res) {
        try {
            const jwtUser = req.user;
            const user = await this.authService.findUserByEmail(jwtUser.email);
            const friends = await this.authService.getAllFriends(user.id);
            res.json(friends);
        }
        catch (error) { }
    }
    async getAllFriendsByFriendId(body, res) {
        const friends = await this.authService.getAllFriendsById(body.friendId);
        res.json(friends);
    }
    async getAllaccptedfrinds(req, res) {
        try {
            const jwtUser = req.user;
            const user = await this.authService.findUserByEmail(jwtUser.email);
            const friends = await this.authService.getAllAcceptedFriends(user.id);
            res.json(friends);
        }
        catch (error) { }
    }
    async addFriendRequest(requestData, res) {
        try {
            const { userId, friendId } = requestData;
            await this.authService.addFriendRequest(userId, friendId);
            res.json('okokokok');
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .send('Internal server error');
        }
    }
    async cancelFriendRequest(requestData, res) {
        try {
            const { userId, friendId } = requestData;
            await this.authService.cancelFriendRequest(userId, friendId);
            res.json('okokokok');
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .send('Internal server error');
        }
    }
    async acceptFriendRequest(requestData, res) {
        try {
            const { userId, friendId } = requestData;
            await this.authService.acceptFriendRequest(userId, friendId);
            return res
                .status(common_1.HttpStatus.OK)
                .json({ message: 'Friend request accepted successfully.' });
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: 'Failed to accept friend request.' });
        }
    }
    async blockUser(requestData, res) {
        try {
            const { userId, friendId } = requestData;
            await this.authService.blockUser(userId, friendId);
            return res
                .status(common_1.HttpStatus.OK)
                .json({ message: 'User blocked successfully.' });
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: 'Failed to block user.' });
        }
    }
    async unblockUser(requestData, res) {
        try {
            const { userId, friendId } = requestData;
            await this.authService.unblockUser(userId, friendId);
            return res
                .status(common_1.HttpStatus.OK)
                .json({ message: 'User unblocked successfully.' });
        }
        catch (error) {
            return res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: 'Failed to unblock user.' });
        }
    }
    async search(query) {
        const results = await this.authService.search(query);
        return { results };
    }
    handleFortyTwoLogin() {
        return { message: '42 School Authentication' };
    }
    async handleFortyTwoRedirect(req, res) {
        try {
            const user = req.user;
            if (user) {
                const token = await this.authService.signInWithFortyTwo(user);
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
        }
        catch (error) {
            throw new common_2.UnauthorizedException('42 School login failed');
        }
    }
    handleLogin() {
        return { mes: 'Google Authentication' };
    }
    async handleGoogleRedirect(req, res) {
        try {
            const user = req.user;
            if (user) {
                const token = await this.authService.signInWithGoogle(user);
                res.cookie('token', token.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                });
                res.redirect(`${process.env.FRONT_URL}/User/update`);
            }
        }
        catch (error) {
            throw new common_2.UnauthorizedException('Google login failed');
        }
    }
    async singupLocal(dto, res) {
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
            res.status(common_1.HttpStatus.CREATED).json(tokens);
        }
        catch (error) { }
    }
    async singinLocal(dto, res) {
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
            res.status(common_1.HttpStatus.OK).json({ token });
        }
    }
    async logout(res) {
        res.clearCookie('token');
        res.json({ message: 'Logged out' });
    }
    refresh(req) {
        const user = req.user;
        return this.authService.refresh(user['sub'], user['refresh']);
    }
    async getAllFrienfImSendRequest(body, res, req) {
        const jwtUser = req.user;
        const pending = await this.authService.getAllFrienfImSendRequest(jwtUser.sub, body.friendId);
        const blocked = await this.authService.getAllFriendsBolckedMe(jwtUser.sub, body.friendId);
        res.json([pending, blocked]);
    }
    async getNotification(req, res) {
        const jwtUser = req.user;
        const user = await this.authService.findUserByEmail(jwtUser.email);
        const notifications = await this.authService.getNotifications(user.id);
        res.json(notifications);
    }
    async getNotificationByread(req, res) {
        const jwtUser = req.user;
        const user = await this.authService.findUserByEmail(jwtUser.email);
        const notifications = await this.authService.getNotificationByread(user.id);
        res.json(notifications);
    }
    async editProfile(editProfileDto, req, res) {
        const jwtUser = req.user;
        const fitredEditProfileDto = Object.fromEntries(Object.entries(editProfileDto).filter(([key, value]) => key !== '' && value !== ''));
        const updatedUser = await this.authService.editProfile(jwtUser.sub, fitredEditProfileDto);
        if (!updatedUser) {
            return res.json({ message: 'Nickname already exists' });
        }
        return res.json(updatedUser);
    }
    async editUpdate(updateDto, req, res) {
        const jwtUser = req.user;
        const updatedUser = await this.authService.editUpdate(jwtUser.sub, updateDto);
        if (!updatedUser) {
            return res.json({ message: 'Nickname already exists' });
        }
        return res.json(updatedUser);
    }
    async getUser(req, res) {
        const jwtUser = req.user;
        const user = await this.authService.findUserByEmail(jwtUser.email);
        if (!user) {
            return res.json({ message: 'User not found' });
        }
        res.json(user);
    }
    async getStatus(body) {
        const id = await this.authService.getIdBytoken(body.token);
        if (!id) {
            return { message: 'Token is not valid' };
        }
        return { message: 'Token is valid' };
    }
    async getUserByNickname(nickname, res) {
        const user = await this.authService.findUserByNickname(nickname);
        if (!user) {
            return res.json({ message: 'User not found' });
        }
        res.json(user);
    }
    async uploadPhoto(body, req, url, res) {
        const jwtUser = req.user;
        const user = await this.authService.findUserByEmail(jwtUser.email);
        const updatedUser = await this.authService.editavatar(user.email, body.photo);
        return res.json(updatedUser);
    }
    async findOneFriend(body, res) {
        const user = await this.authService.findOneFriend(body);
        return res.json(user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Put)('update-2fa-status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTOTPP", null);
__decorate([
    (0, common_1.Post)('enable'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableTwoFactorAuth", null);
__decorate([
    (0, common_1.Put)('save-2fa-status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "toggle2FAStatus", null);
__decorate([
    (0, common_1.Post)('verify-totp'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTOTP", null);
__decorate([
    (0, common_1.Put)('remove-secret-key'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "removeSecretKey", null);
__decorate([
    (0, common_1.Post)('disable'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableTwoFactorAuth", null);
__decorate([
    (0, common_1.Get)('block_list'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBlockList", null);
__decorate([
    (0, common_1.Get)('all_friends'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllFriends", null);
__decorate([
    (0, common_1.Post)('all_friends_by_friendId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllFriendsByFriendId", null);
__decorate([
    (0, common_1.Get)('all_accepted_friends'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllaccptedfrinds", null);
__decorate([
    (0, common_1.Post)('add-friend'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "addFriendRequest", null);
__decorate([
    (0, common_1.Post)('cancel-friend-request'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "cancelFriendRequest", null);
__decorate([
    (0, common_1.Post)('accept-friend'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "acceptFriendRequest", null);
__decorate([
    (0, common_1.Post)('block'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Post)('unblock'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('42school/login'),
    (0, common_1.UseGuards)(FortytwoGarsd_1.FortyTwoAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleFortyTwoLogin", null);
__decorate([
    (0, common_1.Get)('42school/redirect'),
    (0, common_1.UseGuards)(FortytwoGarsd_1.FortyTwoAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleFortyTwoRedirect", null);
__decorate([
    (0, common_1.Get)('/google/login'),
    (0, common_1.UseGuards)(Guards_1.GoogelAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.UseGuards)(Guards_1.GoogelAuthGuard),
    (0, common_1.Get)('google/redirect'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleGoogleRedirect", null);
__decorate([
    (0, common_1.Post)('local/signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "singupLocal", null);
__decorate([
    (0, common_1.Post)('/local/signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "singinLocal", null);
__decorate([
    (0, common_1.Get)('/logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt-refresh')),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('get-all-add-friends'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllFrienfImSendRequest", null);
__decorate([
    (0, common_1.Get)('get-and-update-state'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getNotification", null);
__decorate([
    (0, common_1.Get)('getNotificationByread'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getNotificationByread", null);
__decorate([
    (0, common_1.Put)('edit-profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditProfileDto_1.EditProfileDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "editProfile", null);
__decorate([
    (0, common_1.Put)('edit-update'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateDto_1.updateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "editUpdate", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('middleware'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)(':nickname'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('nickname')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserByNickname", null);
__decorate([
    (0, common_1.Put)('uploadPhoto'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('url')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Post)('findOneFriend'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findOneFriend", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
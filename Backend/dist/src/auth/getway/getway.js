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
exports.myGetWay = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_service_1 = require("../auth.service");
const common_1 = require("@nestjs/common");
const arrayOfPairs = [];
let myGetWay = class myGetWay {
    constructor(authService) {
        this.authService = authService;
    }
    async handleConnection(client) {
        const cookies = client.handshake.headers.cookie;
        if (!cookies) {
            return;
        }
        const userId = await this.authService.getUserId(cookies);
        if (!userId) {
            return;
        }
        const foundPair = arrayOfPairs.find((pair) => pair.id === userId);
        const foundIndex = arrayOfPairs.findIndex((pair) => pair.id === userId);
        if (foundPair) {
            foundPair.socketsId.push(client.id);
            arrayOfPairs.splice(foundIndex, 1, foundPair);
        }
        else {
            const newPair = { id: userId, socketsId: [] };
            newPair.socketsId.push(client.id);
            arrayOfPairs.push(newPair);
        }
        const addOnline = this.authService.addOnline(userId);
        this.server.emit('user_connected', { userId: userId });
        if (!addOnline) {
            return;
        }
    }
    async handleDisconnect(client) {
        const cookies = client.handshake.headers.cookie;
        if (!cookies) {
            return;
        }
        const userId = await this.authService.getUserId(cookies);
        if (!userId) {
            return;
        }
        const foundPair = arrayOfPairs.find((pair) => pair.id === userId);
        const foundIndex = arrayOfPairs.findIndex((pair) => pair.id === userId);
        if (foundPair) {
            const foundSocketIndex = foundPair.socketsId.findIndex((socketId) => socketId === client.id);
            if (foundSocketIndex !== -1) {
                foundPair.socketsId.splice(foundSocketIndex, 1);
                if (foundPair.socketsId.length === 0) {
                    arrayOfPairs.splice(foundIndex, 1);
                    const offlineupdate = this.authService.addOffline(userId);
                    this.server.emit('user_disconnected', { userId: userId });
                    if (!offlineupdate) {
                        return;
                    }
                }
                else {
                    arrayOfPairs.splice(foundIndex, 1, foundPair);
                }
            }
        }
    }
    onNewMessage(body) {
        this.server.to(body.friendId).emit('notification', body);
        this.authService.addFriendRequest(body.userId, body.friendId);
        this.authService.addNotification(body.friendId, body.message);
    }
    join(body, client) {
        client.join(body.id);
    }
    async ingame(client) {
        const cookies = client.handshake.headers.cookie;
        if (!cookies) {
            return;
        }
        const userId = await this.authService.getUserId(cookies);
        if (!userId) {
            return;
        }
        const addInGame = this.authService.addInGame(userId);
        this.server.emit('user_ingame', { userId: userId });
        if (!addInGame) {
            return;
        }
    }
    async outgame(client) {
        const cookies = client.handshake.headers.cookie;
        if (!cookies) {
            return;
        }
        const userId = await this.authService.getUserId(cookies);
        if (!userId) {
            return;
        }
        const addOutGame = this.authService.addOutGame(userId);
        this.server.emit('user_outgame', { userId: userId });
        if (!addOutGame) {
            return;
        }
    }
};
exports.myGetWay = myGetWay;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], myGetWay.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('notification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], myGetWay.prototype, "onNewMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], myGetWay.prototype, "join", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ingame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], myGetWay.prototype, "ingame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('outgame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], myGetWay.prototype, "outgame", null);
exports.myGetWay = myGetWay = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'users', cors: true }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], myGetWay);
//# sourceMappingURL=getway.js.map
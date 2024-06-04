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
exports.MatchHistoryController = void 0;
const common_1 = require("@nestjs/common");
const match_history_service_1 = require("./match-history.service");
const passport_1 = require("@nestjs/passport");
let MatchHistoryController = class MatchHistoryController {
    constructor(matchHistoryService) {
        this.matchHistoryService = matchHistoryService;
    }
    async getMatchHistory(req) {
        try {
            const jwtUser = req.user;
            const ret = await this.matchHistoryService.getMatchHistory(jwtUser.sub);
            return ret;
        }
        catch (error) {
            console.error(error);
        }
    }
    async getMatchHistoryById(id) {
        try {
            const ret = await this.matchHistoryService.getMatchHistory(id);
            return ret;
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.MatchHistoryController = MatchHistoryController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchHistoryController.prototype, "getMatchHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchHistoryController.prototype, "getMatchHistoryById", null);
exports.MatchHistoryController = MatchHistoryController = __decorate([
    (0, common_1.Controller)('match-history'),
    __metadata("design:paramtypes", [match_history_service_1.MatchHistoryService])
], MatchHistoryController);
//# sourceMappingURL=match-history.controller.js.map
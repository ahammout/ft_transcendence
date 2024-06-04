"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const strategies_1 = require("./strategies");
const GoogleStrategy_1 = require("./utils/GoogleStrategy");
const jwt_1 = require("@nestjs/jwt");
const Serialis_1 = require("./utils/Serialis");
const FortyTwoStrategy_1 = require("./utils/FortyTwoStrategy");
const chat_module_1 = require("../chat/chat.module");
const chat_service_1 = require("../chat/chat.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({}), chat_module_1.ChatModule],
        controllers: [auth_controller_1.AuthController],
        providers: [
            chat_service_1.ChatService,
            auth_service_1.AuthService,
            strategies_1.AtStrategy,
            strategies_1.RtStrategy,
            GoogleStrategy_1.GoogleStrategy,
            FortyTwoStrategy_1.FortyTwoStrategy,
            Serialis_1.SessionSerializer,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map
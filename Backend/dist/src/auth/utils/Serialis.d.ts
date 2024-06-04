import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "@prisma/client";
export declare class SessionSerializer extends PassportSerializer {
    private readonly authService;
    constructor(authService: AuthService);
    serializeUser(user: User, done: (err: Error, id?: any) => void): void;
    deserializeUser(userId: any, done: (err: Error, payload: any) => void): any;
}

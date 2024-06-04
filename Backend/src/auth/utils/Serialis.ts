// import { Inject, Injectable } from "@nestjs/common";
// import { PassportSerializer } from "@nestjs/passport";
// import { AuthService } from "../auth.service";
// // import { deserializeUser, serializeUser } from "passport";
// import { User } from "@prisma/client";

// @Injectable()

// export class SessionSerializer extends PassportSerializer {
//     constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
//         super();
//     }
//     serializeUser(user: User, done: (err: Error, id?: any) => void): void {
//         done(null,user.id)
//     }

//     async deserializeUser(payload: any, done: (err: Error, user?: any) => void): Promise<void> {
//         try {
//             const user = await this.authService.findUser(payload.id);
//             done(null, user);
//         } catch (error) {
//             done(error, null);
//         }
//     }
// }

import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "@prisma/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly authService: AuthService) {
        super();
    }

    serializeUser(user: User, done: (err: Error, id?: any) => void): void {
        done(null, user);
    }

    deserializeUser(userId: any, done: (err: Error, payload: any) => void): any {
        try {
            // Check userId and construct user object
            const user = { id: userId }; // Adjust based on your user object structure
            done(null, user);
        } catch (error) {
            console.error('Error during deserialization:', error);
            done(error, null);
        }
    }
    
}





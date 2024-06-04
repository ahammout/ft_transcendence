import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { EditProfileDto } from './dto/EditProfileDto';
import { Request } from 'express';
import { Response } from 'express';
import { updateDto } from './dto/updateDto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    getLeaderboard(req: Request, res: Response): Promise<void>;
    verifyTOTPP(req: Request, res: Response): Promise<void>;
    enableTwoFactorAuth(req: Request, res: Response): Promise<void>;
    toggle2FAStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyTOTP(req: Request, res: Response, body: {
        totpCode: string;
    }): Promise<Response<any, Record<string, any>>>;
    removeSecretKey(req: Request, res: Response): Promise<void>;
    disableTwoFactorAuth(req: Request, res: Response): Promise<void>;
    getBlockList(req: Request, res: Response): Promise<void>;
    getAllFriends(req: Request, res: Response): Promise<void>;
    getAllFriendsByFriendId(body: any, res: Response): Promise<void>;
    getAllaccptedfrinds(req: Request, res: Response): Promise<void>;
    addFriendRequest(requestData: any, res: Response): Promise<Response<any, Record<string, any>>>;
    cancelFriendRequest(requestData: any, res: Response): Promise<Response<any, Record<string, any>>>;
    acceptFriendRequest(requestData: any, res: Response): Promise<Response<any, Record<string, any>>>;
    blockUser(requestData: any, res: Response): Promise<Response<any, Record<string, any>>>;
    unblockUser(requestData: any, res: Response): Promise<Response<any, Record<string, any>>>;
    search(query: string): Promise<{
        results: {
            id: number;
            nickname: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            hashedRt: string;
            avatar: string;
            password: string;
            updateState: boolean;
            state: import(".prisma/client").$Enums.State;
            faState: boolean;
            twoFactorEnabled: boolean;
            is2FAuthenticated: boolean;
            twoFactorSecret: string;
            wins: number;
            loses: number;
        }[];
    }>;
    handleFortyTwoLogin(): {
        message: string;
    };
    handleFortyTwoRedirect(req: Request, res: Response): Promise<void>;
    handleLogin(): {
        mes: string;
    };
    handleGoogleRedirect(req: Request, res: Response): Promise<void>;
    singupLocal(dto: AuthDto, res: Response): Promise<void>;
    singinLocal(dto: AuthDto, res: Response): Promise<void>;
    logout(res: Response): Promise<void>;
    refresh(req: Request): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getAllFrienfImSendRequest(body: any, res: Response, req: Request): Promise<void>;
    getNotification(req: Request, res: Response): Promise<void>;
    getNotificationByread(req: Request, res: Response): Promise<void>;
    editProfile(editProfileDto: EditProfileDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    editUpdate(updateDto: updateDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getStatus(body: any): Promise<{
        message: string;
    }>;
    getUserByNickname(nickname: string, res: Response): Promise<Response<any, Record<string, any>>>;
    uploadPhoto(body: any, req: Request, url: string, res: Response): Promise<Response<any, Record<string, any>>>;
    findOneFriend(body: any, res: Response): Promise<Response<any, Record<string, any>>>;
}

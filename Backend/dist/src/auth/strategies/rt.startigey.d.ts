import { Request } from 'express';
import { Strategy } from 'passport-jwt';
declare const RtStrategy_base: new (...args: any[]) => Strategy;
export declare class RtStrategy extends RtStrategy_base {
    constructor();
    validate(req: Request, payload: any): any;
}
export {};

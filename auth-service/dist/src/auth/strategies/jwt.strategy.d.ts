import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        provider: any;
        firstName: any;
        lastName: any;
        avatar: any;
    }>;
}
export {};

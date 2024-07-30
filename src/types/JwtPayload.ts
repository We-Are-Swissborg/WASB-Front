export type JwtPayload = {
    userId: number;
    roles: string[];
    username: string;
    wallet: string;
    iat: number;
    exp: number;
};

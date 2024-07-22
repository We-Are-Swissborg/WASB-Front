export type JwtPayload = {
    userId: number;
    roles: [];
    username: string;
    wallet: string;
    iat: number;
    exp: number;
};

import { JwtPayload } from '../types/JwtPayload';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode<JwtPayload>(token);
        if (!exp) return true;
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
};

const tokenDecoded = (token: string): JwtPayload => {
    return jwtDecode<JwtPayload>(token);
};

export { isTokenExpired, tokenDecoded };

import { JwtPayload } from '../types/JwtPayload';
import { jwtDecode } from 'jwt-decode';
import { postFetch } from './baseAPI.services';

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

const getNewToken = async (oldToken: string) => {
    const url = 'refresh'; 
    const decodedRefreshToken = jwtDecode<JwtPayload>(oldToken);
    const userInfo = {
        userId: decodedRefreshToken.userId,
        username: decodedRefreshToken.username,
    } 
    const res = await postFetch(url, JSON.stringify({userInfo}));
    const json = await res.json();
    return json;
};

const generateNewToken = async (setToken: (newToken: string) => void) => {
    const oldToken = localStorage.getItem('authToken');
    const res = await getNewToken(oldToken!);

    if(res.token) {
        setToken(res.token);
        localStorage.setItem('authToken', res.token);
    }
    else console.error('Error with generateNewToken :', res.message);
}

export { isTokenExpired, tokenDecoded, getNewToken, generateNewToken };

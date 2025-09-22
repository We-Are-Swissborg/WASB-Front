import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { isTokenExpired, tokenDecoded, getNewToken } from '../services/token.services';

type AuthContextType = {
    isAuthenticated: boolean;
    token?: string | null;
    username?: string;
    roles?: string[];
    setToken: (newToken: string) => void;
    login: (newToken: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
    const [username, setUsername] = useState<string>();
    const [roles, setRoles] = useState<string[]>();

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('authToken', newToken);
        const payload = tokenDecoded(newToken);
        setUsername(payload.username);
        setRoles(payload.roles);
    };
    const logout = () => {
        setToken(null);
        setUsername(undefined);
        setRoles([]);
        localStorage.removeItem('authToken');
    };

    const generateNewToken = async () => {
        const oldToken = localStorage.getItem('authToken');
        const res = await getNewToken(oldToken!);
        if(!res.token) console.error('Error with newToken :', res.message);
        return res.token;
    };

    const isAuthenticated = !!token;

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken && !isTokenExpired(storedToken)) {
            login(storedToken);
        } else if (storedToken && isTokenExpired(storedToken as string)) {
            generateNewToken().then((newToken: string) => {
                if(newToken) {
                    login(newToken);
                };
            });
        } else {
            logout();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, roles, token, login, logout, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UseAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('UseAuth must be used within an AuthProvider');
    }
    return context;
};

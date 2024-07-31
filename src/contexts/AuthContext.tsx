import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { isTokenExpired, tokenDecoded } from '../services/token.services';

type AuthContextType = {
    isAuthenticated: boolean;
    token?: string | null;
    username?: string;
    roles?: string[];
    login: (newToken: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
    const [username, setUsername] = useState<string>();
    const [roles, setRoles] = useState<string[]>();

    const login = (newToken: string): void => {
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

    const isAuthenticated = !!token;

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken && !isTokenExpired(storedToken)) {
            login(storedToken);
        } else {
            logout();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, roles, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

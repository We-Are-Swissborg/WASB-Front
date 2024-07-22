import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { isTokenExpired, tokenDecoded } from '../services/token.services';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

type AuthContextType = {
    isAuthenticated: boolean;
    token: string | null;
    username: string | null;
    login: (newToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation('global');
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
    const [username, setUsername] = useState<string | null>(null);

    const login = (newToken: string): void => {
        setToken(newToken);
        localStorage.setItem('authToken', newToken);
        const payload = tokenDecoded(newToken);
        setUsername(payload.username);
        toast.success(t('authenticate.welcome') + ` ${payload.username}`);
    };
    const logout = () => {
        setToken(null);
        setUsername(null);
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

    return <AuthContext.Provider value={{ isAuthenticated, username, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

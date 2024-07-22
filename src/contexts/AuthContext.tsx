import { createContext, useState, FC, ReactNode, SetStateAction, Dispatch } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>; 
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => null,
});

export const AuthProvider: FC<{children: ReactNode}> = ({children}) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
};
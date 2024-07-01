/* eslint-disable no-unused-vars */
import { createContext, useState, useContext, ReactNode, FC } from 'react';

// Définir les types pour le contexte
interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

// Créer le contexte avec des valeurs par défaut
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Créer un hook personnalisé pour utiliser le contexte de chargement
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

// Créer un provider pour envelopper l'application
export const LoadingProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

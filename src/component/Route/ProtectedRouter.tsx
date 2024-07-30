import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type ProtectedRouteProps = {
    element: JSX.Element;
    role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, role }) => {
    const { isAuthenticated, roles } = useAuth();

    if(!role) {
        console.log('Pas de role définis, alors je vérifie juste si tu es auth');
        return isAuthenticated ? element : <Navigate to="/login" />;
    }
    else {
        console.log('Role définis, alors je vérifie si tu as le droits');
        return roles?.includes(role) ? element : <Navigate to="/login" />;
    }
};

export default ProtectedRoute;

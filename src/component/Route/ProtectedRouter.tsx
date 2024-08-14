import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Role from '../../types/Role';

type ProtectedRouteProps = {
    element: JSX.Element;
    requiredRole?: string[];
};

/**
 * Enables the route to be taken by the user to be secured
 * @param param The component that will be displayed and the role you need to have to access it.
If no role is defined, we just check that it is authenticated. 
 * @returns The component or redirect user to login
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
    const { isAuthenticated, roles } = useAuth();

    if (!requiredRole) {
        return isAuthenticated ? element : <Navigate to="/login" />;
    } else {
        const admin = requiredRole.find((role) => role === Role.Admin);
        const moderator =  requiredRole.find((role) => role === Role.Moderator);
        const memberAndUser =  requiredRole.find((role) => role === Role.Member || role === Role.User);

        return roles?.includes(admin || moderator || memberAndUser || '') ? element : <Navigate to="/login" />;
    }
};

export default ProtectedRoute;

import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from '../../contexts/AuthContext';

type ProtectedRouteProps = {
    element: JSX.Element;
    role?: string;
};

/**
 * Enables the route to be taken by the user to be secured
 * @param param The component that will be displayed and the role you need to have to access it.
If no role is defined, we just check that it is authenticated. 
 * @returns The component or redirect user to login
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, role }) => {
    const { isAuthenticated, roles } = UseAuth();

    if (!role) {
        return isAuthenticated ? element : <Navigate to="/login" />;
    } else {
        return roles?.includes(role) ? element : <Navigate to="/login" />;
    }
};

export default ProtectedRoute;

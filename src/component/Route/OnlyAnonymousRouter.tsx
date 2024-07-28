import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type OnlyAnonymousRouterRouteProps = {
    element: JSX.Element;
};

const OnlyAnonymousRouter: React.FC<OnlyAnonymousRouterRouteProps> = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" /> : element;
};

export default OnlyAnonymousRouter;

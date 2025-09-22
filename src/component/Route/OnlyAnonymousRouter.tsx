import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from '../../contexts/AuthContext';

type OnlyAnonymousRouterRouteProps = {
    element: JSX.Element;
};

const OnlyAnonymousRouter: React.FC<OnlyAnonymousRouterRouteProps> = ({ element }) => {
    const { isAuthenticated } = UseAuth();
    return isAuthenticated ? <Navigate to="/" /> : element;
};

export default OnlyAnonymousRouter;

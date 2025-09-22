import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../contexts/AuthContext';

const Logout: React.FC = () => {
    const { logout } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return null;
};

export default Logout;

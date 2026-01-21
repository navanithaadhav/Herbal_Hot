import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
    const { userInfo } = useAuthStore();

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;

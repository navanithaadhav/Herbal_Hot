import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const OrderRedirect: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    return <Navigate to={`/orders/${id}`} replace />;
};

export default OrderRedirect;

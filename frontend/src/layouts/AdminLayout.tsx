import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar (Fixed) */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;

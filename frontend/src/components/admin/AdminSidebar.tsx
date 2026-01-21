import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    LogOut,
    MessageSquare,

    Home
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import toast from 'react-hot-toast';

const AdminSidebar: React.FC = () => {
    const { logout } = useAuthStore();
    const { clearCart } = useCartStore();
    const { clearWishlist } = useWishlistStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        clearCart();
        clearWishlist();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/userlist', icon: Users, label: 'Users' },
        { path: '/admin/productlist', icon: ShoppingBag, label: 'Products' },
        { path: '/admin/orderlist', icon: Package, label: 'Orders' },
        { path: '/admin/reviewlist', icon: MessageSquare, label: 'Reviews' },
    ];

    return (
        <aside className="bg-white w-64 min-h-screen border-r border-gray-200 hidden md:flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600 tracking-wide">Admin<span className="text-gray-900">Panel</span></span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-red-50 text-red-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 space-y-2">
                <NavLink
                    to="/"
                    className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Home className="h-5 w-5 mr-3" />
                    Back to Home
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;

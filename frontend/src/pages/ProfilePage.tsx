import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import api from '../api/axios';
import { Loader2, Package, User, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
}

interface Order {
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;

    orderItems: OrderItem[];
}



const ProfilePage: React.FC = () => {
    const { userInfo, logout, setCredentials } = useAuthStore();
    const { clearCart } = useCartStore();
    const { clearWishlist } = useWishlistStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('orders');

    // Update Profile State
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name);
            const fetchOrders = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await api.get('/orders/myorders', config);
                    setOrders(data);
                } catch {

                    toast.error('Failed to fetch orders');
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }
    }, [userInfo, navigate]);

    const handleLogout = () => {
        logout();
        clearCart();
        clearWishlist();
        navigate('/');
    };

    const updateProfileHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setUpdating(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };
            const { data } = await api.put('/users/profile', { name, password }, config);
            setCredentials(data);
            toast.success('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (!userInfo) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col items-center">
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-3">
                                <User className="h-8 w-8" />
                            </div>
                            <h2 className="font-bold text-gray-900">{userInfo.name}</h2>
                            <p className="text-sm text-gray-500">{userInfo.email}</p>
                        </div>
                        <nav className="p-2 space-y-1">
                            {/* <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'overview' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <LayoutDashboard className="h-4 w-4 mr-3" />
                                Overview
                            </button> */}
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Package className="h-4 w-4 mr-3" />
                                My Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Settings className="h-4 w-4 mr-3" />
                                Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors mt-4"
                            >
                                <LogOut className="h-4 w-4 mr-3" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Order History</h2>
                            </div>
                            <div className="p-6">
                                {loadingOrders ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-red-600 h-8 w-8" /></div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                        <p>No orders found.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative flex flex-col">
                                                {/* Status Badges */}
                                                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-sm shadow-sm ${order.isPaid ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-sm shadow-sm ${order.isDelivered ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                                    </span>
                                                </div>

                                                {/* Order Image (First Item) */}
                                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                                    {order.orderItems && order.orderItems.length > 0 ? (
                                                        <img
                                                            src={order.orderItems[0].image}
                                                            alt={order.orderItems[0].name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Package className="h-12 w-12" />
                                                        </div>
                                                    )}
                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                                    <div className="absolute bottom-3 left-3 text-white">
                                                        <p className="text-sm font-medium opacity-90">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>

                                                {/* Order Details */}
                                                <div className="p-4 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="text-gray-900 font-bold text-lg">Order #{order._id.substring(20)}</h3>
                                                                <p className="text-sm text-gray-500">
                                                                    {order.orderItems.length} {order.orderItems.length === 1 ? 'Item' : 'Items'}
                                                                </p>
                                                            </div>
                                                            <p className="text-red-600 font-bold text-lg">
                                                                ₹{order.totalPrice.toFixed(2)}
                                                            </p>
                                                        </div>

                                                        {/* Preview of Item Names (Optional, shows first 1-2 items) */}
                                                        <div className="mt-2 text-xs text-gray-500 line-clamp-2">
                                                            {order.orderItems.map(item => item.name).join(', ')}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => navigate(`/orders/${order._id}`)}
                                                        className="w-full mt-4 border border-gray-200 text-gray-700 py-2 rounded-md font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <span>View Order Details</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
                            </div>
                            <div className="p-6 max-w-lg">
                                <form onSubmit={updateProfileHandler} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400">@</div>
                                            <input
                                                type="email"
                                                value={userInfo.email}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Email functionality is managed by admin.</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Leave blank to keep current"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                        >
                                            {updating && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

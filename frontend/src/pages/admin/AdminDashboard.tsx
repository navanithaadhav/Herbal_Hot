import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Package, DollarSign, Loader2, Clock } from 'lucide-react';
import SalesChart from '../../components/admin/SalesChart';
import TopProductsChart from '../../components/admin/TopProductsChart';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    topProducts: any[];
}

interface SalesData {
    _id: string;
    sales: number;
    orders: number;
}

interface TopProductData {
    _id: string;
    name: string;
    totalSold: number;
}

interface Order {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    totalPrice: number;
    isPaid: boolean;
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [topProductsData, setTopProductsData] = useState<TopProductData[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [salesRange, setSalesRange] = useState('all');
    const [topProductsRange, setTopProductsRange] = useState('all');
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuthStore();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };
                const { data } = await api.get('/orders/stats', config);
                console.log('Frontend received stats:', data);
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, [userInfo]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                    params: { range: salesRange }
                };
                const { data } = await api.get('/orders/analytics/sales', config);
                setSalesData(data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };
        if (userInfo) fetchSalesData();
    }, [userInfo, salesRange]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                    params: { range: topProductsRange }
                };
                const { data } = await api.get('/orders/analytics/products', config);
                setTopProductsData(data);
            } catch (error) {
                console.error('Error fetching top products:', error);
            }
        };
        if (userInfo) fetchTopProducts();
    }, [userInfo, topProductsRange]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` }
                };
                const { data } = await api.get('/orders', config);
                // Sort by date desc and take first 5
                const sorted = data.sort((a: Order, b: Order) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ).slice(0, 5);
                setRecentOrders(sorted);
            } catch (error) {
                console.error('Error fetching recent orders:', error);
            }
        };
        if (userInfo) fetchRecentOrders();
    }, [userInfo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, {userInfo?.name}</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium text-gray-600">server: online</span>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalUsers || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalProducts || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalOrders || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats?.totalRevenue.toLocaleString() || 0}</p>
                </div>
            </div>

            {/* Charts & Quick Links Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Charts */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Sales Chart */}
                    <SalesChart
                        data={salesData}
                        range={salesRange}
                        setRange={setSalesRange}
                    />

                    {/* Top Products Chart */}
                    <TopProductsChart
                        data={topProductsData}
                        range={topProductsRange}
                        setRange={setTopProductsRange}
                    />
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link to="/admin/productlist" className="block w-full text-center py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200">
                                Manage Products
                            </Link>
                            <Link to="/admin/userlist" className="block w-full text-center py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200">
                                Manage Users
                            </Link>
                            <Link to="/admin/orderlist" className="block w-full text-center py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200">
                                View Orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        Recent Orders
                    </h3>
                    <Link to="/admin/orderlist" className="text-sm text-red-600 hover:text-red-700 font-medium">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{order._id.substring(order._id.length - 6)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{order.user?.name || 'Deleted User'}</span>
                                            <span className="text-xs text-gray-400">{order.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₹{order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                                        No orders found recently.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

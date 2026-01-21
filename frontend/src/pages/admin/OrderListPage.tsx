import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Loader2, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
}

const SortIcon = ({ column, sortConfig }: { column: string, sortConfig: { key: string; direction: string } }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc'
        ? <ArrowUp size={14} className="ml-1 text-indigo-600" />
        : <ArrowDown size={14} className="ml-1 text-indigo-600" />;
};

const OrderListPage: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuthStore();

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, paid, unpaid, delivered, not-delivered

    // Sort State
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order | 'createdAt' | 'user'; direction: 'asc' | 'desc' }>({
        key: 'createdAt',
        direction: 'desc'
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                const { data } = await api.get('/orders', config);
                setOrders(data);
                setLoading(false);
                setLoading(false);
            } catch {
                toast.error('Failed to fetch orders');
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userInfo]);

    // Handle Sorting
    const handleSort = (key: keyof Order | 'createdAt' | 'user') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and Sort Logic
    const processedOrders = useMemo(() => {
        let result = [...orders];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(order =>
                order._id.toLowerCase().includes(lowerTerm) ||
                order.user?.name.toLowerCase().includes(lowerTerm) ||
                order.user?.email.toLowerCase().includes(lowerTerm) ||
                (order.paymentResult?.id && order.paymentResult.id.toLowerCase().includes(lowerTerm))
            );
        }

        // 2. Filter
        if (statusFilter !== 'all') {
            switch (statusFilter) {
                case 'paid':
                    result = result.filter(order => order.isPaid);
                    break;
                case 'unpaid':
                    result = result.filter(order => !order.isPaid);
                    break;
                case 'delivered':
                    result = result.filter(order => order.isDelivered);
                    break;
                case 'not-delivered':
                    result = result.filter(order => !order.isDelivered);
                    break;
            }
        }

        // 3. Sort
        result.sort((a, b) => {
            if (sortConfig.key === 'user') {
                const nameA = a.user?.name.toLowerCase() || '';
                const nameB = b.user?.name.toLowerCase() || '';
                return sortConfig.direction === 'asc'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            }

            const valA = a[sortConfig.key as keyof Order];
            const valB = b[sortConfig.key as keyof Order];

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortConfig.direction === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
            }
            return 0;
        });

        return result;
    }, [orders, searchTerm, statusFilter, sortConfig]);



    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Order ID, Customer, Transaction ID..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-80 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm appearance-none bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="delivered">Delivered</option>
                            <option value="not-delivered">Not Delivered</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
            ) : (
                <div className="bg-white shadow-md overflow-hidden rounded-xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th
                                        onClick={() => handleSort('_id')}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="flex items-center">ID <SortIcon column="_id" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('user')}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center">Customer <SortIcon column="user" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th
                                        onClick={() => handleSort('createdAt')}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center">Date <SortIcon column="createdAt" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('totalPrice')}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center">Total <SortIcon column="totalPrice" sortConfig={sortConfig} /></div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {processedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                            No orders found matching your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    processedOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            {/* ID Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                                #{order._id.substring(20)}
                                            </td>

                                            {/* Customer Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{order.user?.name}</span>
                                                    <span className="text-xs text-gray-500">{order.user?.email}</span>
                                                    <span className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]" title={order.shippingAddress?.address}>
                                                        {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Amount/Method Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">₹{order.totalPrice}</span>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="text-xs text-gray-500">{order.paymentMethod}</span>
                                                        {order.paymentResult?.id && (
                                                            <span className="text-[10px] bg-gray-100 px-1 py-0.5 rounded text-gray-500 font-mono" title={`ID: ${order.paymentResult.id}`}>
                                                                {order.paymentResult.id.substring(0, 8)}...
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                                <br />
                                                <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>

                                            {/* Total Column (Duplicated in Amount? No, this is for sorting sort of) -> Actually I merged amount/method visuals but kept columns. Let's fix headers. 
                                               Original headers: ID, User, Address, Method, Date, Total, Paid, Delivered
                                               My new headers: ID, Customer, Amount, Date, Total(dup?), Status
                                               Let's simplify: ID, Customer, Payment Info (Amt+Method), Date, Status, Action
                                            */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {/* Keeping Total Separate for sorting clarity or verify consistency */}
                                                ₹{order.totalPrice}
                                            </td>

                                            {/* Status Column (Combined Paid/Delivered) */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Action Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/orders/${order._id}`)}
                                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-95"
                                                >
                                                    View Order
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination Placeholder */}
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{processedOrders.length}</span> of <span className="font-medium">{orders.length}</span> results
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderListPage;

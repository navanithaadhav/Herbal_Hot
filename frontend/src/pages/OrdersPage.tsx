import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Loader2, Package } from 'lucide-react';
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

const OrdersPage: React.FC = () => {
    const { userInfo } = useAuthStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await api.get('/orders/myorders', config);
                setOrders(data);
            } catch (_err) {
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userInfo, navigate]);

    if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-10 w-10 text-yellow-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-medium text-gray-900">No orders yet</h3>
                    <p className="text-gray-500 mt-2">Start shopping to see your orders here.</p>
                    <button onClick={() => navigate('/products')} className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order #{order._id}</p>
                                        <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {order.isPaid ? 'Paid' : 'Payment Pending'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.isDelivered ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        {order.orderItems.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                <span className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-1">{item.qty}x</span>
                                            </div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-xs font-medium">
                                                +{order.orderItems.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-lg font-bold text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                                        <button
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;

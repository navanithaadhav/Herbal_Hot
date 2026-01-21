import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Loader2, ArrowLeft, Package, CreditCard, Truck } from 'lucide-react';
import OrderTimeline from '../components/OrderTimeline';
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
    orderItems: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    isShipped: boolean;
    shippedAt?: string;
    status: string;
    createdAt: string;
}

const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { userInfo } = useAuthStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDeliver, setLoadingDeliver] = useState(false);
    const [loadingShipped, setLoadingShipped] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };
                const { data } = await api.get(`/orders/${id}`, config);
                setOrder(data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Failed to fetch order');
            } finally {
                setLoading(false);
            }
        };

        if (userInfo && id) {
            fetchOrder();
        }
    }, [userInfo, id]);

    const deliverHandler = async () => {
        try {
            setLoadingDeliver(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };
            await api.put(`/orders/${id}/deliver`, {}, config);
            setLoadingDeliver(false);
            toast.success('Order marked as delivered');
            window.location.reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message);
            setLoadingDeliver(false);
        }
    };

    const shipHandler = async () => {
        try {
            setLoadingShipped(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };
            await api.put(`/orders/${id}/ship`, {}, config);
            setLoadingShipped(false);
            toast.success('Order marked as shipped');
            window.location.reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message);
            setLoadingShipped(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
                <Link to="/profile" className="text-red-600 hover:text-red-700 mt-4 inline-block">
                    Go Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/profile" className="inline-flex items-center text-gray-600 hover:text-red-600 mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        Order #{order._id.substring(20)}
                        <span className={`text-sm px-3 py-1 rounded-full border ${order.isDelivered ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                            {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                {/* Placeholder for actions like Invoice Download */}
                {/* <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                    Download Invoice
                </button> */}
            </div>

            <OrderTimeline
                isPaid={order.isPaid}
                paidAt={order.paidAt}
                isShipped={order.isShipped}
                shippedAt={order.shippedAt}
                isDelivered={order.isDelivered}
                deliveredAt={order.deliveredAt}
                createdAt={order.createdAt}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-2" />
                            <h2 className="font-bold text-gray-900">Items</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="p-6 flex items-center gap-4">
                                    <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <Link to={`/products/${item.product}`} className="font-medium text-gray-900 hover:text-red-600 transition-colors">
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">Quantity: {item.qty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">₹{(item.price * item.qty).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">₹{item.price} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center mb-4">
                                <Truck className="h-5 w-5 text-gray-400 mr-2" />
                                <h2 className="font-bold text-gray-900">Shipping Details</h2>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{userInfo?.name}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    Status: {order.isDelivered ? `Delivered at ${new Date(order.deliveredAt!).toLocaleDateString()}` : 'Not Delivered'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center mb-4">
                                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                                <h2 className="font-bold text-gray-900">Payment Info</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Method: <span className="font-medium text-gray-900">{order.paymentMethod}</span></p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    Status: {order.isPaid ? `Paid at ${new Date(order.paidAt!).toLocaleDateString()}` : 'Not Paid'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>₹{order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>₹{order.taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-bold text-gray-900 text-base">Total</span>
                                <span className="font-bold text-red-600 text-xl">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {userInfo && userInfo.role === 'admin' && order.isPaid && !order.isShipped && (
                            <div className="border-t border-gray-200 pt-4">
                                <button
                                    onClick={shipHandler}
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center"
                                    disabled={loadingShipped}
                                >
                                    {loadingShipped ? <Loader2 className="animate-spin h-5 w-5" /> : 'Mark As Shipped'}
                                </button>
                            </div>
                        )}

                        {userInfo && userInfo.role === 'admin' && !order.isDelivered && (
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <button
                                    onClick={deliverHandler}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {loadingDeliver ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Mark As Delivered'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import CheckoutSteps from '../components/CheckoutSteps';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: new (options: any) => any;
    }
}

const PlaceOrderPage: React.FC = () => {
    const navigate = useNavigate();
    const cart = useCartStore();
    const { userInfo } = useAuthStore();

    const [loading, setLoading] = useState(false);

    // Calculate prices
    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping > 500
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% Tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.shippingAddress, cart.paymentMethod, navigate]);

    const placeOrderHandler = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            const { data } = await api.post(
                '/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: itemsPrice,
                    shippingPrice: shippingPrice,
                    taxPrice: taxPrice,
                    totalPrice: totalPrice,
                },
                config
            );

            if (cart.paymentMethod === 'Razorpay') {
                const loadRazorpayScript = () => {
                    return new Promise((resolve) => {
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.onload = () => resolve(true);
                        script.onerror = () => resolve(false);
                        document.body.appendChild(script);
                    });
                };

                const res = await loadRazorpayScript();

                if (!res) {
                    toast.error('Razorpay SDK failed to load. Are you online?');
                    setLoading(false);
                    return;
                }

                // Fetch Key ID
                const { data: { keyId } } = await api.get('/config/razorpay');

                const options = {
                    key: keyId,
                    amount: data.totalPrice * 100,
                    currency: 'INR',
                    name: 'Masala Store',
                    description: 'Order Payment',
                    order_id: data.razorpayOrderId,
                    handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
                        try {
                            const paymentResult = {
                                id: response.razorpay_payment_id,
                                status: 'COMPLETED',
                                update_time: new Date().toISOString(),
                                email_address: userInfo?.email,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            };

                            await api.put(`/orders/${data._id}/pay`, paymentResult, config);

                            cart.clearCart();
                            // toast.success('Payment Successful'); // Moved to Home Page logic
                            navigate('/?paymentSuccessful=true', { replace: true });
                        } catch (error) {
                            console.error(error);
                            toast.error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: userInfo?.name,
                        email: userInfo?.email,
                        contact: '', // could be added to user profile
                    },
                    theme: {
                        color: '#dc2626',
                    },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

                // Keep loading false here? Modal opens.
                // Ideally we should wait, but Razorpay is async via callback.
                setLoading(false);
            } else {
                cart.clearCart();
                // toast.success('Order placed successfully'); // Moved to Home Page logic
                navigate('/?paymentSuccessful=true', { replace: true });
                setLoading(false);
            }

        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to place order';
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CheckoutSteps step1 step2 step3 step4 />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping</h2>
                        <p className="text-gray-600">
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                        <p className="text-gray-600">
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center space-x-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                            <Link to={`/products/${item.product}`} className="text-gray-800 hover:text-red-600 font-medium">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-gray-600">
                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>${itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-gray-900 text-lg">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="w-full mt-6 bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                            disabled={cart.cartItems.length === 0 || loading}
                            onClick={placeOrderHandler}
                        >
                            {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;

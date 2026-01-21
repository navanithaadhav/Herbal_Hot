import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentPage: React.FC = () => {
    const cart = useCartStore();
    const { shippingAddress } = cart;
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        cart.savePaymentMethod(paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 step3 />
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h1>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="Razorpay"
                                name="paymentMethod"
                                value="Razorpay"
                                checked={paymentMethod === 'Razorpay'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <label htmlFor="Razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                                Razorpay / UPI / Cards
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="COD"
                                name="paymentMethod"
                                value="CashOnDelivery"
                                checked={paymentMethod === 'CashOnDelivery'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <label htmlFor="COD" className="ml-3 block text-sm font-medium text-gray-700">
                                Cash on Delivery
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;

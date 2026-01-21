import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, addToCart } = useCartStore();
    const navigate = useNavigate();

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                                <div className="flex items-center space-x-4 w-full sm:w-auto">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                    <div>
                                        <Link to={`/products/${item.product}`} className="text-lg font-medium text-gray-900 hover:text-red-600 transition-colors">
                                            {item.name}
                                        </Link>
                                        <p className="text-gray-500">₹{item.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button
                                            className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                            onClick={() => addToCart({ ...item, qty: Math.max(1, item.qty - 1) })}
                                            disabled={item.qty <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="px-3 py-1 font-medium">{item.qty}</span>
                                        <button
                                            className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                            onClick={() => addToCart({ ...item, qty: Math.min(item.countInStock, item.qty + 1) })}
                                            disabled={item.qty >= item.countInStock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 h-fit border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                        <div className="flex justify-between items-center mb-4 text-gray-700">
                            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                            <span>₹{calculateTotal()}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-4 mb-6">
                            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                        </div>
                        <button
                            onClick={checkoutHandler}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;

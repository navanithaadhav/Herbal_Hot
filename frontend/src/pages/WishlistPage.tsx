import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, HeartOff } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const WishlistPage: React.FC = () => {
    const { wishlistItems, removeFromWishlist } = useWishlistStore();
    const { addToCart } = useCartStore();

    const handleAddToCart = (item: any) => {
        addToCart({
            product: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            countInStock: item.countInStock || 10, // Default fallback
            qty: 1,
        });
        removeFromWishlist(item._id);
        toast.success('Moved to cart');
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <HeartOff className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-8">Browse our spices and add your favorites here!</p>
                <Link
                    to="/products"
                    className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist ({wishlistItems.length})</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-white p-4">
                            <Link to={`/products/${item._id}`}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                            <button
                                onClick={() => removeFromWishlist(item._id)}
                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-600 transition-colors"
                                title="Remove from Wishlist"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-4 border-t border-gray-50">
                            <div className="mb-2">
                                <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                                    {item.category}
                                </span>
                            </div>
                            <Link to={`/products/${item._id}`}>
                                <h3 className="font-medium text-gray-900 mb-2 truncate hover:text-red-600 transition-colors">
                                    {item.name}
                                </h3>
                            </Link>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="flex items-center space-x-1 text-sm font-medium text-white bg-red-600 px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>Add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;

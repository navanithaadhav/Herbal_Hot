import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Loader2, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

import AboutSection from '../components/AboutSection';
import ReviewSection from '../components/ReviewSection';

import heroBg from '../assets/images/background.webp';

interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    category: string;
    countInStock: number;
    rating?: number;
    numReviews?: number;
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { addToCart } = useCartStore();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
                setLoading(false);
            } catch {
                setError('Failed to load products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchParams.get('paymentSuccessful') === 'true') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowSuccessModal(true);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('paymentSuccessful');
            setSearchParams(newParams);
            toast.success('Payment Successful!');
        }
    }, [searchParams, setSearchParams]);

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.countInStock === 0) {
            toast.error('Out of stock');
            return;
        }
        addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty: 1
        });
        toast.success('Added to cart');
    };

    const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist({
                _id: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                category: product.category,
                countInStock: product.countInStock
            });
            toast.success('Added to wishlist');
        }
    };

    const handleViewProduct = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        navigate(`/products/${id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin text-yellow-600 h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500 text-xl font-semibold">
                {error}. Please try again later.
            </div>
        );
    }

    return (
        <div className="font-sans relative">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-in zoom-in-95 duration-300 relative">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                        <p className="text-gray-600 mb-8">
                            Thank you for shopping. Your order has been placed successfully.
                        </p>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-700 transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative h-[500px] md:h-[600px] bg-[#0f172a] text-white flex items-center justify-center overflow-hidden">
                <img
                    src={heroBg}
                    alt="Hero Background"
                    fetchPriority="high"
                    width="1920"
                    height="600"
                    className="absolute inset-0 z-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-black/30 z-0"></div>

                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-white">
                        The Secret Behind Every Perfect Dish.
                    </h1>
                    <p className="text-xl md:text-2xl text-white mb-6 font-medium drop-shadow-lg">
                        Authentic spices that turn everyday cooking into something special.
                    </p>
                    <p className="text-lg md:text-2xl text-yellow-400 font-bold tracking-wide mb-2 drop-shadow-lg">
                        No mixes. No shortcuts. Only pure, powerful flavours.
                    </p>
                    <Link
                        to="/products"
                        className="inline-block mt-8 px-10 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                        SHOP NOW
                    </Link>
                </div>
            </section>

            {/* Best Products Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                            Best Products
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 transform translate-y-3"></span>
                        </h2>
                        <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
                            Hand-picked premium spices for your everyday cooking needs.
                        </p>

                        <div className="flex justify-center gap-4 mt-8">
                            <button className="px-6 py-2 bg-yellow-500 text-white rounded-full font-medium shadow-md">New Trends</button>
                            <button className="px-6 py-2 bg-white border border-gray-300 text-gray-600 rounded-full font-medium hover:bg-gray-50">Spicy Masalas</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="group text-center cursor-pointer"
                                onClick={() => navigate(`/products/${product._id}`)}
                            >
                                {/* Circular Image Container */}
                                <div className="relative mx-auto w-58 h-58 mb-6">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 shadow-lg group-hover:border-gray-200 transition-all duration-300 bg-gray-100 aspect-square">
                                        <img
                                            src={product.image}
                                            alt=""
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://placehold.co/400x400/e2e8f0/1e293b?text=Spice+Image';
                                            }}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    {/* Quick Actions Hover */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="p-2 bg-white text-gray-800 rounded-full shadow hover:bg-yellow-500 hover:text-white transition-colors"
                                            title="Add to Cart"
                                            aria-label="Add to Cart"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => handleWishlistToggle(e, product)}
                                            className={`p-2 rounded-full shadow transition-colors ${isInWishlist(product._id)
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'bg-white text-gray-800 hover:bg-red-500 hover:text-white'
                                                }`}
                                            title="Add to Wishlist"
                                            aria-label="Add to Wishlist"
                                        >
                                            <Heart size={18} className={isInWishlist(product._id) ? 'fill-current' : ''} />
                                        </button>
                                        <button
                                            onClick={(e) => handleViewProduct(e, product._id)}
                                            className="p-2 bg-white text-gray-800 rounded-full shadow hover:bg-blue-500 hover:text-white transition-colors"
                                            title="View Details"
                                            aria-label="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">{product.name}</h3>
                                <p className="text-yellow-600 font-bold mt-1 text-lg">₹{product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <AboutSection />

            {/* Dark Promotional Banner */}
            <section className="bg-[#1e293b] py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <img src="https://cdn-icons-png.flaticon.com/512/706/706164.png" alt="Spice" className="w-64 h-64 animate-spin-slow" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between relative z-10">
                    <div className="mb-8 md:mb-0 md:w-1/2">
                        <span className="text-yellow-500 font-bold tracking-wider uppercase mb-2 block">Special Offer</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Get 10% off<br />
                            <span className="text-gray-400 font-light">On all Spicy & Herbs</span>
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Experience the authentic flavors of nature with our premium collection of organic spices and herbs today.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded shadow-lg transition-colors">
                                BUY NOW
                            </button>
                            <button className="px-8 py-3 border border-gray-500 text-white hover:border-white transition-colors rounded">
                                VIEW ALL
                            </button>
                        </div>
                    </div>

                    {/* Floating Spices/Image Area */}
                    <div className="md:w-1/2 flex justify-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-yellow-500/20 rounded-full blur-xl"></div>
                            <img
                                src={heroBg}
                                alt="Spices"
                                className="relative rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 w-80 md:w-96"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <ReviewSection />

            {/* Related/Bottom Products */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                        <Link to="/products" className="text-yellow-600 font-medium hover:text-yellow-700">View All &rarr;</Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {products.slice(0, 4).map((product) => (
                            <div
                                key={`rel-${product._id}`}
                                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/products/${product._id}`)}
                            >
                                <div className="h-40 w-40 mx-auto rounded-full overflow-hidden mb-4 bg-gray-100 aspect-square">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://placehold.co/400x400/e2e8f0/1e293b?text=Spice+Image';
                                        }}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-yellow-600 font-bold mt-1">₹{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

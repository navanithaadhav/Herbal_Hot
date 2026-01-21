import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import {
    ShoppingCart,
    Plus,
    Minus,
    Loader2,
    Star,
    Heart,
    ShieldCheck,
    Truck,
    RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface Product {
    _id: string;
    name: string;
    image: string;
    images?: string[];
    price: number;
    category: string;
    weight?: string;
    countInStock: number;
    description: string;
    reviews: Review[];
    rating: number;
    numReviews: number;
}

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'ingredients'>('description');

    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    const { userInfo } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState('');

    // Reset selected image when product changes: handled by key={id} in parent or manual reset
    useEffect(() => {
        setSelectedImage('');
    }, [id]);

    const addToCart = useCartStore((state) => state.addToCart);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    const submitReviewHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };
            await api.post(`/products/${id}/reviews`, { rating, comment }, config);
            toast.success('Review submitted successfully');
            setComment('');
            setRating(5);
            // Reload product to show new review
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
            setSubmitLoading(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // Fetch main product
                const { data: productData } = await api.get(`/products/${id}`);
                setProduct(productData);

                // Fetch all products to filter for related (Simulation of related products API)
                const { data: allProducts } = await api.get('/products');
                const related = allProducts
                    .filter((p: Product) => p.category === productData.category && p._id !== productData._id)
                    .slice(0, 4);
                setRelatedProducts(related);

                setLoading(false);
            } catch (err) {
                setError('Product not found');
                setLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        console.log('Handle Add To Cart Clicked', product);
        if (product) {
            console.log('Adding product to store:', product._id, qty);
            addToCart({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                countInStock: product.countInStock,
                qty: qty,
            });
            console.log('Action dispatched');
            toast.success('Added to cart!');
        } else {
            console.error('Product is null, cannot add to cart');
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600 h-10 w-10" /></div>;
    if (error) return <div className="text-center py-20 text-red-500 text-xl">{error}</div>;
    if (!product) return null;

    // Calculate discount (fake logic for demo if MRP is missing)
    const originalPrice = Math.round(product.price * 1.25);
    const discountPercentage = 20;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
            {/* Breadcrumb / Back */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-red-600">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-red-600">Spices</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
            </nav>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-lg border border-gray-100 flex items-center justify-center relative overflow-hidden group">
                            <img
                                src={selectedImage || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    {discountPercentage}% OFF
                                </span>
                            </div>
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 rounded-md border p-2 flex-shrink-0 transition-all ${(selectedImage || product.image) === img ? 'border-red-600 ring-1 ring-red-600' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div>
                        <div className="mb-2">
                            <span className="text-sm text-red-600 font-bold uppercase tracking-wider">
                                {product.category}
                            </span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                            {product.name}
                        </h1>

                        {/* Ratings & Brand */}
                        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                            <div className="flex items-center text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < (product.rating || 4) ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                                <span className="ml-2 text-gray-600">({product.numReviews} Reviews)</span>
                            </div>
                            <span className="h-4 w-px bg-gray-300"></span>
                            <span>Brand: <span className="text-gray-900 font-semibold">Herbal Hot</span></span>
                            <span className="h-4 w-px bg-gray-300"></span>
                            <span className={product.countInStock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end space-x-3 mb-6 bg-red-50 p-4 rounded-lg w-fit">
                            <span className="text-4xl font-bold text-red-700">₹{product.price}</span>
                            <span className="text-lg text-gray-400 line-through mb-1">₹{originalPrice}</span>
                            <span className="text-sm text-red-600 font-medium mb-1">You save ₹{originalPrice - product.price}</span>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Variants / Weight */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Weight</h3>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 border-2 border-red-600 text-red-600 bg-red-50 rounded-md font-medium text-sm">
                                    {product.weight || '250g'}
                                </button>
                                {/* Mock other variants if needed */}
                                {/* <button className="px-4 py-2 border border-gray-200 text-gray-600 hover:border-gray-300 rounded-md font-medium text-sm">500g</button> */}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-gray-100">
                            {/* Quantity */}
                            <div className="flex items-center border border-gray-300 rounded-md h-12 w-32">
                                <button
                                    className="px-3 h-full hover:bg-gray-50 flex items-center justify-center text-gray-600"
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    disabled={qty <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="flex-1 text-center font-bold text-gray-900">{qty}</span>
                                <button
                                    className="px-3 h-full hover:bg-gray-50 flex items-center justify-center text-gray-600"
                                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                    disabled={qty >= product.countInStock}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.countInStock === 0}
                                className="flex-1 h-12 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={product.countInStock === 0}
                                className="flex-1 h-12 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:bg-gray-400 disabled:shadow-none"
                            >
                                Buy Now
                            </button>

                            <button
                                onClick={() => {
                                    if (isInWishlist(product._id)) {
                                        removeFromWishlist(product._id);
                                        toast.success('Removed from wishlist');
                                    } else {
                                        addToWishlist({ ...product, category: product.category });
                                        toast.success('Added to wishlist');
                                    }
                                }}
                                className={`h-12 w-12 border rounded-md flex items-center justify-center transition-colors ${isInWishlist(product._id)
                                    ? 'border-red-200 bg-red-50 text-red-600'
                                    : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                <Truck className="h-6 w-6 text-red-600 mb-2" />
                                <span className="text-xs font-medium text-gray-900">Free Shipping</span>
                                <span className="text-[10px] text-gray-500">On orders over ₹500</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                <ShieldCheck className="h-6 w-6 text-red-600 mb-2" />
                                <span className="text-xs font-medium text-gray-900">Secure Payment</span>
                                <span className="text-[10px] text-gray-500">100% Protected</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                <RotateCcw className="h-6 w-6 text-red-600 mb-2" />
                                <span className="text-xs font-medium text-gray-900">Easy Returns</span>
                                <span className="text-[10px] text-gray-500">7 Days Policy</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                <Star className="h-6 w-6 text-red-600 mb-2" />
                                <span className="text-xs font-medium text-gray-900">Top Quality</span>
                                <span className="text-[10px] text-gray-500">Certified Organic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'description' ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab('ingredients')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ingredients' ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Ingredients
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Reviews ({product.reviews.length})
                    </button>
                </div>
                <div className="p-8">
                    {activeTab === 'description' && (
                        <div className="prose max-w-none text-gray-600">
                            <p>{product.description}</p>
                            <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                    )}
                    {activeTab === 'ingredients' && (
                        <div className="text-gray-600">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Premium Quality Chili</li>
                                <li>Organic Coriander</li>
                                <li>Turmeric Powder</li>
                                <li>Custom Masala Blend</li>
                                <li>Natural Preservatives</li>
                            </ul>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Reviews List */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Reviews</h3>
                                {product.reviews.length === 0 ? (
                                    <div className="text-gray-500 italic">No reviews yet. Be the first to review!</div>
                                ) : (
                                    product.reviews.map((review) => (
                                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                                                        {review.name.substring(0, 1)}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{review.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex text-yellow-400 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Write Review Form */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                                {userInfo ? (
                                    <form onSubmit={submitReviewHandler}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                            <div className="flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className={`p-1 focus:outline-none transform transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        title={`Rate ${star} stars`}
                                                    >
                                                        <Star
                                                            className={`h-8 w-8 ${star <= rating ? 'fill-current' : ''}`}
                                                            style={{ pointerEvents: 'none' }}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                                            <textarea
                                                id="comment"
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                placeholder="Share your thoughts..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitLoading}
                                            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
                                        >
                                            {submitLoading ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-600 mb-4">Please log in to write a review.</p>
                                        <Link to={`/login?redirect=/products/${id}`} className="inline-block bg-indigo-600 text-white font-medium py-2 px-6 rounded-md hover:bg-indigo-700">
                                            Log In
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-red-600 w-1 h-8 mr-3 rounded-full"></span>
                    Related Products
                </h2>
                {relatedProducts.length === 0 ? (
                    <p className="text-gray-500">No related products found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsPage;

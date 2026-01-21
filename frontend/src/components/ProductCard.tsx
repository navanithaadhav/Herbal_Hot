import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';


interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    category: string;

    weight?: string;
    countInStock: number;
    description: string;
    brand?: string;
    numReviews?: number;
    rating?: number;
    reviews?: any[];
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart } = useCartStore();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

    const addToCartHandler = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product details
        addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty: 1,
        });
        toast.success('Added to cart');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-sm hover:shadow-lg transition-shadow duration-200 flex flex-col h-full relative group">

            {/* Image Section */}
            <div className="relative p-3 bg-gray-50 flex-shrink-0">
                <Link to={`/products/${product._id}`} className="block relative h-36 flex items-center justify-center overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        width="200"
                        height="200"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                </Link>

                {/* Discount Badge */}
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-20">
                    13% OFF
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (isInWishlist(product._id)) {
                            removeFromWishlist(product._id);
                            toast.success('Removed from wishlist');
                        } else {
                            addToWishlist({ ...product, category: product.category || 'Masala' });
                            toast.success('Added to wishlist');
                        }
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-20"
                    title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                    <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-3 flex-1 flex flex-col">
                <Link to={`/products/${product._id}`} className="flex-1">
                    <h3 className="text-gray-900 font-medium text-sm leading-snug hover:text-orange-600 line-clamp-2 mb-1">
                        {product.name}
                    </h3>

                    {/* Weight & Rating Row */}
                    <div className="flex items-center gap-2 mb-0.5">
                        {product.weight && (
                            <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1 py-0.5 rounded border border-gray-200">
                                {product.weight}
                            </span>
                        )}
                        <div className="flex items-center">
                            <div className="flex text-red-600 text-[10px]">
                                {'★'.repeat(4)}{'☆'}
                            </div>
                            <span className="text-[10px] text-blue-600 ml-1 hover:underline hover:text-orange-600 cursor-pointer hidden sm:inline">
                                {product.numReviews || 128}
                            </span>
                        </div>
                    </div>

                    <div className="mt-0.5 flex items-baseline gap-2 mb-2">
                        <div className="flex items-baseline">
                            <span className="text-xs">₹</span>
                            <span className="text-base font-medium text-gray-900">{Math.floor(product.price)}</span>
                        </div>
                        {/* List Price / MRP */}
                        <span className="text-[10px] text-gray-500 line-through">
                            ₹{Math.round(product.price * 1.15)}
                        </span>
                    </div>
                </Link>

                <button
                    onClick={addToCartHandler}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 rounded-full py-1 text-xs font-medium text-gray-900 shadow-sm transition-colors border border-yellow-500"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;

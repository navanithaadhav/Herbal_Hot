import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, AlertCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: string;
}

interface Product {
    _id: string;
    name: string;
    image: string;
    category: string;
    price: number;
    reviews: Review[];
}

const ReviewListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuthStore();

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/products');
                setProducts(data);
                setLoading(false);
            } catch (err: unknown) {
                const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error).message || 'Failed to fetch reviews';
                setError(errorMessage);
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshKey]);

    const refreshData = () => setRefreshKey((prev) => prev + 1);

    const deleteHandler = async (productId: string, reviewId: string) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };
                await api.delete(`/products/${productId}/reviews/${reviewId}`, config);
                toast.success('Review deleted successfully');
                refreshData(); // Refresh data
            } catch (err: unknown) {
                const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error deleting review';
                toast.error(errorMessage);
            }
        }
    };

    // Flatten reviews for display
    const allReviews = products.flatMap(product =>
        product.reviews.map(review => ({
            ...review,
            productName: product.name,
            productId: product._id,
            productImage: product.image
        }))
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Reviews ({allReviews.length})</h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allReviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-normal">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-md object-cover" src={review.productImage} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{review.productName}</div>
                                                    <div className="text-xs text-gray-500">ID: {review.productId.substring(review.productId.length - 6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {review.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs truncate">
                                            {review.comment}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => deleteHandler(review.productId, review._id)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors"
                                                title="Delete Review"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {allReviews.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                            No reviews found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewListPage;

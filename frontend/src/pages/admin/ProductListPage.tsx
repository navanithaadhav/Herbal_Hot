import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';


interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
}

const AdminProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuthStore();

    const fetchProducts = React.useCallback(async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
            setLoading(false);
        } catch {
            toast.error('Failed to fetch products');
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        // eslint-disable-next-line
        fetchProducts();
    }, [fetchProducts]);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                await api.delete(`/products/${id}`, config);
                toast.success('Product deleted');
                fetchProducts();
            } catch {
                toast.error('Failed to delete product');
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` },
            };
            await api.post(`/products`, {}, config);
            toast.success('Sample product created');
            fetchProducts();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Create product error:', err);
            const message = err.response?.data?.message || err.message || 'Failed to create product';
            toast.error(message);
        }
    };

    if (loading) return <Loader2 className="animate-spin" />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <button onClick={createProductHandler} className="flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                    <Plus className="h-4 w-4 mr-2" /> Create Product
                </button>
            </div>

            <div className="bg-white shadow-sm overflow-hidden rounded-md border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/admin/product/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit className="h-4 w-4 inline" />
                                    </Link>
                                    <button onClick={() => deleteHandler(product._id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="h-4 w-4 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductListPage;

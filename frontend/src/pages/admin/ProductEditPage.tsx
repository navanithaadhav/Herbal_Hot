import React, { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Upload } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ProductEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { userInfo } = useAuthStore();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [weight, setWeight] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [uploading, setUploading] = useState(false);

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };
                const { data } = await api.post('/upload', formData, config);
                setImage(data.image);
                setImages((prev) => [...prev, data.image]); // Append to gallery
                setUploading(false);
                toast.success('Image uploaded successfully');
                toast.success('Image uploaded successfully');
            } catch (error: unknown) {
                console.error('Upload error details:', error);
                const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error).message || 'Image upload failed';
                toast.error(`Upload Error: ${errorMessage}`);
                setUploading(false);
            }
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setImages(data.images || [data.image]); // Fallback to main image
                setCategory(data.category);
                setWeight(data.weight || '');
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setLoading(false);
            } catch {
                toast.error('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            await api.put(
                `/products/${id}`,
                {
                    name,
                    price,
                    image,
                    images, // Send images array
                    category,
                    weight,
                    countInStock,
                    description,
                },
                config
            );

            toast.success('Product updated successfully');
            navigate('/admin/productlist');
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update product';
            toast.error(errorMessage);
        } finally {
            setLoadingUpdate(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to="/admin/productlist"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Link>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-xl font-bold text-gray-800">Edit Product</h1>
                </div>

                <form onSubmit={submitHandler} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                id="price"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL
                            </label>
                            <input
                                type="text"
                                id="image"
                                placeholder="Enter image url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                                required
                            />
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Images (Add up to 5)
                            </label>
                            <div className="flex items-center space-x-2 mb-4">
                                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300">
                                    <Upload className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-medium">Add Image</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={uploadFileHandler}
                                    />
                                </label>
                                {uploading && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
                            </div>

                            {/* Image Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group rounded-md border border-gray-200 overflow-hidden aspect-square bg-gray-50">
                                        <img src={img} alt={`product-${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = images.filter((_, i) => i !== idx);
                                                setImages(newImages);
                                                if (newImages.length > 0 && img === image) {
                                                    setImage(newImages[0]); // Update main image if deleted
                                                }
                                            }}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {/* Set as Main Badge */}
                                        {img === image && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 text-white text-[10px] text-center py-1">
                                                Main Image
                                            </span>
                                        )}
                                        {/* Click to Set Main */}
                                        {img !== image && (
                                            <button
                                                type="button"
                                                onClick={() => setImage(img)}
                                                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                id="category"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (e.g., 250g)
                            </label>
                            <input
                                type="text"
                                id="weight"
                                placeholder="Enter weight"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700 mb-1">
                                Count In Stock
                            </label>
                            <input
                                type="number"
                                id="countInStock"
                                placeholder="Enter count in stock"
                                value={countInStock}
                                onChange={(e) => setCountInStock(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loadingUpdate}
                            className="inline-flex items-center px-6 py-2.5 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loadingUpdate ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="-ml-1 mr-2 h-4 w-4" /> Update Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditPage;

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { Loader2, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    category: string;
    weight?: string;
    countInStock: number;
    description: string;
    rating?: number;
    numReviews?: number;
}

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = '/products';
                if (keyword) {
                    url += `?keyword=${keyword}`;
                }
                const { data } = await api.get(url);
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    // Extract unique categories and weights
    const { categories, weights } = useMemo(() => {
        const uniqueCategories = new Set(products.map((p) => p.category));
        const uniqueWeights = new Set(products.map((p) => p.weight).filter(Boolean));
        return {
            categories: Array.from(uniqueCategories),
            weights: Array.from(uniqueWeights)
        };
    }, [products]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Category Filter (OR logic)
        if (selectedCategories.length > 0) {
            result = result.filter((p) => selectedCategories.includes(p.category));
        }

        // Weight Filter (OR logic)
        if (selectedWeights.length > 0) {
            result = result.filter((p) => p.weight && selectedWeights.includes(p.weight));
        }

        // Price Filter
        result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Rating Filter (Mocking rating since backend might not send it yet, assuming 4 if undefined)
        // In a real app, ensure product.rating exists
        if (minRating > 0) {
            result = result.filter((p) => (p.rating || 4) >= minRating);
        }

        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.reverse();
                break;
            default:
                break;
        }

        return result;
    }, [products, selectedCategories, selectedWeights, priceRange, minRating, sortBy]);

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedWeights([]);
        setPriceRange([0, 10000]);
        setMinRating(0);
        setSortBy('featured');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-10">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {keyword ? `Search Results for "${keyword}"` : 'Our Spices'}
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Button */}
                <button
                    className="lg:hidden flex items-center justify-center space-x-2 bg-white border border-gray-300 p-2 rounded-md mb-4"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                    <span>Filters</span>
                </button>

                {/* Sidebar - Desktop & Mobile */}
                <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                    <FilterSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        weights={weights as string[]}
                        selectedWeights={selectedWeights}
                        setSelectedWeights={setSelectedWeights}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        clearFilters={clearFilters}
                    />
                </div>

                {/* Product Grid Area */}
                <div className="flex-1">
                    {/* Top Bar */}
                    <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="Grid View"
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="List View"
                            >
                                <List className="h-5 w-5" />
                            </button>
                            <span className="text-sm text-gray-500">
                                {filteredProducts.length} products
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border-none text-sm font-medium text-gray-700 bg-transparent focus:ring-0 cursor-pointer outline-none"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-lg mb-2">No products found.</p>
                            <button onClick={clearFilters} className="text-red-600 hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;

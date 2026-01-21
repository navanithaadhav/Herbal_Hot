import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

interface FilterSidebarProps {
    categories: string[];
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    weights: string[];
    selectedWeights: string[];
    setSelectedWeights: (weights: string[]) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    minRating: number;
    setMinRating: (rating: number) => void;
    clearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    categories,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    clearFilters,
    weights,
    selectedWeights,
    setSelectedWeights,
}) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isWeightOpen, setIsWeightOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isRatingOpen, setIsRatingOpen] = useState(true);
    const [minPrice, setMinPrice] = useState(priceRange[0].toString());
    const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());

    const handlePriceApply = () => {
        setPriceRange([Number(minPrice), Number(maxPrice)]);
    };

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const toggleWeight = (weight: string) => {
        if (selectedWeights.includes(weight)) {
            setSelectedWeights(selectedWeights.filter((w) => w !== weight));
        } else {
            setSelectedWeights([...selectedWeights, weight]);
        }
    };

    return (
        <div className="w-full lg:w-64 flex-shrink-0 bg-white p-4 rounded-lg border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filter:</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                >
                    Clear All
                </button>
            </div>

            {/* Categories Section */}
            <div className="mb-6 border-b border-gray-100 pb-6">
                <button
                    className="flex items-center justify-between w-full mb-4"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                    <span className="font-semibold text-gray-700">CATEGORY</span>
                    {isCategoryOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </button>

                {isCategoryOpen && (
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => toggleCategory(category)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <span className={`text-sm ${selectedCategories.includes(category) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {category}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Customer Reviews Section */}
            <div className="mb-6 border-b border-gray-100 pb-6">
                <button
                    className="flex items-center justify-between w-full mb-4"
                    onClick={() => setIsRatingOpen(!isRatingOpen)}
                >
                    <span className="font-semibold text-gray-700">CUSTOMER REVIEWS</span>
                    {isRatingOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </button>

                {isRatingOpen && (
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setMinRating(rating)}
                                className={`flex items-center space-x-2 w-full text-sm hover:text-red-600 ${minRating === rating ? 'font-bold bg-red-50 p-1 rounded' : ''}`}
                            >
                                <div className="flex text-red-600">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : 'text-gray-300 stroke-1'}`} />
                                    ))}
                                </div>
                                <span className="text-gray-600">& Up</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>


            {/* Weight Section */}
            <div className="mb-6 border-b border-gray-100 pb-6">
                <button
                    className="flex items-center justify-between w-full mb-4"
                    onClick={() => setIsWeightOpen(!isWeightOpen)}
                >
                    <span className="font-semibold text-gray-700">WEIGHT</span>
                    {isWeightOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </button>

                {isWeightOpen && (
                    <div className="space-y-2">
                        {weights.map((w) => (
                            <label key={w} className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedWeights.includes(w)}
                                    onChange={() => toggleWeight(w)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <span className={`text-sm ${selectedWeights.includes(w) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {w}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Section */}
            <div className="mb-6">
                <button
                    className="flex items-center justify-between w-full mb-4"
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                    <span className="font-semibold text-gray-700">PRICE</span>
                    {isPriceOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </button>

                {isPriceOpen && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="relative w-full">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500 outline-none"
                                    placeholder="Min"
                                />
                            </div>
                            <span className="text-gray-400">to</span>
                            <div className="relative w-full">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500 outline-none"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handlePriceApply}
                            className="w-full bg-white border border-gray-300 text-gray-800 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Go
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;

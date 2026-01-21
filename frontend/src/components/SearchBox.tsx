import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products?keyword=${keyword}`);
        } else {
            navigate('/products');
        }
    };

    return (
        <form onSubmit={submitHandler} className="flex flex-1 max-w-lg relative">
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search specific spices..."
                className="w-full bg-gray-100 text-gray-900 rounded-full pl-5 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-100 border border-transparent focus:border-red-200 transition-all text-sm"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                aria-label="Search"
            >
                <Search className="h-5 w-5" />
            </button>
        </form>
    );
};

export default SearchBox;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        id: 'whole',
        name: 'Whole Spices',
        description: 'Authentic, unground spices straight from the farm.',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        color: 'bg-orange-50'
    },
    {
        id: 'ground',
        name: 'Ground Spices',
        description: 'Finely ground powders retaining essential oils.',
        image: 'https://images.unsplash.com/photo-1599909692063-e94532375558?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        color: 'bg-red-50'
    },
    {
        id: 'herbal',
        name: 'Herbal Products',
        description: 'Natural herbal remedies and supplements.',
        image: 'https://images.unsplash.com/photo-1615485499708-8e69ac3aae8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        color: 'bg-green-50'
    },
    {
        id: 'combo',
        name: 'Combo Packs',
        description: 'Curated sets for specific cuisines and gifts.',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', // detailed combo image
        color: 'bg-yellow-50'
    }
];

const CategoriesPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Collections</h1>
                    <p className="mt-4 text-xl text-gray-500">Explore our premium range of authentic spices and herbal products</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${category.color} aspect-[16/9] flex items-center justify-center`}
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            </div>

                            <div className="relative z-10 text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                                <p className="text-gray-200 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 max-w-md mx-auto">
                                    {category.description}
                                </p>
                                <span className="inline-flex items-center text-yellow-400 font-semibold group-hover:text-yellow-300">
                                    Browse Collection <ArrowRight className="ml-2 h-5 w-5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;

import React from 'react';
import { Star, Quote } from 'lucide-react';

const ReviewSection: React.FC = () => {
    const reviews = [
        {
            id: 1,
            name: "Anjali Sharma",
            location: "Mumbai",
            rating: 5,
            text: "The aroma of the cardamom is just incredible! It takes my chai to the next level. Absolutely love the quality and packaging.",
            initial: "A"
        },
        {
            id: 2,
            name: "Rahul Verma",
            location: "Delhi",
            rating: 5,
            text: "I've tried many brands, but Herbal Hot stands out. The chili powder has the perfect color and heat. Highly recommended!",
            initial: "R"
        },
        {
            id: 3,
            name: "Priya Menon",
            location: "Bangalore",
            rating: 4,
            text: "Great selection of organic masalas. The delivery was fast and the products feel very fresh. Will order again.",
            initial: "P"
        }
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-yellow-500 font-bold tracking-wider uppercase mb-2 block">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                    <p className="text-gray-500 text-lg">
                        Don't just take our word for it. Here's why chefs and home cooks love Herbal Hot spices.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-8 rounded-2xl relative hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                            <Quote className="absolute top-6 right-6 text-gray-200 h-8 w-8" />

                            <div className="flex items-center space-x-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-8 italic leading-relaxed">"{review.text}"</p>

                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {review.initial}
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-bold text-gray-900">{review.name}</h3>
                                    <p className="text-sm text-gray-500">{review.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;

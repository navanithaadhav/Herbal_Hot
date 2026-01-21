import React from 'react';
import { Truck, ShieldCheck, Leaf, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-[#0f172a] py-20 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Spices background"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        About Herbal Hot
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
                        Bringing the authentic taste of tradition to your kitchen. Pure, potent, and passionate about spices.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Our Story
                            </h2>
                            <p className="mt-4 text-lg text-gray-500">
                                Herbal Hot began with a simple mission: to provide high-quality, authentic spices that transform ordinary meals into extraordinary experiences. We believe that the secret to great cooking lies in the ingredients.
                            </p>
                            <p className="mt-4 text-lg text-gray-500">
                                Sourced directly from the finest farms, our spices are carefully selected, processed, and packaged to retain their natural aroma and flavor. We are committed to purity no artificial colors, no preservatives, just 100% natural goodness.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <div className="flex items-center text-yellow-600 font-semibold">
                                    <ShieldCheck className="h-5 w-5 mr-2" />
                                    100% Organic
                                </div>
                                <div className="flex items-center text-yellow-600 font-semibold">
                                    <Leaf className="h-5 w-5 mr-2" />
                                    Farm Fresh
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 lg:mt-0 relative">
                            <div className="absolute -inset-4 bg-yellow-100 rounded-xl transform rotate-3"></div>
                            <img
                                className="relative rounded-xl shadow-lg w-full object-cover"
                                src="https://images.unsplash.com/photo-1532336414038-cf19250cbn?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Our spices"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Us?</h2>
                    </div>
                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
                                <Leaf className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Pure & Natural</h3>
                            <p className="text-gray-500">We guarantee zero adulteration. Our spices are ground from whole, high-grade ingredients.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
                                <Truck className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
                            <p className="text-gray-500">From our facility to your doorstep, we ensure quick and safe shipping.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Made with Love</h3>
                            <p className="text-gray-500">We are a family-run business that cares deeply about the quality we provide to our customers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

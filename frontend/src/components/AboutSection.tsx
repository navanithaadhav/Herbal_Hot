import React from 'react';
import { Leaf, Award, ShieldCheck } from 'lucide-react';
import aboutImage from '../assets/images/photo3.jpg'; // Reusing an existing image

const AboutSection: React.FC = () => {
    return (
        <section className="py-20 bg-emerald-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Image Side */}
                    <div className="lg:w-1/2 relative">
                        <div className="absolute top-0 left-0 -ml-4 -mt-4 w-24 h-24 bg-yellow-200 rounded-full blur-xl opacity-70"></div>
                        <div className="absolute bottom-0 right-0 -mr-4 -mb-4 w-32 h-32 bg-emerald-200 rounded-full blur-xl opacity-70"></div>
                        <img
                            src={aboutImage}
                            alt="About Herbal Hot"
                            className="relative rounded-2xl shadow-2xl z-10 w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs hidden md:block">
                            <p className="text-gray-600 italic">"Purity you can taste, tradition you can trust."</p>
                            <div className="flex items-center mt-3">
                                <div className="h-0.5 w-8 bg-yellow-500 mr-2"></div>
                                <span className="text-emerald-800 font-bold text-sm">SINCE 1995</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-1/2">
                        <span className="text-emerald-600 font-bold tracking-wider uppercase mb-2 block">Our Story</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            Bringing the Essence of <span className="text-yellow-600">Herbal Hot</span> to Your Kitchen
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                            At Herbal Hot, we believe that the soul of any dish lies in its spices. For over two decades, we have been dedicated to sourcing the finest, most aromatic spices from the spice capitals of India.
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Our commitment goes beyond just taste. We ensure every pinch of spice you use is ethically sourced, naturally processed, and packed with the goodness of nature, free from artificial additives.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start">
                                <div className="bg-emerald-100 p-3 rounded-lg mr-4 text-emerald-600">
                                    <Leaf size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">100% Organic</h3>
                                    <p className="text-sm text-gray-500">Certified organic farming partners.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-yellow-100 p-3 rounded-lg mr-4 text-yellow-600">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Premium Quality</h3>
                                    <p className="text-sm text-gray-500">Grade A spices selected by experts.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4 text-blue-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Lab Tested</h3>
                                    <p className="text-sm text-gray-500">Rigorous checks for purity & safety.</p>
                                </div>
                            </div>
                        </div>

                        <a href="/about" className="inline-block mt-10 text-emerald-700 font-bold hover:text-emerald-800 transition-colors border-b-2 border-emerald-200 hover:border-emerald-600 pb-1">
                            Learn More About Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;

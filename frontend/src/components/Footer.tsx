import React from 'react';
import {
    Facebook,
    Instagram,
    Search,
    MessageCircle,
    Phone,
    Mail,
    Star
} from 'lucide-react';

import logo from '../assets/images/logo.png';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#0f172a] text-gray-300 overflow-hidden font-sans">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
                    {/* Left: Brand & Social */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            {/* Logo */}
                            <img src={logo} alt="Herbal Hot" className="h-12 w-auto bg-white rounded-full p-1" />
                            <span className="text-xl font-bold text-white">Herbal Hot</span>
                            {/* Mock Google Review Stars */}
                            <div className="flex items-center ml-4 space-x-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-2 text-sm text-gray-400">200+ Reviews</span>
                            </div>
                        </div>

                        <p className="text-sm max-w-sm text-gray-400">
                            Premium spices sourced directly from the finest farms. experience the authentic taste of tradition.
                        </p>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-white">Follow us social media</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors text-white" aria-label="Facebook">
                                    <Facebook size={18} />
                                </a>
                                <a href="#" className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition-colors text-white" aria-label="Instagram">
                                    <Instagram size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Search */}
                    <div className="w-full lg:max-w-md lg:ml-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search this site"
                                className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Search">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-800 mb-12" />

                {/* Middle: Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {/* Column 1 */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Products</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">All Spices</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Blends & Masalas</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Whole Spices</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Organic Herbs</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Gift Sets</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors underline decoration-blue-500/30">See more</a></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Services</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Bulk Orders</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Custom Blends</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Worldwide Shipping</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Spice Consulting</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Recipes & Blog</a></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Help</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Return Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start max-w-xs">
                                <span className="block leading-relaxed">
                                    123 Spice Route, Market Street,<br />
                                    Mumbai, India 400001
                                </span>
                            </li>
                            <li>
                                <a href="#" className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                                    <MessageCircle size={16} />
                                    <span>Chat with an Expert</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                                    <Phone size={16} />
                                    <span>Call +91 98765 43210</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                                    <Mail size={16} />
                                    <span>support@herbalhot.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom: Payments */}
                <div className="flex flex-wrap justify-center gap-3 mb-12 opacity-80">
                    {/* Placeholder Cards - In a real app these would be SVGs or Images */}
                    <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs text-black font-bold">VISA</div>
                    <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs text-black font-bold">MC</div>
                    <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs text-black font-bold">AMEX</div>
                    <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs text-black font-bold">PAYPAL</div>
                    <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs text-black font-bold">APPLE</div>
                </div>
            </div>

            {/* Very Bottom: Links & Copyright */}
            <div className="bg-[#0b1120] py-6 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Locations Row */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500 mb-6 uppercase tracking-wider">
                        <span>Mumbai</span>
                        <span>Delhi</span>
                        <span>Bangalore</span>
                        <span>Chennai</span>
                        <span>Kolkata</span>
                        <span>Hyderabad</span>
                        <span>Pune</span>
                        <span>Ahmedabad</span>
                        <span>Jaipur</span>
                        <span>Surat</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 border-t border-gray-800 pt-6">
                        <div className="mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} Herbal Hot Store. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-white transition-colors">Home</a>
                            <a href="#" className="hover:text-white transition-colors">Blog</a>
                            <a href="#" className="hover:text-white transition-colors">Site Map</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

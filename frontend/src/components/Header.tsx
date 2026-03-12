import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart";
import User from "lucide-react/dist/esm/icons/user";

import {
    Menu,
    Heart,
    ChevronDown,
    LogOut,
    Package,
    MapPin,
    UserCircle,
    LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import SearchBox from './SearchBox';

import logo from '../assets/images/logo.webp';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { userInfo, logout } = useAuthStore();
    const { cartItems, clearCart } = useCartStore();
    const { wishlistItems, clearWishlist } = useWishlistStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        clearCart();
        clearWishlist();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={logo} alt="Herbal Hot" className="h-12 md:h-14 w-auto" />
                            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Herbal Hot</span>
                        </Link>
                    </div>

                    {/* Center: Search Box */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                        <SearchBox />
                    </div>

                    {/* Right Side: Nav & Icons */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <nav className="flex space-x-8 items-center border-r border-gray-200 pr-8 mr-2">
                            <Link to="/" className="text-gray-700 hover:text-yellow-600 font-bold text-[16px] transition-colors">Home</Link>

                            {/* Shop Dropdown */}
                            <div className="relative group z-50">
                                <button className="flex items-center text-gray-700 hover:text-yellow-600 font-bold text-[16px] transition-colors focus:outline-none py-2">
                                    Shop <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                                </button>
                                <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 border border-gray-100">
                                    <Link to="/products" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">All Products</Link>
                                    <Link to="/products?category=whole" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">Whole Spices</Link>
                                    <Link to="/products?category=ground" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">Ground Spices</Link>
                                    <Link to="/products?category=herbal" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">Herbal Products</Link>
                                    <Link to="/products?category=combo" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">Combo Packs</Link>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <Link to="/products?sort=best-selling" className="block px-5 py-2.5 text-sm font-semibold text-yellow-600 hover:bg-yellow-50 transition-colors">Best Sellers ★</Link>
                                </div>
                            </div>

                            <Link to="/categories" className="text-gray-700 hover:text-yellow-600 font-bold text-[16px] transition-colors">Categories</Link>
                            <Link to="/about" className="text-gray-700 hover:text-yellow-600 font-bold text-[16px] transition-colors">About</Link>
                            <Link to="/contact" className="text-gray-700 hover:text-yellow-600 font-bold text-[16px] transition-colors">Contact</Link>
                        </nav>

                        <Link to="/wishlist" className="text-gray-700 hover:text-yellow-600 relative transition-colors" aria-label="Wishlist">
                            <Heart className="h-7 w-7" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="text-gray-700 hover:text-yellow-600 relative transition-colors" aria-label="Cart">
                            <ShoppingCart className="h-7 w-7" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {cartItems.reduce((acc: number, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>

                        {/* Account Dropdown */}
                        {userInfo ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 focus:outline-none py-2 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold border border-yellow-200">
                                        {userInfo.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[15px] font-bold max-w-[100px] truncate">{userInfo.name.split(' ')[0]}</span>
                                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-yellow-600" />
                                </button>

                                <div className="absolute top-full right-0 w-64 bg-white shadow-2xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50 border border-gray-100">
                                    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 rounded-t-2xl">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Signed in as</p>
                                        <p className="text-sm font-black text-gray-900 truncate">{userInfo.email}</p>
                                    </div>

                                    <div className="py-2">
                                        {userInfo.role === 'admin' && (
                                            <Link to="/admin/dashboard" className="flex items-center px-6 py-3 text-[15px] font-black text-red-600 bg-red-50 hover:bg-red-100 transition-colors mb-2">
                                                <LayoutDashboard className="h-5 w-5 mr-3" /> Dashboard
                                            </Link>
                                        )}
                                        <Link to="/profile" className="flex items-center px-6 py-3 text-[15px] text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors font-semibold">
                                            <UserCircle className="h-5 w-5 mr-3 text-gray-400" /> My Profile
                                        </Link>
                                        <Link to="/orders" className="flex items-center px-6 py-3 text-[15px] text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors font-semibold">
                                            <Package className="h-5 w-5 mr-3 text-gray-400" /> My Orders
                                        </Link>
                                        <Link to="/addresses" className="flex items-center px-6 py-3 text-[15px] text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors font-semibold">
                                            <MapPin className="h-5 w-5 mr-3 text-gray-400" /> Address Book
                                        </Link>
                                    </div>

                                    <div className="border-t border-gray-100 pt-2 pb-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-6 py-3 text-[15px] text-red-600 hover:bg-red-50 transition-colors font-black"
                                        >
                                            <LogOut className="h-5 w-5 mr-3" /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl text-[15px] font-black">
                                <User className="h-5 w-5" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-900 hover:text-yellow-600 focus:outline-none p-3 bg-gray-50 rounded-xl transition-all"
                            aria-label="Open Menu"
                        >
                            <Menu className="h-8 w-8" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

                <div className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
                            <span className="text-2xl font-black text-gray-900">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-900">&times;</button>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-4 rounded-2xl text-lg font-bold text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all">Home</Link>
                            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="px-4 py-4 rounded-2xl text-lg font-bold text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all">Shop</Link>
                            <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="px-4 py-4 rounded-2xl text-lg font-bold text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all">Categories</Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-4 rounded-2xl text-lg font-bold text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all">About Us</Link>
                            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="px-4 py-4 rounded-2xl text-lg font-bold text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all">Contact</Link>

                            <div className="border-t border-gray-50 my-6"></div>

                            {!userInfo ? (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 px-4 py-5 rounded-2xl bg-gray-900 text-white font-black hover:bg-gray-800 transition-all">
                                    <User className="h-6 w-6" />
                                    <span>Login / Register</span>
                                </Link>
                            ) : (
                                <div className="space-y-2">
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-bold text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all">
                                        <UserCircle className="h-6 w-6 text-gray-400" /> My Profile
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className="flex items-center gap-3 w-full text-left px-4 py-4 rounded-2xl text-lg font-bold text-red-600 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut className="h-6 w-6" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

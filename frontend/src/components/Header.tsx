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
                <div className="flex justify-between items-center h-20">
                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logo} alt="Herbal Hot" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">Herbal Hot</span>
                        </Link>
                    </div>

                    {/* Center: Search Box */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                        <SearchBox />
                    </div>

                    {/* Right Side: Nav & Icons */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <nav className="flex space-x-6 items-center border-r border-gray-200 pr-6 mr-2">
                            <Link to="/" className="text-gray-700 hover:text-yellow-600 font-medium text-[15px] transition-colors">Home</Link>

                            {/* Shop Dropdown */}
                            <div className="relative group z-50">
                                <button className="flex items-center text-gray-700 hover:text-yellow-600 font-medium text-[15px] transition-colors focus:outline-none py-2">
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

                            <Link to="/categories" className="text-gray-700 hover:text-yellow-600 font-medium text-[15px] transition-colors">Categories</Link>
                            <Link to="/about" className="text-gray-700 hover:text-yellow-600 font-medium text-[15px] transition-colors">About</Link>
                            <Link to="/contact" className="text-gray-700 hover:text-yellow-600 font-medium text-[15px] transition-colors">Contact</Link>
                        </nav>
                        {/* Removed static search button */}

                        <Link to="/wishlist" className="text-gray-700 hover:text-yellow-600 relative transition-colors" aria-label="Wishlist">
                            <Heart className="h-6 w-6" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="text-gray-700 hover:text-yellow-600 relative transition-colors" aria-label="Cart">
                            <ShoppingCart className="h-6 w-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartItems.reduce((acc: number, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>

                        {/* Account Dropdown */}
                        {userInfo ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 focus:outline-none py-2 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-semibold border border-yellow-200">
                                        {userInfo.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold max-w-[100px] truncate">{userInfo.name.split(' ')[0]}</span>
                                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-yellow-600" />
                                </button>

                                <div className="absolute top-full right-0 w-60 bg-white shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50 border border-gray-100">
                                    <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50 rounded-t-xl">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Signed in as</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{userInfo.email}</p>
                                    </div>

                                    <div className="py-2">
                                        {userInfo.role === 'admin' && (
                                            <Link to="/admin/dashboard" className="flex items-center px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors mb-2">
                                                <LayoutDashboard className="h-4 w-4 mr-3" /> Dashboard
                                            </Link>
                                        )}
                                        <Link to="/profile" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">
                                            <UserCircle className="h-4 w-4 mr-3 text-gray-400" /> My Profile
                                        </Link>
                                        <Link to="/orders" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">
                                            <Package className="h-4 w-4 mr-3 text-gray-400" /> My Orders
                                        </Link>
                                        <Link to="/addresses" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">
                                            <MapPin className="h-4 w-4 mr-3 text-gray-400" /> Address Book
                                        </Link>
                                        <Link to="/wishlist" className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">
                                            <Heart className="h-4 w-4 mr-3 text-gray-400" /> Wishlist
                                        </Link>
                                    </div>

                                    <div className="border-t border-gray-100 pt-2 pb-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg text-sm font-semibold">
                                <User className="h-4 w-4" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-yellow-600 focus:outline-none p-2"
                            aria-label="Open Menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-t border-gray-100 shadow-lg z-40">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link to="/" className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600">Home</Link>
                        <Link to="/products" className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600">Shop</Link>
                        <Link to="/categories" className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600">Categories</Link>
                        <Link to="/about" className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600">About Us</Link>
                        <Link to="/contact" className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600">Contact</Link>
                        <div className="border-t border-gray-100 my-2"></div>
                        {!userInfo && (
                            <Link to="/login" className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600">Login / Register</Link>
                        )}
                        {userInfo && (
                            <>
                                <Link to="/profile" className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-yellow-600">My Profile</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

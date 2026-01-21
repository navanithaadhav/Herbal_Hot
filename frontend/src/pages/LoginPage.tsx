import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import heroBg from '../assets/images/background.jpg'; // Using existing asset

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    const { userInfo, setCredentials } = useAuthStore();

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/users/login', { email, password });
            setCredentials(data);
            toast.success('Welcome back!');
            navigate(redirect);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            setLoading(true);
            const { data } = await api.post('/users/google-login', {
                token: credentialResponse.credential,
            });
            setCredentials(data);
            toast.success('Welcome back!');
            navigate(redirect);
        } catch (err: any) {
            console.error(err);
            toast.error('Google Loign Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Image/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 transform scale-105 hover:scale-110 transition-transform duration-[20s]"
                    style={{ backgroundImage: `url(${heroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
                    <div>
                        {/* You can add a logo here if you have one */}
                        {/* <img src="/logo.png" alt="Herbal Hot" className="h-10" /> */}
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Authentic Spices,<br />Straight to Your Kitchen.</h2>
                        <p className="text-gray-300 text-lg max-w-md">Experience the finest organic spices sourced directly from the best farms in India.</p>
                    </div>
                    <div className="text-sm text-gray-500">© 2024 Herbal Hot. All rights reserved.</div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto w-full max-w-md">
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign in to your account
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    data-testid="login-email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors bg-gray-50 hover:bg-white"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    data-testid="login-password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors bg-gray-50 hover:bg-white"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            data-testid="login-submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all transform hover:translate-y-[-1px]"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    toast.error('Google Login Failed');
                                }}
                            />
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="font-bold text-red-600 hover:text-red-500 hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

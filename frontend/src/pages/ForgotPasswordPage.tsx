import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import heroBg from '../assets/images/background.jpg';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Submit handler for forgot password
    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/forgot-password', { email });
            toast.success('OTP sent to your email');
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error: unknown) {
            let errorMessage = 'Failed to send OTP';
            if (isAxiosError(error)) {
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 transform scale-105"
                    style={{ backgroundImage: `url(${heroBg})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
                    <div></div>
                    <div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Recover Your<br />Access.</h2>
                        <p className="text-gray-300 text-lg max-w-md">Don't worry, we'll help you get back to your favorite spices in no time.</p>
                    </div>
                    <div className="text-sm text-gray-500">© 2024 Herbal Hot. All rights reserved.</div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto w-full max-w-md">
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your email to receive a reset OTP
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
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors bg-gray-50 hover:bg-white"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all transform hover:translate-y-[-1px]"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    Send OTP Info <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        <Link to="/login" className="inline-flex items-center font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

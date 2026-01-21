import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Loader2, Mail } from 'lucide-react';
import heroBg from '../assets/images/background.jpg';

const VerifyEmailPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { search } = useLocation();
    const { setCredentials } = useAuthStore();

    useEffect(() => {
        const emailParam = new URLSearchParams(search).get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [search]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '') {
            if (e.currentTarget.previousSibling) {
                (e.currentTarget.previousSibling as HTMLInputElement).focus();
            }
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const otpString = otp.join('');
        try {
            const { data } = await api.post('/users/verify-email', { email, otp: otpString });
            setCredentials(data);
            toast.success('Email verified successfully');
            navigate('/');
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Verification failed';
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
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Verify Your<br />Identity.</h2>
                        <p className="text-gray-300 text-lg max-w-md">Enter the code sent to your email to secure your account.</p>
                    </div>
                    <div className="text-sm text-gray-500">© 2024 Herbal Hot. All rights reserved.</div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto w-full max-w-md">
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Enter OTP</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We have sent a verification code to your email
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
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    readOnly={!!new URLSearchParams(search).get('email')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">One-Time Password (OTP)</label>
                            <div className="flex justify-between gap-2">
                                {otp.map((data, index) => (
                                    <input
                                        className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors bg-gray-50 hover:bg-white"
                                        type="text"
                                        name="otp"
                                        maxLength={1}
                                        key={index}
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onFocus={(e) => e.target.select()}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all transform hover:translate-y-[-1px]"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Email'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;

import React from 'react';
import { Link } from 'react-router-dom';

interface CheckoutStepsProps {
    step1?: boolean;
    step2?: boolean;
    step3?: boolean;
    step4?: boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ step1, step2, step3, step4 }) => {
    return (
        <nav className="flex items-center justify-center mb-8">
            <ol className="flex items-center w-full max-w-2xl text-sm font-medium text-center text-gray-500 sm:text-base">
                <li className={`flex md:w-full items-center ${step1 ? 'text-red-600' : 'text-gray-500'}`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                        {step1 ? (
                            <Link to="/login" className="hover:underline">Sign In</Link>
                        ) : (
                            <span className="cursor-not-allowed">Sign In</span>
                        )}
                    </span>
                </li>
                <li className={`flex md:w-full items-center ${step2 ? 'text-red-600' : 'text-gray-500'} before:content-[''] before:w-full before:h-1 before:border-b before:border-gray-200 before:hidden sm:before:inline-block before:mx-6 xl:before:mx-10`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                        {step2 ? (
                            <Link to="/shipping" className="hover:underline whitespace-nowrap">Shipping</Link>
                        ) : (
                            <span className="cursor-not-allowed whitespace-nowrap">Shipping</span>
                        )}
                    </span>
                </li>
                <li className={`flex md:w-full items-center ${step3 ? 'text-red-600' : 'text-gray-500'} before:content-[''] before:w-full before:h-1 before:border-b before:border-gray-200 before:hidden sm:before:inline-block before:mx-6 xl:before:mx-10`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                        {step3 ? (
                            <Link to="/payment" className="hover:underline whitespace-nowrap">Payment</Link>
                        ) : (
                            <span className="cursor-not-allowed whitespace-nowrap">Payment</span>
                        )}
                    </span>
                </li>
                <li className={`flex items-center ${step4 ? 'text-red-600' : 'text-gray-500'} before:content-[''] before:w-full before:h-1 before:border-b before:border-gray-200 before:hidden sm:before:inline-block before:mx-6 xl:before:mx-10`}>
                    <span className="cursor-not-allowed whitespace-nowrap">Place Order</span>
                </li>
            </ol>
        </nav>
    );
};

export default CheckoutSteps;

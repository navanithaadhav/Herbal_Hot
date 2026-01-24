import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import CheckoutSteps from '../components/CheckoutSteps';

import { useAuthStore } from '../store/authStore';

const ShippingPage: React.FC = () => {
    const cart = useCartStore();
    const { shippingAddress } = cart;
    const { userInfo } = useAuthStore();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const [mobileNumber, setMobileNumber] = useState(shippingAddress.mobileNumber || '');

    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | string>('new');
    const [error, setError] = useState('');

    const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = e.target.value;
        setSelectedAddressIndex(index);

        if (index !== 'new' && userInfo?.addresses && userInfo.addresses[Number(index)]) {
            const selected = userInfo.addresses[Number(index)];
            setAddress(selected.street);
            setCity(selected.city);
            setPostalCode(selected.zip);
            setCountry(selected.country);
            setMobileNumber(selected.mobileNumber || '');
        } else {
            setAddress('');
            setCity('');
            setPostalCode('');
            setCountry('');
            setMobileNumber('');
        }
    };

    const validateMobileNumber = (number: string) => {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(number);
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateMobileNumber(mobileNumber)) {
            setError('Please enter a valid mobile number (10-15 digits)');
            return;
        }

        cart.saveShippingAddress({ address, city, postalCode, country, mobileNumber });
        navigate('/payment');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 />
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {userInfo?.addresses && userInfo.addresses.length > 0 && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select a Saved Address</label>
                        <select
                            value={selectedAddressIndex}
                            onChange={handleAddressSelect}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="new">-- Enter New Address --</option>
                            {userInfo.addresses.map((addr, idx) => (
                                <option key={idx} value={idx}>
                                    {addr.mode ? addr.mode.toUpperCase() : `Address ${idx + 1}`}: {addr.street}, {addr.city}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            placeholder="Enter mobile number"
                            value={mobileNumber}
                            onChange={(e) => {
                                setMobileNumber(e.target.value);
                                setError('');
                            }}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Used for order tracking and delivery updates.</p>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            id="city"
                            placeholder="Enter city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            placeholder="Enter postal code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                            type="text"
                            id="country"
                            placeholder="Enter country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;

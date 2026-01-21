import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, MapPin, Home, Briefcase } from 'lucide-react';

interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    mode?: string;
}

const AddressBookPage: React.FC = () => {
    const { userInfo, setCredentials } = useAuthStore();
    const [addresses, setAddresses] = useState<Address[]>(userInfo?.addresses || []);
    const [showForm, setShowForm] = useState(false);
    const [newAddress, setNewAddress] = useState<Address>({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        mode: 'home'
    });

    useEffect(() => {
        if (userInfo?.addresses) {
            // eslint-disable-next-line
            setAddresses(userInfo.addresses);
        }
    }, [userInfo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedAddresses = [...addresses, newAddress];
            const { data } = await api.put('/users/profile', {
                name: userInfo?.name,
                email: userInfo?.email,
                addresses: updatedAddresses
            });
            setCredentials(data);
            setAddresses(updatedAddresses);
            setShowForm(false);
            setNewAddress({ street: '', city: '', state: '', zip: '', country: '', mode: 'home' });
            toast.success('Address added successfully');
        } catch {
            toast.error('Failed to add address');
        }
    };

    const handleDelete = async (index: number) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const updatedAddresses = addresses.filter((_, i) => i !== index);
                const { data } = await api.put('/users/profile', {
                    name: userInfo?.name,
                    email: userInfo?.email,
                    addresses: updatedAddresses
                });
                setCredentials(data);
                setAddresses(updatedAddresses);
                toast.success('Address deleted successfully');
            } catch {
                toast.error('Failed to delete address');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Address
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input
                                type="text"
                                name="street"
                                value={newAddress.street}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={newAddress.city}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                type="text"
                                name="state"
                                value={newAddress.state}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                            <input
                                type="text"
                                name="zip"
                                value={newAddress.zip}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={newAddress.country}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                            <select
                                name="mode"
                                value={newAddress.mode}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="home">Home</option>
                                <option value="work">Work</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="col-span-2 flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Save Address
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((addr, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                {addr.mode === 'home' ? <Home className="h-5 w-5 text-red-500" /> :
                                    addr.mode === 'work' ? <Briefcase className="h-5 w-5 text-blue-500" /> :
                                        <MapPin className="h-5 w-5 text-gray-500" />}
                                <span className="font-semibold capitalize text-gray-900">{addr.mode || 'Address'}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(index)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-1 text-gray-600">
                            <p>{addr.street}</p>
                            <p>{addr.city}, {addr.state} {addr.zip}</p>
                            <p>{addr.country}</p>
                        </div>
                    </div>
                ))}

                {addresses.length === 0 && !showForm && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No addresses saved yet.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-2 text-red-600 font-medium hover:underline"
                        >
                            Add your first address
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressBookPage;

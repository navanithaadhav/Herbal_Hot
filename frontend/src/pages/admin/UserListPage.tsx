import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const UserListPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuthStore();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                console.log('Fetching users. User info:', userInfo);
                const { data } = await api.get('/users', config);
                console.log('Users fetched:', data);
                setUsers(data);
                setLoading(false);
            } catch (err: any) {
                console.error('Fetch users error:', err);
                const msg = err.response?.data?.message || err.message || 'Failed to fetch users';
                toast.error(msg);
                setLoading(false);
            }
        };
        fetchUsers();
    }, [userInfo]);

    const deleteHandler = async (_id: string) => {
        if (window.confirm('Are you sure?')) {
            toast.error('Delete function not implemented yet');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Users</h1>
            {loading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <div className="bg-white shadow-sm overflow-hidden rounded-md border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-900">{user.email}</a></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.role === 'admin' ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Admin</span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">User</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => deleteHandler(user._id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="h-4 w-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserListPage;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    role: string;
    addresses?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        mode?: string;
        mobileNumber?: string;
    }[];
    token: string;
}

interface AuthState {
    userInfo: UserInfo | null;
    setCredentials: (user: UserInfo) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            userInfo: null,
            setCredentials: (user) => set({ userInfo: user }),
            logout: () => set({ userInfo: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

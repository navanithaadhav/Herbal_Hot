import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    _id: string; // Product ID
    name: string;
    image: string;
    price: number;
    category: string;
    countInStock?: number;
}

interface WishlistState {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlistItems: [],
            addToWishlist: (item) => {
                const items = get().wishlistItems;
                const exists = items.find((x) => x._id === item._id);
                if (!exists) {
                    set({ wishlistItems: [...items, item] });
                }
            },
            removeFromWishlist: (id) => {
                set({
                    wishlistItems: get().wishlistItems.filter((x) => x._id !== id),
                });
            },
            isInWishlist: (id) => {
                return !!get().wishlistItems.find((x) => x._id === id);
            },
            clearWishlist: () => set({ wishlistItems: [] }),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);

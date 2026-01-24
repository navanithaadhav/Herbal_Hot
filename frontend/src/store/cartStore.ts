import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    product: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    countInStock: number;
}

export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    mobileNumber: string;
}

interface CartState {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    saveShippingAddress: (data: ShippingAddress) => void;
    savePaymentMethod: (data: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            shippingAddress: { address: '', city: '', postalCode: '', country: '', mobileNumber: '' },
            paymentMethod: 'PayPal',
            addToCart: (item) => {
                console.log('Adding to cart:', item);
                const items = get().cartItems;
                const existItem = items.find((x) => x.product === item.product);

                if (existItem) {
                    console.log('Item exists, updating');
                    set({
                        cartItems: items.map((x) =>
                            x.product === existItem.product ? item : x
                        ),
                    });
                } else {
                    console.log('Item does not exist, adding new');
                    set({ cartItems: [...items, item] });
                }
                console.log('Cart items after update:', get().cartItems);
            },
            removeFromCart: (id) => {
                set({
                    cartItems: get().cartItems.filter((x) => x.product !== id),
                });
            },
            saveShippingAddress: (data) => set({ shippingAddress: data }),
            savePaymentMethod: (data) => set({ paymentMethod: data }),
            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: 'cart-storage',
        }
    )
);

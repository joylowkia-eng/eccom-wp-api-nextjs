'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: number;
    variationId?: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    selectedAttributes?: Array<{
        name: string;
        option: string;
    }>;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (key: string | number) => void;
    updateQuantity: (key: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    toggleCart: () => void;
    getItemKey: (item: any) => string;
    appliedCoupon: any;
    applyCoupon: (coupon: any) => void;
    removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Key generation for cart items to handle variations
    const getItemKey = (item: any) => {
        const id = item.id;
        const vId = item.variationId;
        return (vId && vId !== 0) ? `${id}_${vId}` : `${id}`;
    };

    // Load cart from local storage on mount
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem('cart');
        const savedCoupon = localStorage.getItem('appliedCoupon');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch (e) {
                console.error('Failed to parse coupon', e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
            if (appliedCoupon) {
                localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
            } else {
                localStorage.removeItem('appliedCoupon');
            }
        }
    }, [cartItems, appliedCoupon, isMounted]);

    const addToCart = (newItem: CartItem) => {
        setCartItems(prevItems => {
            const newItemKey = getItemKey(newItem);
            const existingItemIndex = prevItems.findIndex(item => getItemKey(item) === newItemKey);

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + (newItem.quantity || 1)
                };
                return updatedItems;
            }
            return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
        });
    };

    const removeFromCart = (key: string | number) => {
        const stringKey = String(key);
        setCartItems(prevItems => prevItems.filter(item => getItemKey(item) !== stringKey));
    };

    const updateQuantity = (key: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                getItemKey(item) === key ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setAppliedCoupon(null);
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedCoupon');
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const applyCoupon = (coupon: any) => setAppliedCoupon(coupon);
    const removeCoupon = () => setAppliedCoupon(null);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            toggleCart,
            getItemKey,
            appliedCoupon,
            applyCoupon,
            removeCoupon
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

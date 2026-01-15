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
    removeFromCart: (key: string) => void;
    updateQuantity: (key: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Key generation for cart items to handle variations
    const getItemKey = (item: CartItem | { id: number; variationId?: number }) => {
        return item.variationId ? `${item.id}_${item.variationId}` : `${item.id}`;
    };

    // Load cart from local storage on mount
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isMounted]);

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

    const removeFromCart = (key: string) => {
        setCartItems(prevItems => prevItems.filter(item => getItemKey(item) !== key));
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
        localStorage.removeItem('cart');
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

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
            toggleCart
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

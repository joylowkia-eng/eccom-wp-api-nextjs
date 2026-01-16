'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrencySettings } from '@/lib/woocommerce';

interface CurrencyContextType {
    currency: {
        code: string;
        symbol: string;
        position: string;
    };
    formatPrice: (price: number | string) => string;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState({ code: 'USD', symbol: '$', position: 'left' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCurrency() {
            try {
                const settings = await getCurrencySettings();
                setCurrency(settings);
            } catch (error) {
                console.error('Failed to load currency settings:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadCurrency();
    }, []);

    const formatPrice = (price: number | string) => {
        if (typeof price === 'string') {
            // Handle price ranges like "10.00 - 20.00"
            const parts = price.split(' - ');
            if (parts.length === 2) {
                const minPrice = parseFloat(parts[0]).toFixed(2);
                const maxPrice = parseFloat(parts[1]).toFixed(2);
                return `${currency.position === 'left' ? currency.symbol : ''}${minPrice}${currency.position === 'right' ? currency.symbol : ''} - ${currency.position === 'left' ? currency.symbol : ''}${maxPrice}${currency.position === 'right' ? currency.symbol : ''}`;
            }
            // If it's a string but not a range, try to parse it as a single number
            const numPrice = parseFloat(price);
            if (!isNaN(numPrice)) {
                return currency.position === 'left' ? `${currency.symbol}${numPrice.toFixed(2)}` : `${numPrice.toFixed(2)}${currency.symbol}`;
            }
            return price; // Return as is if not a valid number or range
        }

        const val = price.toFixed(2);
        return currency.position === 'left' ? `${currency.symbol}${val}` : `${val}${currency.symbol}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, formatPrice, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomerByEmail } from '@/lib/woocommerce';

export interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<boolean>;
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
    }, []);

    const login = async (email: string, pass: string) => {
        // Since we can't verify passwords via WC REST API directly,
        // we'll "login" any valid user and try to find their WC customer data
        await new Promise(resolve => setTimeout(resolve, 800));

        if (email) {
            let wcId = '1';
            let name = email.split('@')[0];

            try {
                const customer = await getCustomerByEmail(email);
                if (customer) {
                    wcId = customer.id.toString();
                    name = `${customer.first_name} ${customer.last_name}`.trim() || name;
                }
            } catch (e) {
                console.error("Failed to sync with WooCommerce customer", e);
            }

            const userData = {
                id: wcId,
                name: name,
                email
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const register = async (name: string, email: string, pass: string) => {
        // Register simulation
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser = {
            id: Date.now().toString(),
            name,
            email
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

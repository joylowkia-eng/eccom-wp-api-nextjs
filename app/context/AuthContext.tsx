'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomerByEmail, createCustomer } from '@/lib/woocommerce';


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

    const login = async (emailInput: string, pass: string) => {
        const email = emailInput.trim().toLowerCase();
        try {
            console.log("Attempting login for:", email);
            const customer = await getCustomerByEmail(email);

            if (customer) {
                console.log("Customer found:", customer.id);
                const userData = {
                    id: customer.id.toString(),
                    name: `${customer.first_name} ${customer.last_name}`.trim() || email.split('@')[0],
                    email: customer.email
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return true;
            } else {
                console.warn("No WooCommerce customer found with email:", email);
                return false;
            }
        } catch (e) {
            console.error("Login process error:", e);
            return false;
        }
    };

    const register = async (name: string, email: string, pass: string) => {
        try {
            const names = name.split(' ');
            const firstName = names[0];
            const lastName = names.slice(1).join(' ');

            const customerData = {
                email: email,
                first_name: firstName,
                last_name: lastName,
                username: email.split('@')[0], // WooCommerce requires a username or it generates one
                password: pass // This only works if you have certain settings enabled, but we send it anyway
            };

            const newCustomer = await createCustomer(customerData);

            if (newCustomer) {
                const newUser = {
                    id: newCustomer.id.toString(),
                    name: `${newCustomer.first_name} ${newCustomer.last_name}`.trim() || name,
                    email: newCustomer.email
                };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                return true;
            }
            return false;
        } catch (e: any) {
            console.error("Registration failed:", e);
            alert(e.message || "Registration failed. Please try again.");
            return false;
        }
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

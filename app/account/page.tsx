'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { getCustomer, getCurrencySettings, getCustomerOrders } from '@/lib/woocommerce';

export default function AccountPage() {
    const { user } = useAuth();
    const [customer, setCustomer] = useState<any>(null);
    const [currency, setCurrency] = useState({ symbol: '$', position: 'left' });
    const [isLoading, setIsLoading] = useState(true);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        async function loadProfile() {
            if (!user?.id) return;
            try {
                const [data, currencyData, orders] = await Promise.all([
                    getCustomer(parseInt(user.id)),
                    getCurrencySettings(),
                    getCustomerOrders(parseInt(user.id))
                ]);
                setCustomer(data);
                setCurrency(currencyData);
                setOrderCount(orders.length);
            } catch (error) {
                console.error("Error loading account details", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <h1 className="font-display text-4xl font-bold mb-2 text-[#2C2C2C]">My Account</h1>
            <p className="text-[#9E9E9E] mb-[var(--spacing-xl)]">Welcome back, {customer?.first_name || user?.name}</p>

            <div className="space-y-[var(--spacing-lg)]">
                {/* Dashboard Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                        <p className="text-2xl font-bold">{orderCount}</p>
                    </div>
                </div>

                {/* Account Details */}
                <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                    <h2 className="font-display text-2xl font-bold mb-6">Account Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-lg)]">
                        <div>
                            <h3 className="font-semibold text-[#9E9E9E] mb-2 uppercase text-sm">Contact Info</h3>
                            <p className="text-[#2C2C2C] font-semibold">{customer?.first_name} {customer?.last_name}</p>
                            <p className="text-[#2C2C2C]">{customer?.email}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#9E9E9E] mb-2 uppercase text-sm">Default Address</h3>
                            {customer?.billing?.address_1 ? (
                                <div className="text-[#2C2C2C]">
                                    <p>{customer.billing.address_1}</p>
                                    <p>{customer.billing.city}, {customer.billing.postcode}</p>
                                    <p>{customer.billing.country}</p>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">No address set yet.</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <Link href="/account/addresses" className="btn-secondary px-6 py-2 text-sm">
                            Manage Addresses
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

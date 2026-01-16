'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { getCustomerOrders } from '@/lib/woocommerce';

export default function OrdersPage() {
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
            if (!user?.id) return;
            try {
                const ordersData = await getCustomerOrders(parseInt(user.id));
                setOrders(ordersData);
            } catch (error) {
                console.error("Error loading orders", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadOrders();
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
            <h1 className="font-display text-4xl font-bold mb-2 text-[#2C2C2C]">My Orders</h1>
            <p className="text-[#9E9E9E] mb-[var(--spacing-xl)]">View and track your past orders</p>

            <div className="space-y-[var(--spacing-md)]">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm border border-transparent hover:border-[#FFE5E5] transition-all">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-[#2C2C2C]">Order #{order.id}</h3>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide
                                            ${order.status === 'completed' || order.status === 'processing' ? 'bg-green-100 text-green-700' :
                                                order.status === 'cancelled' || order.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#9E9E9E] mt-1">Placed on {new Date(order.date_created).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#B76E79]">{formatPrice(order.total)}</p>
                                    <p className="text-xs text-[#9E9E9E]">{order.line_items.length} {order.line_items.length === 1 ? 'Item' : 'Items'}</p>
                                </div>
                            </div>
                            <div className="border-t border-[#F5F5F5] pt-4 mt-4 flex justify-between items-center text-sm">
                                <div className="text-[#9E9E9E]">
                                    {order.payment_method_title}
                                </div>
                                <Link
                                    href={`/invoice/${order.id}`}
                                    className="font-semibold text-[#B76E79] hover:text-[#D4A5A5] transition-colors flex items-center gap-1"
                                >
                                    View Details
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#FFE5E5]">
                        <p className="text-[#9E9E9E] mb-6">You haven't placed any orders yet.</p>
                        <Link href="/shop" className="btn-primary">
                            Explore Collections
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

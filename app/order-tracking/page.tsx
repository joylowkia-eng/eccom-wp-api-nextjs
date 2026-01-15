'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getOrder } from '@/lib/woocommerce';

export default function OrderTrackingPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        setError('');

        try {
            // Remove hash if user entered it (e.g. #123)
            const cleanId = orderId.replace('#', '').trim();
            const order = await getOrder(cleanId);

            if (!order) {
                setError('Order not found. Please check your Order ID.');
            } else if (order.billing.email.toLowerCase() !== email.toLowerCase()) {
                setError('Email address does not match the record for this Order ID.');
            } else {
                setResult({
                    id: order.id,
                    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                    date: new Date(order.date_created).toLocaleDateString(),
                    items: order.line_items.reduce((acc: number, item: any) => acc + item.quantity, 0),
                    total: `$${order.total}`,
                    estimatedDelivery: order.status === 'completed' ? 'Delivered' : '3-5 Business Days'
                });
            }
        } catch (err) {
            console.error('Tracking error:', err);
            setError('An error occurred while tracking your order. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <PageHeader
                    title="Track Your Order"
                    subtitle="Enter your order ID and email to check the status of your shipment."
                />

                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
                        {error && (
                            <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleTrack} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Order ID</label>
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79] transition-all"
                                    placeholder="e.g. 12345"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Billing Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79] transition-all"
                                    placeholder="Enter billing email"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full btn-primary flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Searching...' : 'Track Order'}
                            </button>
                        </form>
                    </div>

                    {/* Result */}
                    {result && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#B76E79]/20 animate-fade-in">
                            <h3 className="font-display text-2xl font-bold mb-6 text-[#2C2C2C]">Order Status</h3>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-sm text-[#9E9E9E]">Order ID</p>
                                    <p className="font-semibold">#{result.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#9E9E9E]">Date</p>
                                    <p className="font-semibold">{result.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#9E9E9E]">Items</p>
                                    <p className="font-semibold">{result.items} Items</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#9E9E9E]">Total</p>
                                    <p className="font-semibold text-[#B76E79]">{result.total}</p>
                                </div>
                            </div>

                            <div className="bg-[#F9F9F9] rounded-xl p-6 mb-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`w-3 h-3 rounded-full ${result.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                    <span className={`font-bold text-lg ${result.status === 'Completed' ? 'text-green-700' : 'text-amber-700'}`}>{result.status}</span>
                                </div>
                                <p className="text-sm text-[#9E9E9E]">Status Update: {result.estimatedDelivery}</p>
                            </div>

                            <div className="flex gap-4">
                                <Link href="/contact" className="flex-1 btn-secondary text-center text-sm">
                                    Need Help?
                                </Link>
                                <Link href="/shop" className="flex-1 btn-primary text-center text-sm">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

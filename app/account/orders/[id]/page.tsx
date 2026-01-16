'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCurrency } from '@/app/context/CurrencyContext';
import { getOrder } from '@/lib/woocommerce';
import NextImage from 'next/image';

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id as string;
    const { formatPrice } = useCurrency();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadOrder() {
            try {
                const data = await getOrder(orderId);
                setOrder(data);
            } catch (error) {
                console.error("Error loading order", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (orderId) loadOrder();
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                <Link href="/account/orders" className="btn-primary">Back to Orders</Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center gap-2 text-sm text-[#9E9E9E] mb-6">
                <Link href="/account/orders" className="hover:text-[#B76E79]">Orders</Link>
                <span>/</span>
                <span className="text-[#2C2C2C]">Order #{order.id}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="font-display text-3xl font-bold text-[#2C2C2C]">Order #{order.id}</h1>
                <div className="flex items-center gap-4">
                    <Link
                        href={`/invoice/${order.id}`}
                        className="text-[#B76E79] font-semibold hover:text-[#D4A5A5] transition-colors flex items-center gap-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice
                    </Link>
                    <span className={`px-4 py-2 font-semibold rounded-full text-sm uppercase tracking-wide
                        ${order.status === 'completed' || order.status === 'processing' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' || order.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                        }`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <p className="text-[#9E9E9E] mb-[var(--spacing-lg)]">
                Placed on {new Date(order.date_created).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-[var(--spacing-lg)]">
                {/* Order Items */}
                <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                    <h2 className="font-display text-xl font-bold mb-4">Items</h2>
                    <div className="space-y-6">
                        {order.line_items.map((item: any) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F9F9F9] flex-shrink-0 relative">
                                    {item.image?.src ? (
                                        <NextImage src={item.image.src} alt={item.name} fill className="object-cover" sizes="64px" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">?</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-[#2C2C2C]">{item.name}</h3>
                                    <p className="text-sm text-[#9E9E9E]">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-[#2C2C2C]">{formatPrice(item.price)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-lg)]">
                    <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                        <h2 className="font-display text-xl font-bold mb-4">Shipping & Payment</h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="font-semibold text-[#2C2C2C] mb-1">Shipping Address</p>
                                <p className="text-[#9E9E9E]">{order.shipping.first_name} {order.shipping.last_name}</p>
                                <p className="text-[#9E9E9E]">{order.shipping.address_1}</p>
                                <p className="text-[#9E9E9E]">{order.shipping.city}, {order.shipping.postcode}</p>
                                <p className="text-[#9E9E9E]">{order.shipping.country}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[#2C2C2C] mb-1">Payment Method</p>
                                <p className="text-[#9E9E9E]">{order.payment_method_title}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                        <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-[#2C2C2C]">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.total - order.total_tax - order.shipping_total)}</span>
                            </div>
                            {order.total_tax > 0 && (
                                <div className="flex justify-between text-[#2C2C2C]">
                                    <span>Tax</span>
                                    <span>{formatPrice(order.total_tax)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[#2C2C2C]">
                                <span>Shipping</span>
                                <span>{parseFloat(order.shipping_total) === 0 ? 'Free' : formatPrice(order.shipping_total)}</span>
                            </div>
                            <div className="border-t border-[#F5F5F5] pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-[#B76E79]">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

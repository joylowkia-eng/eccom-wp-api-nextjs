'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id;

    // Mock Data
    const order = {
        id: orderId,
        date: 'January 14, 2026',
        status: 'Delivered',
        items: [
            {
                id: 1,
                name: 'Radiant Glow Serum',
                price: 89.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop'
            },
            {
                id: 2,
                name: 'Velvet Matte Lipstick',
                price: 32.99,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop'
            }
        ],
        subtotal: 155.97,
        shipping: 0,
        total: 155.97,
        shippingAddress: {
            name: 'Jane Doe',
            street: '123 Luxury Lane',
            city: 'New York, NY 10001',
            country: 'United States'
        },
        paymentMethod: 'Visa ending in 4242'
    };

    return (
        <>
            <div className="flex items-center gap-2 text-sm text-[#9E9E9E] mb-6">
                <Link href="/account/orders" className="hover:text-[#B76E79]">Orders</Link>
                <span>/</span>
                <span className="text-[#2C2C2C]">Order #{orderId}</span>
            </div>

            <div className="flex justify-between items-start mb-6">
                <h1 className="font-display text-3xl font-bold text-[#2C2C2C]">Order #{orderId}</h1>
                <div className="flex items-center gap-4">
                    <Link
                        href={`/account/orders/${orderId}/invoice`}
                        className="text-[#B76E79] font-semibold hover:text-[#D4A5A5] transition-colors flex items-center gap-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice
                    </Link>
                    <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-full text-sm">
                        {order.status}
                    </span>
                </div>
            </div>

            <p className="text-[#9E9E9E] mb-[var(--spacing-lg)]">Placed on {order.date}</p>

            <div className="space-y-[var(--spacing-lg)]">
                {/* Order Items */}
                <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                    <h2 className="font-display text-xl font-bold mb-4">Items</h2>
                    <div className="space-y-6">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F9F9F9] flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-[#2C2C2C]">{item.name}</h3>
                                    <p className="text-sm text-[#9E9E9E]">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-[#2C2C2C]">${item.price.toFixed(2)}</p>
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
                                <p className="text-[#9E9E9E]">{order.shippingAddress.name}</p>
                                <p className="text-[#9E9E9E]">{order.shippingAddress.street}</p>
                                <p className="text-[#9E9E9E]">{order.shippingAddress.city}</p>
                                <p className="text-[#9E9E9E]">{order.shippingAddress.country}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[#2C2C2C] mb-1">Payment Method</p>
                                <p className="text-[#9E9E9E]">{order.paymentMethod}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                        <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[#2C2C2C]">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#2C2C2C]">
                                <span>Shipping</span>
                                <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="border-t border-[#F5F5F5] pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-[#B76E79]">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

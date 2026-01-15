'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InvoicePage() {
    const params = useParams();
    const orderId = params.id;
    const [isPrinting, setIsPrinting] = useState(false);

    // Mock Data (matching Order Details)
    const order = {
        id: orderId,
        date: 'January 14, 2026',
        dueDate: 'January 14, 2026',
        status: 'Paid',
        items: [
            {
                id: 1,
                name: 'Radiant Glow Serum',
                price: 89.99,
                quantity: 1,
            },
            {
                id: 2,
                name: 'Velvet Matte Lipstick',
                price: 32.99,
                quantity: 2,
            }
        ],
        subtotal: 155.97,
        tax: 12.48,
        shipping: 0,
        total: 168.45,
        customer: {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            address: '123 Luxury Lane',
            city: 'New York, NY 10001',
            country: 'United States'
        },
        company: {
            name: 'Lumière Beauty',
            address: '456 Fashion Ave',
            city: 'New York, NY 10018',
            country: 'United States',
            email: 'support@lumiere.com'
        }
    };

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    return (
        <main className="min-h-screen bg-white text-[#2C2C2C] p-8 md:p-16 print:p-0 pt-32 print:pt-0">
            {/* Added pt-32 to account for fixed header in web view, but print:pt-0 removes it */}
            <div className="max-w-4xl mx-auto border border-gray-200 p-8 shadow-sm print:shadow-none print:border-0">
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="font-display text-4xl font-bold text-[#B76E79] mb-2">INVOICE</h1>
                        <p className="font-semibold text-lg">INV-{order.id}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-display text-2xl font-bold mb-1">{order.company.name}</h2>
                        <p className="text-sm text-gray-500">{order.company.address}</p>
                        <p className="text-sm text-gray-500">{order.company.city}</p>
                        <p className="text-sm text-gray-500">{order.company.email}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-12 border-b border-gray-100 pb-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Bill To</h3>
                        <p className="font-bold">{order.customer.name}</p>
                        <p className="text-gray-600">{order.customer.address}</p>
                        <p className="text-gray-600">{order.customer.city}</p>
                        <p className="text-gray-600">{order.customer.country}</p>
                        <p className="text-gray-600 mt-2">{order.customer.email}</p>
                    </div>
                    <div className="text-right">
                        <div className="space-y-2">
                            <div className="flex justify-end gap-8">
                                <span className="text-gray-500">Invoice Date:</span>
                                <span className="font-semibold">{order.date}</span>
                            </div>
                            <div className="flex justify-end gap-8">
                                <span className="text-gray-500">Due Date:</span>
                                <span className="font-semibold">{order.dueDate}</span>
                            </div>
                            <div className="flex justify-end gap-8">
                                <span className="text-gray-500">Status:</span>
                                <span className="font-semibold px-3 py-0.5 bg-green-100 text-green-700 rounded-full text-xs uppercase tracking-wide">{order.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="py-3 font-bold text-sm text-gray-400 uppercase tracking-wider">Item Description</th>
                                <th className="py-3 font-bold text-sm text-gray-400 uppercase tracking-wider text-center">Qty</th>
                                <th className="py-3 font-bold text-sm text-gray-400 uppercase tracking-wider text-right">Price</th>
                                <th className="py-3 font-bold text-sm text-gray-400 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50">
                                    <td className="py-4 font-medium">{item.name}</td>
                                    <td className="py-4 text-center">{item.quantity}</td>
                                    <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                                    <td className="py-4 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (8%)</span>
                            <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl border-t-2 border-gray-100 pt-3 text-[#2C2C2C]">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
                    <p className="mb-2">Thank you for your business!</p>
                    <p>If you have any questions about this invoice, please contact {order.company.email}</p>
                </div>

                {/* Print Button (Hidden when printing) */}
                <div className="mt-12 text-center print:hidden">
                    <button
                        onClick={handlePrint}
                        className="btn-primary flex items-center gap-2 mx-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download / Print Invoice
                    </button>
                    <p className="mt-4 text-xs text-gray-400">
                        * Use the "Save as PDF" option in the print dialog to download.
                    </p>
                </div>
            </div>
        </main>
    );
}

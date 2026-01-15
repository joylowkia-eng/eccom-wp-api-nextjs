'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrder, getCurrencySettings } from '@/lib/woocommerce';

export default function InvoicePage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currency, setCurrency] = useState({ symbol: '$', position: 'left' });
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        async function loadOrder() {
            try {
                const [orderData, currencyData] = await Promise.all([
                    getOrder(orderId),
                    getCurrencySettings()
                ]);
                setOrder(orderData);
                setCurrency(currencyData);
            } catch (error) {
                console.error('Error loading invoice:', error);
            } finally {
                setIsLoading(false);
            }
        }
        if (orderId) loadOrder();
    }, [orderId]);

    const formatPrice = (price: number | string) => {
        const val = typeof price === 'string' ? parseFloat(price) : price;
        const formatted = val.toFixed(2);
        return currency.position === 'left' ? `${currency.symbol}${formatted}` : `${formatted}${currency.symbol}`;
    };

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B76E79]"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-32 text-center text-red-500">
                Order not found.
            </div>
        );
    }
    const companyInfo = {
        name: 'Lumière Beauty',
        address: '456 Fashion Ave',
        city: 'New York, NY 10018',
        email: 'support@lumiere.com'
    };

    return (
        <main className="min-h-screen bg-white text-[#2C2C2C] p-8 md:p-16 print:p-0 pt-32 print:pt-0">
            {/* Added pt-32 to account for fixed header in web view, but print:pt-0 removes it */}
            <div className="max-w-4xl mx-auto border border-gray-200 p-8 shadow-sm print:shadow-none print:border-0">
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="font-display text-4xl font-bold text-[#B76E79] mb-2">INVOICE</h1>
                        <p className="font-semibold text-lg">INV-#{order.id}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-display text-2xl font-bold mb-1">{companyInfo.name}</h2>
                        <p className="text-sm text-gray-500">{companyInfo.address}</p>
                        <p className="text-sm text-gray-500">{companyInfo.city}</p>
                        <p className="text-sm text-gray-500">{companyInfo.email}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-12 border-b border-gray-100 pb-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Bill To</h3>
                        <p className="font-bold">{order.billing.first_name} {order.billing.last_name}</p>
                        <p className="text-gray-600">{order.billing.address_1}</p>
                        <p className="text-gray-600">{order.billing.city}, {order.billing.postcode}</p>
                        <p className="text-gray-600">{order.billing.country}</p>
                        <p className="text-gray-600 mt-2">{order.billing.email}</p>
                    </div>
                    <div className="text-right">
                        <div className="space-y-2">
                            <div className="flex justify-end gap-8">
                                <span className="text-gray-500">Invoice Date:</span>
                                <span className="font-semibold">{new Date(order.date_created).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-end gap-8">
                                <span className="text-gray-500">Status:</span>
                                <span className={`font-semibold px-3 py-0.5 rounded-full text-xs uppercase tracking-wide ${order.status === 'completed' || order.status === 'processing' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-end gap-8">
                                <span className="text-gray-500">Payment Method:</span>
                                <span className="font-semibold">{order.payment_method_title}</span>
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
                            {order.line_items.map((item: any) => (
                                <tr key={item.id} className="border-b border-gray-50">
                                    <td className="py-4 font-medium">{item.name}</td>
                                    <td className="py-4 text-center">{item.quantity}</td>
                                    <td className="py-4 text-right">{formatPrice(item.price)}</td>
                                    <td className="py-4 text-right font-semibold">{formatPrice(item.total)}</td>
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
                            <span>{formatPrice(order.total - order.total_tax - order.shipping_total)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>{formatPrice(order.total_tax)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{parseFloat(order.shipping_total) === 0 ? 'Free' : formatPrice(order.shipping_total)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl border-t-2 border-gray-100 pt-3 text-[#2C2C2C]">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
                    <p className="mb-2">Thank you for your business!</p>
                    <p>If you have any questions about this invoice, please contact {companyInfo.email}</p>
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

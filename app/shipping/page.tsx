'use client';

export default function ShippingPage() {
    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-[var(--spacing-xl)] shadow-sm">
                    <h1 className="font-display text-4xl font-bold mb-8 text-[#2C2C2C]">Shipping Information</h1>

                    <div className="space-y-8 text-[#2C2C2C] leading-relaxed">
                        <section>
                            <h2 className="font-display text-2xl font-semibold mb-4 text-[#B76E79]">Shipping Policy</h2>
                            <p className="mb-4">
                                At Lumière, we strive to deliver your products as quickly and safely as possible. We offer worldwide shipping to over 200 countries.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-semibold mb-4 text-[#B76E79]">Processing Time</h2>
                            <p className="mb-4">
                                Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-semibold mb-4 text-[#B76E79]">Shipping Rates & Estimates</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-2 font-semibold">Method</th>
                                            <th className="py-2 font-semibold">Time</th>
                                            <th className="py-2 font-semibold">Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Standard Shipping</td>
                                            <td className="py-2">5-7 Business Days</td>
                                            <td className="py-2">$5.99 (Free over $50)</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Express Shipping</td>
                                            <td className="py-2">2-3 Business Days</td>
                                            <td className="py-2">$15.00</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">Overnight Shipping</td>
                                            <td className="py-2">1 Business Day</td>
                                            <td className="py-2">$25.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

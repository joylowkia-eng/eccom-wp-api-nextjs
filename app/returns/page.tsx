'use client';

export default function ReturnsPage() {
    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-[var(--spacing-xl)] shadow-sm">
                    <h1 className="font-display text-4xl font-bold mb-8 text-[#2C2C2C]">Returns & Exchanges</h1>

                    <div className="space-y-8 text-[#2C2C2C] leading-relaxed">
                        <section>
                            <h2 className="font-display text-2xl font-semibold mb-4 text-[#B76E79]">Our Guarantee</h2>
                            <p className="mb-4">
                                We want you to be completely satisfied with your Lumière purchase. If you are not happy with your order, we accept returns within 30 days of delivery.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-semibold mb-4 text-[#B76E79]">Conditions</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li>Products must be returned in their original packaging.</li>
                                <li>Items must be unused or gently used (at least 75% product remaining).</li>
                                <li>Proof of purchase is required.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-semibold mb-4 text-[#B76E79]">How to Return</h2>
                            <p className="mb-4">
                                To initiate a return, please email our support team at <a href="mailto:support@lumiere.com" className="text-[#B76E79] underline">support@lumiere.com</a> with your order number. We will provide you with a prepaid shipping label.
                            </p>
                            <p>
                                Once received, refunds are processed within 5-7 business days to the original payment method.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

'use client';

import PageHeader from '@/components/PageHeader';

export default function FAQPage() {
    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <PageHeader
                        title="Frequently Asked Questions"
                        subtitle="Find answers to common questions about our products and services."
                    />

                    <div className="grid gap-[var(--spacing-md)]">
                        {[
                            {
                                q: "Are your products cruelty-free?",
                                a: "Yes, all Lumière products are 100% cruelty-free and vegan. We do not test on animals at any stage of product development."
                            },
                            {
                                q: "Do you ship internationally?",
                                a: "Yes, we ship to over 200 countries worldwide. International shipping rates vary by location and are calculated at checkout."
                            },
                            {
                                q: "Can I cancel my order?",
                                a: "Orders can be cancelled within 1 hour of placement. After that, we cannot guarantee cancellation as our warehouse processes orders quickly."
                            },
                            {
                                q: "Are your products suitable for sensitive skin?",
                                a: "Most of our products are formulated to be gentle on all skin types. However, we recommend checking the ingredients list and performing a patch test before use."
                            },
                            {
                                q: "How do I track my order?",
                                a: "Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order in your account dashboard."
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-display text-xl font-bold mb-3 text-[#2C2C2C]">{item.q}</h3>
                                <p className="text-gray-600">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

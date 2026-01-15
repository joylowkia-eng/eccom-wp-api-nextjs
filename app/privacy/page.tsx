'use client';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-[var(--spacing-xl)] shadow-sm">
                    <h1 className="font-display text-4xl font-bold mb-8 text-[#2C2C2C]">Privacy Policy</h1>

                    <div className="space-y-8 text-[#2C2C2C] leading-relaxed text-sm md:text-base">
                        <section>
                            <h2 className="font-display text-xl font-bold mb-4 text-[#B76E79]">1. Introduction</h2>
                            <p className="mb-4 text-gray-600">
                                This Privacy Policy describes how Lumière ("we," "us," or "our") collects, uses, and discloses your personal information when you visit or make a purchase from our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-xl font-bold mb-4 text-[#B76E79]">2. Information We Collect</h2>
                            <p className="mb-4 text-gray-600">
                                We collect various types of information, including:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li><strong>Personal Information:</strong> Name, email address, shipping address, billing address, and phone number.</li>
                                <li><strong>Payment Information:</strong> Credit card numbers and payment details (processed securely by our payment providers).</li>
                                <li><strong>Usage Data:</strong> Information about how you use our site, including IP address, browser type, and pages visited.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-display text-xl font-bold mb-4 text-[#B76E79]">3. How We Use Your Information</h2>
                            <p className="mb-4 text-gray-600">
                                We use your info to fulfill orders, communicate with you, screen for potential risk or fraud, and improve our website and marketing campaigns.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-xl font-bold mb-4 text-[#B76E79]">4. Sharing Your Information</h2>
                            <p className="mb-4 text-gray-600">
                                We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store and Google Analytics to help us understand how our customers use the Site.
                            </p>
                        </section>

                        <section>
                            <p className="text-gray-500 text-xs mt-8 border-t pt-4">
                                Last Updated: January 15, 2026
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

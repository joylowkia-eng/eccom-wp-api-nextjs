'use client';

import PageHeader from '@/components/PageHeader';

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                {/* Hero Section */}
                <PageHeader
                    title="Our Story"
                    subtitle="Redefining beauty with a commitment to nature, science, and luxury."
                />

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-2xl)] items-center mb-[var(--spacing-2xl)]">
                    <div className="order-2 lg:order-1 space-y-[var(--spacing-lg)]">
                        <h2 className="font-display text-3xl font-bold text-[#2C2C2C]">
                            Crafted for Elegance
                        </h2>
                        <div className="w-20 h-1 bg-[#B76E79]"></div>
                        <p className="text-[#2C2C2C] leading-loose">
                            Founded in 2025, Lumière was born from a desire to create skincare and beauty products that bridge the gap between effective science and luxurious self-care. We believe that your beauty routine should be a ritual—a moment of calm in a busy world.
                        </p>
                        <p className="text-[#2C2C2C] leading-loose">
                            Our formulations are meticulously crafted using the finest botanical ingredients, ethically sourced and combined with clinical-grade actives to deliver visible results without compromising on the sensory experience.
                        </p>

                        <div className="pt-4 grid grid-cols-2 gap-[var(--spacing-md)]">
                            <div>
                                <h4 className="font-bold text-xl text-[#B76E79] mb-2">100%</h4>
                                <p className="text-sm text-[#9E9E9E]">Vegan & Cruelty-Free</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-[#B76E79] mb-2">50k+</h4>
                                <p className="text-sm text-[#9E9E9E]">Happy Customers</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-standard">
                            <img
                                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=1000&fit=crop"
                                alt="Our ingredients"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-white rounded-3xl p-[var(--spacing-xl)] shadow-sm">
                    <div className="text-center mb-[var(--spacing-xl)]">
                        <h2 className="font-display text-3xl font-bold text-[#2C2C2C]">Our Core Values</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-lg)] text-center">
                        <div className="p-[var(--spacing-md)]">
                            <div className="w-16 h-16 bg-[#FFE5E5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#B76E79]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3">Sustainable</h3>
                            <p className="text-[#9E9E9E]">We prioritize eco-friendly packaging and ethical sourcing for a better planet.</p>
                        </div>
                        <div className="p-[var(--spacing-md)]">
                            <div className="w-16 h-16 bg-[#FFE5E5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#B76E79]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3">Scientific</h3>
                            <p className="text-[#9E9E9E]">Our formulas are backed by science and rigorous testing for proven efficacy.</p>
                        </div>
                        <div className="p-[var(--spacing-md)]">
                            <div className="w-16 h-16 bg-[#FFE5E5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#B76E79]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3">Inclusive</h3>
                            <p className="text-[#9E9E9E]">Beauty is for everyone. Our products are designed for diverse skin types and tones.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

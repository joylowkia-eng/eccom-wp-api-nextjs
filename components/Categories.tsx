'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { getCategories, WooCommerceCategory } from '@/lib/woocommerce';

gsap.registerPlugin(ScrollTrigger);

export default function Categories() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fallbackColors = [
        'from-[#B76E79] to-[#D4A5A5]',
        'from-[#D4A5A5] to-[#F7E7CE]',
        'from-[#F7E7CE] to-[#D4AF37]',
        'from-[#D4AF37] to-[#B76E79]',
    ];

    useEffect(() => {
        async function loadCategories() {
            try {
                const wcCategories = await getCategories();
                // Filter out 'Uncategorized' and limit to 4 for the homepage grid
                const filtered = wcCategories
                    .filter((c: WooCommerceCategory) => c.name.toLowerCase() !== 'uncategorized' && c.count > 0)
                    .slice(0, 4)
                    .map((c: WooCommerceCategory, index: number) => ({
                        name: c.name,
                        description: c.description || 'Explore our collection',
                        image: c.image?.src || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=800&fit=crop',
                        href: `/category/${c.slug}`,
                        color: fallbackColors[index % fallbackColors.length],
                    }));

                setCategories(filtered);
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadCategories();
    }, []);

    useEffect(() => {
        if (categories.length === 0) return;

        const ctx = gsap.context(() => {
            const cards = categoriesRef.current?.children;
            if (cards) {
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: categoriesRef.current,
                        start: 'top 70%',
                    },
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'back.out(1.2)',
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [categories]);

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-2xl aspect-[3/4] bg-gray-100 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section ref={sectionRef} className="py-20 bg-white">
            <div className="container">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-[#FFE5E5] rounded-full text-sm font-semibold text-[#B76E79] mb-4">
                        Shop by Category
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                        Explore Our <span className="gradient-text">Collections</span>
                    </h2>
                    <p className="text-lg text-[#2C2C2C]/70 max-w-2xl mx-auto">
                        Find the perfect products for your beauty routine
                    </p>
                </div>

                <div
                    ref={categoriesRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={category.href}
                            className="group relative overflow-hidden rounded-2xl aspect-[3/4] hover-lift"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
                            </div>

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-end p-6 text-white">
                                <p className="text-sm font-medium mb-2 opacity-90 line-clamp-1">
                                    {category.description}
                                </p>
                                <h3 className="font-display text-3xl font-bold mb-4">
                                    {category.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-4 transition-all duration-300">
                                    <span>Shop Now</span>
                                    <svg
                                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white opacity-50"></div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

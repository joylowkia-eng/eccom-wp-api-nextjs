'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import { getProducts, mapWooCommerceProduct, WooCommerceProduct } from '@/lib/woocommerce';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const productsRef = useRef<HTMLDivElement>(null);

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadFeatured() {
            try {
                // Fetch featured products (featured=true in WooCommerce)
                const wcProducts = await getProducts({ per_page: 8, featured: true });

                // If no featured products found, just fetch any 8 products
                let finalProducts = wcProducts;
                if (!wcProducts || wcProducts.length === 0) {
                    finalProducts = await getProducts({ per_page: 8 });
                }

                setProducts(finalProducts.map((p: WooCommerceProduct) => mapWooCommerceProduct(p)));
            } catch (error) {
                console.error('Error loading featured products:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadFeatured();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        const ctx = gsap.context(() => {
            // Animate title
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            });

            // Animate product cards
            const cards = productsRef.current?.children;
            if (cards) {
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: productsRef.current,
                        start: 'top 70%',
                    },
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [products]);

    return (
        <section ref={sectionRef} className="py-20 bg-[#FFF8F0]">
            <div className="container">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-[#FFE5E5] rounded-full text-sm font-semibold text-[#B76E79] mb-4">
                        Featured Products
                    </span>
                    <h2 ref={titleRef} className="font-display text-4xl md:text-5xl font-bold mb-4">
                        Bestselling <span className="gradient-text">Beauty</span>
                    </h2>
                    <p className="text-lg text-[#2C2C2C]/70 max-w-2xl mx-auto">
                        Discover our most-loved products, handpicked for their exceptional quality and results
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div
                        ref={productsRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link href="/shop" className="btn-primary text-lg px-8 py-4 inline-block">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import FeatureCard from '@/components/FeatureCard';
import { getTags, getCategories, WooCommerceCategory } from '@/lib/woocommerce';

export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadBrands() {
            try {
                // We'll try to get brands from two places:
                // 1. Tags (most common for brands without a plugin)
                // 2. Categories that have 'brand' in their name
                const [tags, categories] = await Promise.all([
                    getTags(),
                    getCategories()
                ]);

                const brandsFromTags = tags
                    .filter((t: any) => t.count > 0)
                    .map((t: any) => ({
                        name: t.name,
                        description: t.description || `Discover the exclusive collection from ${t.name}.`,
                        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', // Fallback
                        type: 'tag'
                    }));

                const brandsFromCategories = categories
                    .filter((c: WooCommerceCategory) => c.name.toLowerCase().includes('brand') && c.count > 0)
                    .map((c: WooCommerceCategory) => ({
                        name: c.name.replace(/brand/gi, '').trim(),
                        description: c.description || `Luxury products from ${c.name}.`,
                        image: c.image?.src || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
                        type: 'category'
                    }));

                // Combine and de-duplicate
                const combined = [...brandsFromCategories, ...brandsFromTags];
                const uniqueBrands = combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);

                // If no brands found, show some placeholders so the page isn't empty
                if (uniqueBrands.length === 0) {
                    setBrands([
                        {
                            name: 'Lumière',
                            description: 'Our signature collection of premium skincare and cosmetics.',
                            image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
                        }
                    ]);
                } else {
                    setBrands(uniqueBrands.slice(0, 12));
                }
            } catch (error) {
                console.error('Error loading brands:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadBrands();
    }, []);

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <PageHeader
                    title="Our Brands"
                    subtitle="Curated partners that share our commitment to quality and luxury."
                />

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-lg)]">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-80 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-lg)]">
                        {brands.map((brand) => (
                            <FeatureCard
                                key={brand.name}
                                title={brand.name}
                                description={brand.description}
                                image={brand.image}
                                href={`/brand/${encodeURIComponent(brand.name)}`}
                                linkText="View Products"
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

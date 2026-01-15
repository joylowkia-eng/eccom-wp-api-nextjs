'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import FeatureCard from '@/components/FeatureCard';
import { getCategories, WooCommerceCategory } from '@/lib/woocommerce';

export default function CollectionsPage() {
    const [collections, setCollections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCollections() {
            try {
                const wcCategories = await getCategories();
                const mapped = wcCategories
                    .filter((c: WooCommerceCategory) => c.name.toLowerCase() !== 'uncategorized')
                    .map((c: WooCommerceCategory) => ({
                        name: c.name,
                        description: c.description || `Discover our ${c.name} collection.`,
                        image: c.image?.src || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
                        count: c.count,
                        slug: c.slug
                    }));
                setCollections(mapped);
            } catch (error) {
                console.error('Error loading collections:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadCollections();
    }, []);

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <PageHeader
                    title="Collections"
                    subtitle="Explore our varied range of beauty categories"
                />

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-lg)]">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-80 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-lg)]">
                        {collections.map((collection) => (
                            <FeatureCard
                                key={collection.name}
                                title={collection.name}
                                description={collection.description}
                                image={collection.image}
                                href={`/category/${collection.slug}`}
                                linkText={`Explore ${collection.name}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

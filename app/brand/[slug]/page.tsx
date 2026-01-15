'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getProducts, mapWooCommerceProduct, WooCommerceProduct } from '@/lib/woocommerce';

export default function BrandPage() {
    const params = useParams();
    const slug = params.slug as string;
    const brandName = decodeURIComponent(slug);

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadBrandProducts() {
            setIsLoading(true);
            try {
                // Fetch products and filter by brand name
                // In a real WooCommerce setup, brands are often specific attributes or tags.
                // For now, we fetch a batch and filter using our mapping logic.
                const wcProducts = await getProducts({ per_page: 100 });
                const filtered = wcProducts
                    .map((p: WooCommerceProduct) => mapWooCommerceProduct(p))
                    .filter((p: any) => p.brand === brandName || p.brand.toLowerCase() === brandName.toLowerCase());

                setProducts(filtered);
            } catch (error) {
                console.error('Error loading brand products:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadBrandProducts();
    }, [brandName]);

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-[#9E9E9E]">
                    <Link href="/" className="hover:text-[#B76E79] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/brands" className="hover:text-[#B76E79] transition-colors">Brands</Link>
                    <span>/</span>
                    <span className="text-[#2C2C2C]">{brandName}</span>
                </nav>

                <PageHeader
                    title={brandName}
                    subtitle={`Discover premium products from ${brandName}`}
                />

                {/* Products Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--spacing-lg)]">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-xl text-[#9E9E9E] mb-4">No products found for this brand.</p>
                        <Link href="/brands" className="btn-primary inline-block">
                            View All Brands
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

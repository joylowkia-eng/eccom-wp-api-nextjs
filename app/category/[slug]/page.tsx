'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getProducts, getCategories, mapWooCommerceProduct, WooCommerceProduct, WooCommerceCategory } from '@/lib/woocommerce';

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [products, setProducts] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState(slug.charAt(0).toUpperCase() + slug.slice(1));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCategoryData() {
            setIsLoading(true);
            try {
                // 1. Fetch categories to find the ID and proper name
                const categories = await getCategories();
                const category = categories.find((c: WooCommerceCategory) => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());

                if (category) {
                    setCategoryName(category.name);
                    // 2. Fetch products for this category
                    const wcProducts = await getProducts({ category: String(category.id), per_page: 40 });
                    setProducts(wcProducts.map((p: WooCommerceProduct) => mapWooCommerceProduct(p)));
                } else {
                    // Fallback: try to search for products with this slug
                    const wcProducts = await getProducts({ per_page: 40 });
                    const filtered = wcProducts
                        .filter((p: WooCommerceProduct) => p.categories.some(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase()))
                        .map((p: WooCommerceProduct) => mapWooCommerceProduct(p));
                    setProducts(filtered);
                }
            } catch (error) {
                console.error('Error loading category products:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadCategoryData();
    }, [slug]);

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)]">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-[#9E9E9E]">
                    <Link href="/" className="hover:text-[#B76E79] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[#B76E79] transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-[#2C2C2C]">{categoryName}</span>
                </nav>

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 gradient-text">
                        {categoryName}
                    </h1>
                    <p className="text-lg text-[#9E9E9E] max-w-2xl mx-auto">
                        Explore our exclusive collection of {categoryName.toLowerCase()} products
                    </p>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#F9F9F9] rounded-2xl">
                        <p className="text-xl text-[#9E9E9E] mb-4">No products found in this category.</p>
                        <Link href="/shop" className="btn-primary inline-block">
                            Browse All Products
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

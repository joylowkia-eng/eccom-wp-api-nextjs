'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories, mapWooCommerceProduct, WooCommerceProduct, WooCommerceCategory } from '@/lib/woocommerce';

export default function ShopPage() {
    const searchParams = useSearchParams();

    // UI State
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [isLoading, setIsLoading] = useState(true);

    // Filter State
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState('Featured');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [brandQuery, setBrandQuery] = useState(searchParams.get('brand') || '');

    const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'];

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [wcProducts, wcCategories] = await Promise.all([
                getProducts({ per_page: 100 }),
                getCategories()
            ]);

            setProducts(wcProducts.map((p: WooCommerceProduct) => mapWooCommerceProduct(p)));
            setCategories(['All', ...wcCategories.map((c: WooCommerceCategory) => c.name)]);
        } catch (error) {
            console.error('Failed to load shop data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Sync state with URL if it changes
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
        setBrandQuery(searchParams.get('brand') || '');
        setSelectedCategory(searchParams.get('category') || 'All');
    }, [searchParams]);

    // Memoized Filtered Products - Only recalculates when filters or products change
    const filteredProducts = useMemo(() => {
        return products
            .filter(p => selectedCategory === 'All' || p.categories.includes(selectedCategory))
            .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
            .filter(p => !brandQuery || p.brand === brandQuery)
            .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => {
                if (sortBy === 'Price: Low to High') return a.price - b.price;
                if (sortBy === 'Price: High to Low') return b.price - a.price;
                if (sortBy === 'Newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
                return 0;
            });
    }, [products, selectedCategory, priceRange, brandQuery, searchQuery, sortBy]);

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                {/* Page Header */}
                <div className="text-center mb-[var(--spacing-2xl)]">
                    <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 gradient-text">
                        {brandQuery ? `Products by ${brandQuery}` : searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory !== 'All' ? selectedCategory : 'Our Collection'}
                    </h1>
                    <p className="text-lg text-[#9E9E9E] max-w-2xl mx-auto">
                        Discover our curated selection of premium beauty products
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-[var(--spacing-lg)]">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-[var(--spacing-md)] shadow-md sticky top-32">
                            {/* Categories */}
                            <div className="mb-[var(--spacing-lg)]">
                                <h3 className="font-semibold text-lg mb-4 text-[#2C2C2C]">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${selectedCategory === category
                                                ? 'bg-gradient-to-r from-[#B76E79] to-[#D4A5A5] text-white'
                                                : 'text-[#2C2C2C] hover:bg-[#FFE5E5]'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-[var(--spacing-lg)]">
                                <h3 className="font-semibold text-lg mb-4 text-[#2C2C2C]">Price Range</h3>
                                <div className="space-y-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className="w-full accent-[#B76E79]"
                                    />
                                    <div className="flex justify-between text-sm text-[#9E9E9E]">
                                        <span>$0</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 text-[#2C2C2C]">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-[#FFE5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-[#9E9E9E]">
                                {isLoading ? 'Loading products...' : `Showing ${filteredProducts.length} products`}
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} {...product} />
                                    ))}
                                </div>

                                {filteredProducts.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-xl text-[#9E9E9E]">
                                            {brandQuery
                                                ? `No products found by ${brandQuery}`
                                                : searchQuery
                                                    ? `No products found matching "${searchQuery}"`
                                                    : 'No products found'}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

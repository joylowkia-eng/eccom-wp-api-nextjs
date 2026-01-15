'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/app/context/WishlistContext';

export default function WishlistPage() {
    const { wishlistItems } = useWishlist();

    return (
        <>
            <h1 className="font-display text-4xl font-bold mb-2 text-[#2C2C2C]">My Wishlist</h1>
            <p className="text-[#9E9E9E] mb-[var(--spacing-xl)]">Save your favorite items for later</p>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
                    {wishlistItems.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-[var(--spacing-2xl)] bg-white rounded-2xl">
                    <p className="text-lg text-[#9E9E9E]">Your wishlist is empty.</p>
                    <Link href="/shop" className="btn-primary mt-6 inline-block">
                        Start Shopping
                    </Link>
                </div>
            )}
        </>
    );
}

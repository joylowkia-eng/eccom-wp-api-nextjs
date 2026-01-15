'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    image: string;
    category?: string;
    rating?: number;
    isNew?: boolean;
    onSale?: boolean;
    salePrice?: number;
    inStock?: boolean;
}

export default function ProductCard({
    id,
    name,
    price,
    image,
    category,
    rating = 5,
    isNew = false,
    onSale = false,
    salePrice,
    inStock = true,
}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!inStock) return;
        addToCart({
            id,
            name,
            price: onSale && salePrice ? salePrice : price,
            image,
            quantity: 1,
        });
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isWishlisted) {
            removeFromWishlist(id);
        } else {
            addToWishlist({
                id,
                name,
                price,
                image,
                inStock,
                category,
                rating,
                isNew,
                onSale,
                salePrice
            });
        }
    };

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: 'var(--shadow-md)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {isNew && (
                    <span className="px-3 py-1 bg-[#B76E79] text-white text-xs font-semibold rounded-full">
                        NEW
                    </span>
                )}
                {onSale && (
                    <span className="px-3 py-1 bg-[#D4AF37] text-white text-xs font-semibold rounded-full">
                        SALE
                    </span>
                )}
                {!inStock && (
                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
                        OUT OF STOCK
                    </span>
                )}
            </div>

            {/* Quick Actions */}
            <div
                className={`absolute top-4 right-4 z-10 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
            >
                {/* Wishlist Button - Hidden if In Stock AND Not in Wishlist (per user request) */}
                {(!inStock || isWishlisted) && (
                    <button
                        onClick={toggleWishlist}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${isWishlisted ? 'bg-[#FFE5E5] text-red-500' : 'bg-white text-[#B76E79] hover:bg-[#FFE5E5]'
                            }`}
                        aria-label="Add to wishlist"
                    >
                        <svg
                            className="w-5 h-5"
                            fill={isWishlisted ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                )}

                <button
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFE5E5] transition-colors duration-300 text-[#B76E79]"
                    aria-label="Quick view"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                </button>
            </div>

            {/* Product Image */}
            <Link href={`/product/${id}`}>
                <div className="image-zoom-container aspect-[4/5] bg-[#F5F5F5] w-full relative">
                    <img
                        src={image}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-[var(--spacing-md)]">
                {category && (
                    <p className="text-xs text-[#9E9E9E] uppercase tracking-wider mb-2">
                        {category}
                    </p>
                )}

                <Link href={`/product/${id}`}>
                    <h3 className="font-semibold text-[#2C2C2C] mb-2 line-clamp-2 hover:text-[#B76E79] transition-colors duration-300">
                        {name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-[#D4AF37]' : 'text-gray-300'
                                }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-xs text-[#9E9E9E] ml-1">({rating}.0)</span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {onSale && salePrice ? (
                            <>
                                <span className="text-xl font-bold text-[#B76E79]">
                                    ${salePrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-[#9E9E9E] line-through">
                                    ${price.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-[#2C2C2C]">
                                ${price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${inStock
                            ? 'bg-gradient-to-br from-[#B76E79] to-[#D4A5A5] text-white hover:shadow-lg hover:scale-110'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Add to cart"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useCart } from '@/app/context/CartContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { validateCoupon } from '@/lib/woocommerce';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, getItemKey, appliedCoupon, applyCoupon, removeCoupon } = useCart();
    const { formatPrice } = useCurrency();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const discountAmount = appliedCoupon ? (appliedCoupon.discount_type === 'percent' ? (cartTotal * parseFloat(appliedCoupon.amount) / 100) : parseFloat(appliedCoupon.amount)) : 0;
    const total = cartTotal - discountAmount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponError('');
        try {
            const coupon = await validateCoupon(couponCode);
            if (coupon) {
                applyCoupon(coupon);
                setCouponCode('');
            } else {
                setCouponError('Invalid coupon code');
            }
        } catch (error) {
            setCouponError('Error validating coupon');
        }
    };

    const handleQuantityChange = (item: any, change: number) => {
        const key = getItemKey(item);
        updateQuantity(key, item.quantity + change);
    }

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <div className="text-center mb-[var(--spacing-xl)]">
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        Shopping Cart
                    </h1>
                    <p className="text-[#9E9E9E]">
                        {cartItems.length} items in your bag
                    </p>
                </div>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-[var(--spacing-xl)]">
                        {/* Cart Items List */}
                        <div className="flex-1 space-y-[var(--spacing-md)]">
                            {cartItems.map((item) => (
                                <div
                                    key={getItemKey(item)}
                                    className="bg-white rounded-2xl p-[var(--spacing-md)] shadow-sm flex flex-col sm:flex-row gap-[var(--spacing-md)] items-center"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden aspect-square relative">
                                        <NextImage
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100px, 150px"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="font-display font-bold text-lg text-[#2C2C2C] hover:text-[#B76E79] transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                        {item.selectedAttributes && item.selectedAttributes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {item.selectedAttributes.map((attr) => (
                                                    <span key={attr.name} className="text-xs bg-[#F9F9F9] px-2 py-0.5 rounded text-[#9E9E9E] border border-[#FFE5E5]">
                                                        {attr.name}: {attr.option}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="mt-2 font-bold text-[#B76E79]">
                                            {formatPrice(item.price)}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center border border-[#FFE5E5] rounded-lg">
                                            <button
                                                onClick={() => handleQuantityChange(item, -1)}
                                                className="px-3 py-1 hover:bg-[#FFE5E5] transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 font-semibold min-w-[2rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item, 1)}
                                                className="px-3 py-1 hover:bg-[#FFE5E5] transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(getItemKey(item))}
                                            className="text-sm text-[#9E9E9E] hover:text-red-500 transition-colors underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96 flex-shrink-0">
                            <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-md sticky top-32">
                                <h3 className="font-display text-2xl font-bold mb-[var(--spacing-md)]">Order Summary</h3>

                                <div className="space-y-[var(--spacing-sm)] mb-[var(--spacing-md)]">
                                    {/* Coupon Section */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="flex-1 px-3 py-2 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] outline-none text-sm transition-all"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                className="px-4 py-2 bg-[#2C2C2C] text-white text-xs font-bold rounded-lg hover:bg-black transition-all"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
                                        {appliedCoupon && (
                                            <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-green-200">
                                                <span className="text-[10px] text-green-700 font-bold">Applied: {appliedCoupon.code}</span>
                                                <button onClick={removeCoupon} className="text-[10px] text-red-500 hover:underline">Remove</button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between text-[#2C2C2C] text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">{formatPrice(cartTotal)}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600 text-sm">
                                            <span>Discount</span>
                                            <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-[#FFE5E5] pt-[var(--spacing-sm)] flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-[#B76E79]">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full btn-primary text-center mb-4"
                                >
                                    Proceed to Checkout
                                </Link>

                                <Link
                                    href="/shop"
                                    className="block w-full text-center text-sm text-[#9E9E9E] hover:text-[#B76E79] transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <div className="mb-6">
                            <svg className="w-24 h-24 text-[#FFE5E5] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-[#9E9E9E] mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link href="/shop" className="btn-primary inline-block">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

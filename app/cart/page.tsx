'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

    const shipping = cartTotal > 100 ? 0 : 15;
    const total = cartTotal + shipping;

    // Use updateQuantity from context which takes (id, quantity)
    // We need to wrap it to handle the +/- logic here if we want, or just pass quantity
    const handleQuantityChange = (id: number, currentQty: number, change: number) => {
        updateQuantity(id, currentQty + change);
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
                                    key={item.id}
                                    className="bg-white rounded-2xl p-[var(--spacing-md)] shadow-sm flex flex-col sm:flex-row gap-[var(--spacing-md)] items-center"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden aspect-square">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
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
                                        {item.color && <p className="text-sm text-[#9E9E9E] mt-1">{item.color}</p>}
                                        <div className="mt-2 font-bold text-[#B76E79]">
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Quantity & Actions */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center border border-[#FFE5E5] rounded-lg">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                className="px-3 py-1 hover:bg-[#FFE5E5] transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 font-semibold min-w-[2rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                className="px-3 py-1 hover:bg-[#FFE5E5] transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
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
                                    <div className="flex justify-between text-[#2C2C2C]">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#2C2C2C]">
                                        <span>Shipping</span>
                                        <span className="font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="border-t border-[#FFE5E5] pt-[var(--spacing-sm)] flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-[#B76E79]">${total.toFixed(2)}</span>
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

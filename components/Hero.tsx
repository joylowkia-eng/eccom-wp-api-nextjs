'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Timeline for hero animations
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                delay: 0.3,
            })
                .from(
                    subtitleRef.current,
                    {
                        y: 50,
                        opacity: 0,
                        duration: 0.8,
                    },
                    '-=0.5'
                )
                .from(
                    ctaRef.current,
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                    },
                    '-=0.5'
                )
                .from(
                    imageRef.current,
                    {
                        scale: 0.8,
                        opacity: 0,
                        duration: 1,
                    },
                    '-=1'
                );

            // Floating animation for the image
            gsap.to(imageRef.current, {
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-[#FFE5E5] to-[#F7E7CE]">
            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-[#B76E79] rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#D4A5A5] rounded-full opacity-10 blur-3xl"></div>

            <div className="container py-20 md:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 z-10">
                        <div className="inline-block">
                            <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-[#B76E79] shadow-md">
                                ✨ New Collection 2026
                            </span>
                        </div>

                        <h1
                            ref={titleRef}
                            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                        >
                            Discover Your
                            <span className="block gradient-text">Natural Glow</span>
                        </h1>

                        <p
                            ref={subtitleRef}
                            className="text-lg md:text-xl text-[#2C2C2C]/80 leading-relaxed max-w-xl"
                        >
                            Elevate your beauty routine with our curated collection of premium skincare and cosmetics. Crafted with love, designed for you.
                        </p>

                        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                            <Link href="/shop">
                                <button className="btn-primary text-lg px-8 py-4">
                                    Shop Now
                                </button>
                            </Link>
                            <Link href="/collections">
                                <button className="btn-secondary text-lg px-8 py-4">
                                    View Collections
                                </button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold text-[#B76E79]">500+</h3>
                                <p className="text-sm text-[#2C2C2C]/70">Products</p>
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold text-[#B76E79]">50K+</h3>
                                <p className="text-sm text-[#2C2C2C]/70">Happy Customers</p>
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold text-[#B76E79]">100%</h3>
                                <p className="text-sm text-[#2C2C2C]/70">Natural</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Hero Image */}
                    <div ref={imageRef} className="relative z-10">
                        <div className="relative">
                            {/* Decorative Circle */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#B76E79] to-[#D4A5A5] rounded-full blur-2xl opacity-20"></div>

                            {/* Main Image Container */}
                            <div className="relative aspect-square rounded-full overflow-hidden border-8 border-white shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop"
                                    alt="Beauty Products"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-4 shadow-xl animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#B76E79] to-[#D4A5A5] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Certified Organic</p>
                                        <p className="text-xs text-gray-500">100% Natural</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-4 shadow-xl animate-pulse" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B76E79] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">5.0 Rating</p>
                                        <p className="text-xs text-gray-500">2,500+ Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
}

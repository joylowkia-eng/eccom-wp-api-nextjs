'use client';

import Link from 'next/link';
import PaymentIcons from '@/components/PaymentIcons';

import NextImage from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="print:hidden">
            <div className='bg-white py-4'>
                <div className="container">
                    <Link target="_blank" href="https://www.sslcommerz.com/" className="block w-full">
                        <div className="relative h-12 w-full">
                            <NextImage
                                src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-01.png"
                                alt="SSLCommerz"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                </div>
            </div>
            <div className='bg-gradient-to-br from-[#2C2C2C] to-[#1a1a1a] text-white'>
                <div className="container py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-8">
                        {/* Brand Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#B76E79] to-[#D4A5A5] rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">L</span>
                                </div>
                                <span className="font-display text-2xl font-bold text-white">
                                    Lumière
                                </span>
                            </div>
                            <p className="text-gray-200 text-sm leading-relaxed">
                                Discover the art of beauty with our curated collection of premium skincare and cosmetics.
                            </p>
                            <div className="flex space-x-4">
                                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="w-10 h-10 bg-white/10 hover:bg-[#B76E79] rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer text-white"
                                        aria-label={social}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d={social === 'Instagram' ? "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" :
                                                social === 'Facebook' ? "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" :
                                                    "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-display text-lg font-semibold mb-4 text-white">Quick Links</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Shop All', href: '/shop' },
                                    { name: 'Collections', href: '/collections' },
                                    { name: 'Our Brands', href: '/brands' },
                                    { name: 'About Us', href: '/about' },
                                    { name: 'Contact', href: '/contact' },
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-200 hover:text-white transition-colors duration-300 cursor-pointer block">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h3 className="font-display text-lg font-semibold mb-4 text-white">Customer Service</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Track Order', href: '/order-tracking' },
                                    { name: 'Shipping Info', href: '/shipping' },
                                    { name: 'Returns & Exchanges', href: '/returns' },
                                    { name: 'FAQ', href: '/faq' },
                                    { name: 'Privacy Policy', href: '/privacy' },
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-200 hover:text-white transition-colors duration-300 cursor-pointer block">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="font-display text-lg font-semibold mb-4 text-white">Newsletter</h3>
                            <p className="text-gray-200 text-sm mb-4">
                                Subscribe to get special offers and beauty tips.
                            </p>
                            <form className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-[#B76E79] transition-colors duration-300"
                                />
                                <button
                                    type="submit"
                                    className="w-full btn-primary cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="py-8 border-t border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-gray-300 text-sm">
                                © {currentYear} Lumière. All rights reserved.
                            </p>
                            <div className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                                <PaymentIcons />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount } = useCart();
    const { user, logout, isAuthenticated } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Collections', href: '/collections' },
        { name: 'Brands', href: '/brands' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 print:hidden ${isScrolled
                ? 'bg-white/90 backdrop-blur-lg shadow-md'
                : 'bg-transparent'
                }`}
        >
            <div className="container">
                <div className="flex items-center justify-between py-4 md:py-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#B76E79] to-[#D4A5A5] rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#B76E79] to-[#D4A5A5] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xl md:text-2xl">L</span>
                            </div>
                        </div>
                        <span className="font-display text-2xl md:text-3xl font-bold gradient-text">
                            Lumière
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative font-medium transition-colors duration-300 ${pathname === link.href
                                    ? 'text-[#B76E79]'
                                    : 'text-[#2C2C2C] hover:text-[#B76E79]'
                                    }`}
                            >
                                {link.name}
                                {pathname === link.href && (
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#B76E79] to-[#D4A5A5]"></span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section - Search, Wishlist, Cart, Account */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative hidden md:block group">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-[#F9F9F9] border border-transparent rounded-full text-sm w-32 focus:w-48 focus:bg-white focus:border-[#B76E79] focus:outline-none transition-all duration-300"
                            />
                            <svg
                                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none group-focus-within:text-[#B76E79] transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </form>

                        {/* Mobile Search Icon (redirects which is simpler for mobile) */}
                        <button
                            className="md:hidden p-2 hover:bg-[#FFE5E5] rounded-full transition-colors duration-300"
                            aria-label="Search"
                            onClick={() => router.push('/shop')}
                        >
                            <svg
                                className="w-5 h-5 text-[#2C2C2C]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>


                        {/* Wishlist Icon */}
                        <Link
                            href="/account/wishlist"
                            className="p-2 hover:bg-[#FFE5E5] rounded-full transition-colors duration-300 hidden sm:block"
                            aria-label="Wishlist"
                        >
                            <svg
                                className="w-5 h-5 md:w-6 md:h-6 text-[#2C2C2C]"
                                fill="none"
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
                        </Link>

                        {/* Cart Icon */}
                        <Link
                            href="/cart"
                            className="relative p-2 hover:bg-[#FFE5E5] rounded-full transition-colors duration-300"
                            aria-label="Shopping Cart"
                        >
                            <svg
                                className="w-5 h-5 md:w-6 md:h-6 text-[#2C2C2C]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B76E79] text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="hidden md:block relative group/account">
                            <Link
                                href={isAuthenticated ? "/account" : "/login"}
                                className="p-2 hover:bg-[#FFE5E5] rounded-full transition-colors duration-300 flex items-center gap-2"
                                aria-label="Account"
                            >
                                <svg
                                    className="w-6 h-6 text-[#2C2C2C]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                {isAuthenticated && <span className="text-xs font-semibold text-[#B76E79] max-w-[80px] truncate">{user?.name}</span>}
                            </Link>

                            {/* Account Dropdown */}
                            {isAuthenticated && (
                                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-300 z-50">
                                    <div className="bg-white rounded-2xl shadow-xl border border-[#FFE5E5] overflow-hidden min-w-[180px]">
                                        <div className="p-4 border-b border-[#FFE5E5] bg-[#FFF8F0]">
                                            <p className="text-sm font-bold text-[#2C2C2C] truncate">{user?.name}</p>
                                            <p className="text-xs text-[#9E9E9E] truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link href="/account" className="block px-4 py-2 text-sm text-[#2C2C2C] hover:bg-[#FFE5E5] rounded-lg transition-colors">
                                                Dashboard
                                            </Link>
                                            <Link href="/account/orders" className="block px-4 py-2 text-sm text-[#2C2C2C] hover:bg-[#FFE5E5] rounded-lg transition-colors">
                                                My Orders
                                            </Link>
                                            <hr className="my-2 border-[#FFE5E5]" />
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4-4H7m6 4v1H3v1h14V9z" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 hover:bg-[#FFE5E5] rounded-full transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            <svg
                                className="w-6 h-6 text-[#2C2C2C]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-[#FFE5E5] animate-fade-in">
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`font-medium transition-colors duration-300 ${pathname === link.href
                                        ? 'text-[#B76E79]'
                                        : 'text-[#2C2C2C] hover:text-[#B76E79]'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

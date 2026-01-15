'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        setIsLoading(false);
    };

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <div className="max-w-md mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm">
                    {!isSubmitted ? (
                        <>
                            <h1 className="font-display text-3xl font-bold text-center mb-4 text-[#2C2C2C]">Reset Password</h1>
                            <p className="text-center text-[#9E9E9E] mb-8">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B76E79]/20 focus:border-[#B76E79] transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full btn-primary flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="font-display text-2xl font-bold mb-4 text-[#2C2C2C]">Check Your Email</h2>
                            <p className="text-[#9E9E9E] mb-8">
                                We've sent a password reset link to <span className="font-semibold text-[#2C2C2C]">{email}</span>. Please check your inbox.
                            </p>
                            <Link href="/login" className="btn-primary inline-block w-full">
                                Back to Login
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-[#B76E79] font-medium hover:text-[#8B5A5F] transition-colors flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

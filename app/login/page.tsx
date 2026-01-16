'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Input from '@/components/ui/Input';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setErrors({});
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                router.push('/account');
            } else {
                setErrors({ form: 'Invalid email or password' });
            }
        } catch (err) {
            setErrors({ form: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm">
                    <h1 className="font-display text-3xl font-bold text-center mb-8 text-[#2C2C2C]">Welcome Back</h1>

                    {errors.form && (
                        <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl mb-6 text-center animate-fade-in">
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            placeholder="Enter your email"
                            required
                        />

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-[#2C2C2C]">Password</label>
                                <Link href="/forgot-password" title="Forgot Password" className="text-xs text-[#B76E79] hover:text-[#8B5A5F] transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary flex items-center justify-center h-12 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform transition-all active:scale-95'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Signing In...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-[#B76E79] font-medium hover:text-[#8B5A5F] transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

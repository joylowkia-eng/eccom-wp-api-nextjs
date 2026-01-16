'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { register } = useAuth();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!name) newErrors.name = 'Full name is required';
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setErrors({});
        setIsLoading(true);

        try {
            const success = await register(name, email, password);
            if (success) {
                router.push('/account');
            } else {
                setErrors({ form: 'Registration failed. Please try again.' });
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
                    <h1 className="font-display text-3xl font-bold text-center mb-8 text-[#2C2C2C]">Create Account</h1>

                    {errors.form && (
                        <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl mb-6 text-center animate-fade-in">
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Full Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={errors.name}
                            placeholder="Enter your full name"
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            placeholder="Enter your email"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            placeholder="Create a password"
                            required
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary flex items-center justify-center h-12 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform transition-all active:scale-95'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Creating Account...
                                </span>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#B76E79] font-medium hover:text-[#8B5A5F] transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

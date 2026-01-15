'use client';

import AccountSidebar from '@/components/AccountSidebar';

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0] print:pt-0 print:pb-0 print:bg-white">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-lg)]">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 print:hidden">
                        <AccountSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 print:col-span-4 print:w-full">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}

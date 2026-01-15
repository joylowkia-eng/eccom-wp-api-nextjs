import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function AccountSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: 'Dashboard', href: '/account' },
        { name: 'Orders', href: '/account/orders' },
        { name: 'Wishlist', href: '/account/wishlist' },
        { name: 'Addresses', href: '/account/addresses' },
    ];

    return (
        <div className="bg-white rounded-2xl p-[var(--spacing-md)] shadow-sm h-fit sticky top-32 print:hidden">
            <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-3 rounded-lg transition-colors font-medium ${isActive(item.href)
                            ? 'bg-[#FFE5E5] text-[#B76E79] font-semibold'
                            : 'text-[#2C2C2C] hover:bg-[#F9F9F9]'
                            }`}
                    >
                        {item.name}
                    </Link>
                ))}
                <button
                    onClick={logout}
                    className="px-4 py-3 text-left text-red-500 hover:bg-[#FFF5F5] rounded-lg transition-colors mt-4 font-medium"
                >
                    Sign Out
                </button>
            </nav>
        </div>
    );
}

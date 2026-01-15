'use client';

import Link from 'next/link';

export default function OrdersPage() {
    return (
        <>
            <h1 className="font-display text-4xl font-bold mb-2 text-[#2C2C2C]">My Orders</h1>
            <p className="text-[#9E9E9E] mb-[var(--spacing-xl)]">View and track your past orders</p>

            <div className="space-y-[var(--spacing-md)]">
                {[1, 2, 3].map((order) => (
                    <div key={order} className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm border border-transparent hover:border-[#FFE5E5] transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg text-[#2C2C2C]">Order #{1000 + order}</h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order === 1 ? 'bg-green-100 text-green-700' :
                                        order === 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {order === 1 ? 'Delivered' : order === 2 ? 'Shipped' : 'Processing'}
                                    </span>
                                </div>
                                <p className="text-sm text-[#9E9E9E] mt-1">Placed on January {10 + order}, 2026</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#B76E79]">$129.99</p>
                                <p className="text-xs text-[#9E9E9E]">2 Items</p>
                            </div>
                        </div>
                        <div className="border-t border-[#F5F5F5] pt-4 mt-4 flex justify-between items-center">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                            </div>
                            <Link
                                href={`/account/orders/${1000 + order}`}
                                className="text-sm font-semibold text-[#B76E79] hover:text-[#D4A5A5] transition-colors"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

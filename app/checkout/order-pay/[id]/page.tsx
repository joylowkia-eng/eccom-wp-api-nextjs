'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrder, getWoocommerceSettings } from '@/lib/woocommerce';

export default function OrderPayPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = params.id as string;
    const payKey = searchParams.get('key');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function validateAndRedirect() {
            try {
                // 1. Fetch order to verify it exists and get payment details
                const order = await getOrder(orderId);

                if (!order) {
                    setError('Order not found.');
                    setIsLoading(false);
                    return;
                }

                // 2. Look for the payment URL in the order meta data or response
                // WooCommerce typically provides a payment URL that points to the WordPress site.
                // We want to extract the parameters and redirect to the correct gateway flow.

                const paymentUrl = order.payment_url || order.checkout_url;

                if (paymentUrl) {
                    // Redirect the user to the actual payment gateway URL (which is hosted on WordPress)
                    // but they will be returned to our Next.js /invoice/{id} page after.
                    window.location.href = paymentUrl;
                } else {
                    // Fallback to invoice if no payment URL is found
                    router.push(`/invoice/${orderId}`);
                }
            } catch (err) {
                console.error('Error in order-pay:', err);
                setError('Failed to process payment redirection.');
                setIsLoading(false);
            }
        }

        if (orderId) {
            validateAndRedirect();
        }
    }, [orderId, payKey, router]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#FFF8F0] pt-32">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center">
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B76E79] mx-auto mb-6"></div>
                        <h2 className="text-xl font-bold mb-2">Processing Payment...</h2>
                        <p className="text-gray-500 text-sm">Please wait while we redirect you to the secure payment gateway.</p>
                    </>
                ) : error ? (
                    <>
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-red-600">Error</h2>
                        <p className="text-gray-500 text-sm mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="btn-primary w-full"
                        >
                            Back to Checkout
                        </button>
                    </>
                ) : null}
            </div>
        </main>
    );
}

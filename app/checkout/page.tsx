'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PaymentIcons from '@/components/PaymentIcons';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { getPaymentGateways, createOrder, getCurrencySettings, getShippingMethods, validateCoupon } from '@/lib/woocommerce';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart, getItemKey } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [gateways, setGateways] = useState<any[]>([]);
    const [shippingMethods, setShippingMethods] = useState<any[]>([]);
    const [selectedGateway, setSelectedGateway] = useState('');
    const [selectedShipping, setSelectedShipping] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [currency, setCurrency] = useState({ symbol: '$', position: 'left' });
    const [isLoading, setIsLoading] = useState(false);
    const [isGatewaysLoading, setIsGatewaysLoading] = useState(true);
    const [isShippingLoading, setIsShippingLoading] = useState(true);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState('');

    const [showShippingAddress, setShowShippingAddress] = useState(false);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: '',
        firstName: user?.name.split(' ')[0] || '',
        lastName: user?.name.split(' ')[1] || '',
        address: '',
        city: '',
        postcode: '',
        country: 'US',
        shippingFirstName: '',
        shippingLastName: '',
        shippingAddress: '',
        shippingCity: '',
        shippingPostcode: '',
        shippingCountry: 'US'
    });

    useEffect(() => {
        async function loadCheckoutData() {
            try {
                const [paymentGateways, methods, currencyData] = await Promise.all([
                    getPaymentGateways(),
                    getShippingMethods(),
                    getCurrencySettings()
                ]);
                setGateways(paymentGateways);
                if (paymentGateways.length > 0) {
                    setSelectedGateway(paymentGateways[0].id);
                }
                setShippingMethods(methods);
                if (methods.length > 0) {
                    setSelectedShipping(methods[0].id);
                    setShippingCost(parseFloat(methods[0].settings?.cost?.value || '0'));
                }
                setCurrency(currencyData);
            } catch (error) {
                console.error("Failed to load checkout data", error);
            } finally {
                setIsGatewaysLoading(false);
                setIsShippingLoading(false);
            }
        }
        loadCheckoutData();
    }, []);

    const discountAmount = appliedCoupon ? (appliedCoupon.discount_type === 'percent' ? (cartTotal * parseFloat(appliedCoupon.amount) / 100) : parseFloat(appliedCoupon.amount)) : 0;
    const total = cartTotal - discountAmount + shippingCost;

    const formatPrice = (price: number) => {
        const val = price.toFixed(2);
        return currency.position === 'left' ? `${currency.symbol}${val}` : `${val}${currency.symbol}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponError('');
        try {
            const coupon = await validateCoupon(couponCode);
            if (coupon) {
                setAppliedCoupon(coupon);
            } else {
                setCouponError('Invalid coupon code');
            }
        } catch (error) {
            setCouponError('Error validating coupon');
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedGateway) {
            alert('Please select a payment method');
            return;
        }

        setIsLoading(true);
        try {
            const lineItems = cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                ...(item.variationId && { variation_id: item.variationId })
            }));

            const gatewayTitle = gateways.find(g => g.id === selectedGateway)?.title || selectedGateway;
            const shippingTitle = shippingMethods.find(s => s.id === selectedShipping)?.title || selectedShipping;

            const orderData = {
                payment_method: selectedGateway,
                payment_method_title: gatewayTitle,
                set_paid: false,
                billing: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: formData.address,
                    city: formData.city,
                    postcode: formData.postcode,
                    country: formData.country,
                    email: formData.email,
                    phone: formData.phone
                },
                shipping: showShippingAddress ? {
                    first_name: formData.shippingFirstName,
                    last_name: formData.shippingLastName,
                    address_1: formData.shippingAddress,
                    city: formData.shippingCity,
                    postcode: formData.shippingPostcode,
                    country: formData.shippingCountry
                } : {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: formData.address,
                    city: formData.city,
                    postcode: formData.postcode,
                    country: formData.country
                },
                line_items: lineItems,
                customer_id: user?.id ? parseInt(user.id) : 0,
                shipping_lines: [
                    {
                        method_id: selectedShipping,
                        method_title: shippingTitle,
                        total: shippingCost.toString()
                    }
                ],
                coupon_lines: appliedCoupon ? [{ code: appliedCoupon.code }] : []
            };

            const response = await createOrder(orderData);

            if (response && response.id) {
                clearCart();

                // Check if the payment method requires a redirect (like SSLCommerz)
                // Some WC plugins return 'payment_url' or 'checkout_url' in the REST response
                const paymentUrl = response.payment_url || response.checkout_url || (response.meta_data?.find((m: any) => m.key === '_payment_url')?.value);

                if (paymentUrl) {
                    window.location.href = paymentUrl;
                } else if (selectedGateway === 'sslcommerz_payment' || selectedGateway === 'sslcommerz') {
                    // Fallback to standard WC Pay for Order page if no direct payment URL is provided
                    const siteUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
                    const payUrl = `${siteUrl}/checkout/order-pay/${response.id}/?key=${response.order_key}&pay_for_order=true`;
                    window.location.href = payUrl;
                } else {
                    router.push(`/invoice/${response.id}`);
                }
            } else {
                throw new Error("Order creation failed");
            }
        } catch (error: any) {
            console.error("Error placing order:", error);
            alert(`Failed to place order: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-40 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link href="/shop" className="btn-primary inline-block">Go Shopping</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-[var(--spacing-2xl)] bg-[#FFF8F0]">
            <div className="container">
                <div className="text-center mb-[var(--spacing-xl)]">
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        Checkout
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-[var(--spacing-xl)] max-w-6xl mx-auto">
                    {/* Checkout Form */}
                    <div className="flex-1 space-y-[var(--spacing-lg)]">
                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                            <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#FFE5E5] text-[#B76E79] rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                            <h3 className="font-display text-xl font-bold mb-[var(--spacing-md)] flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#FFE5E5] text-[#B76E79] rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                Billing Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#2C2C2C]">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postcode"
                                        value={formData.postcode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!showShippingAddress}
                                        onChange={() => setShowShippingAddress(!showShippingAddress)}
                                        className="w-5 h-5 rounded text-[#B76E79] focus:ring-[#B76E79]"
                                    />
                                    <span className="text-sm font-semibold text-[#2C2C2C]">Ship to billing address</span>
                                </label>
                            </div>
                        </div>

                        {/* Separate Shipping Address */}
                        {showShippingAddress && (
                            <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm animate-fade-in">
                                <h3 className="font-display text-xl font-bold mb-[var(--spacing-md)]">Shipping Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#2C2C2C]">First Name</label>
                                        <input
                                            type="text"
                                            name="shippingFirstName"
                                            value={formData.shippingFirstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#2C2C2C]">Last Name</label>
                                        <input
                                            type="text"
                                            name="shippingLastName"
                                            value={formData.shippingLastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-[#2C2C2C]">Address</label>
                                        <input
                                            type="text"
                                            name="shippingAddress"
                                            value={formData.shippingAddress}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#2C2C2C]">City</label>
                                        <input
                                            type="text"
                                            name="shippingCity"
                                            value={formData.shippingCity}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#2C2C2C]">Postal Code</label>
                                        <input
                                            type="text"
                                            name="shippingPostcode"
                                            value={formData.shippingPostcode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] focus:ring-4 focus:ring-[#FFE5E5] transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shipping Method */}
                        <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                            <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#FFE5E5] text-[#B76E79] rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                Shipping Method
                            </h3>
                            {isShippingLoading ? (
                                <div className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
                            ) : (
                                <div className="space-y-3">
                                    {shippingMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => {
                                                setSelectedShipping(method.id);
                                                setShippingCost(parseFloat(method.settings?.cost?.value || '0'));
                                            }}
                                            className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${selectedShipping === method.id ? 'border-[#B76E79] bg-[#FFF5F5]' : 'border-[#F0F0F0] hover:border-[#FFE5E5]'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedShipping === method.id ? 'border-[#B76E79]' : 'border-gray-300'}`}>
                                                    {selectedShipping === method.id && <div className="w-2.5 h-2.5 bg-[#B76E79] rounded-full"></div>}
                                                </div>
                                                <span className="font-semibold">{method.title}</span>
                                            </div>
                                            <span className="font-bold">{parseFloat(method.settings?.cost?.value || '0') === 0 ? 'Free' : formatPrice(parseFloat(method.settings?.cost?.value || '0'))}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-xl font-bold flex items-center gap-3">
                                    <span className="w-8 h-8 bg-[#FFE5E5] text-[#B76E79] rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                    Payment Method
                                </h3>
                                <PaymentIcons />
                            </div>

                            {isGatewaysLoading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>)}
                                </div>
                            ) : (
                                <div className="space-y-[var(--spacing-md)]">
                                    {gateways.map((gateway) => (
                                        <div
                                            key={gateway.id}
                                            onClick={() => setSelectedGateway(gateway.id)}
                                            className={`border-2 rounded-xl p-[var(--spacing-md)] flex items-center gap-4 cursor-pointer transition-all ${selectedGateway === gateway.id
                                                ? 'border-[#B76E79] bg-[#FFF5F5]'
                                                : 'border-[#F0F0F0] hover:border-[#FFE5E5]'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === gateway.id ? 'border-[#B76E79]' : 'border-gray-300'
                                                }`}>
                                                {selectedGateway === gateway.id && <div className="w-2.5 h-2.5 bg-[#B76E79] rounded-full"></div>}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-[#2C2C2C]">{gateway.title}</span>
                                                <p className="text-sm text-[#9E9E9E]">{gateway.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-8 shadow-md sticky top-32">
                            <h3 className="font-display text-xl font-bold mb-6">Your Order</h3>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={getItemKey(item)} className="flex items-center gap-4 py-2">
                                        <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg overflow-hidden relative border border-gray-100">
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                            <span className="absolute top-0 right-0 w-5 h-5 bg-[#B76E79] text-white text-xs flex items-center justify-center rounded-bl-lg">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                            {item.selectedAttributes && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {item.selectedAttributes.map((attr: any) => (
                                                        <span key={attr.name} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                                            {attr.name}: {attr.option}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}

                                <div className="border-t border-[#FFE5E5] my-4"></div>

                                {/* Coupon Section */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-[#F9F9F9] border border-transparent rounded-lg focus:bg-white focus:border-[#B76E79] outline-none text-sm transition-all"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            className="px-4 py-2 bg-[#2C2C2C] text-white text-xs font-bold rounded-lg hover:bg-black transition-all"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-green-200">
                                            <span className="text-[10px] text-green-700 font-bold">Applied: {appliedCoupon.code}</span>
                                            <button onClick={() => setAppliedCoupon(null)} className="text-[10px] text-red-500 hover:underline">Remove</button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between text-[#2C2C2C] text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600 text-sm">
                                        <span>Discount</span>
                                        <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-[#2C2C2C] text-sm">
                                    <span>Shipping</span>
                                    <span className="font-semibold">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                                </div>
                                <div className="border-t border-[#FFE5E5] pt-4 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-[#B76E79]">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isLoading || isGatewaysLoading || isShippingLoading}
                                className={`block w-full btn-primary text-center shadow-lg transform transition-all items-center justify-center flex gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    `Place Order (${formatPrice(total)})`
                                )}
                            </button>

                            <p className="text-xs text-[#9E9E9E] text-center mt-4 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secure Encrypted Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

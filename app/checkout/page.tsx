'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PaymentIcons from '@/components/PaymentIcons';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { getPaymentGateways, createOrder, getShippingMethods, validateCoupon, getShippingZones, getShippingZoneMethods, getShippingZoneLocations, getCountries, getWoocommerceSettings, getCustomer } from '@/lib/woocommerce';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Script from 'next/script';
import NextImage from 'next/image';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart, getItemKey, appliedCoupon, applyCoupon, removeCoupon } = useCart();
    const { user } = useAuth();
    const { formatPrice } = useCurrency();
    const router = useRouter();

    const [gateways, setGateways] = useState<any[]>([]);
    const [shippingMethods, setShippingMethods] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);
    const [allCountries, setAllCountries] = useState<any[]>([]);
    const [allowedCountries, setAllowedCountries] = useState<any[]>([]);
    const [selectedGateway, setSelectedGateway] = useState('');
    const [selectedShipping, setSelectedShipping] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isGatewaysLoading, setIsGatewaysLoading] = useState(true);
    const [isShippingLoading, setIsShippingLoading] = useState(false);

    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [showBillingAddress, setShowBillingAddress] = useState(false);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        address: '',
        city: '',
        state: '13',
        postcode: '',
        country: 'BD',
        shippingFirstName: user?.name?.split(' ')[0] || '',
        shippingLastName: user?.name?.split(' ')[1] || '',
        shippingAddress: '',
        shippingCity: '',
        shippingState: '13',
        shippingPostcode: '',
        shippingCountry: 'BD'
    });
    // Sync user data to form when user is available
    useEffect(() => {
        async function syncCustomerData() {
            if (!user) return;

            // First sync basic name/email from context
            setFormData(prev => ({
                ...prev,
                email: user.email || prev.email,
                firstName: user.name?.split(' ')[0] || prev.firstName,
                lastName: user.name?.split(' ')[1] || prev.lastName,
                shippingFirstName: user.name?.split(' ')[0] || prev.shippingFirstName,
                shippingLastName: user.name?.split(' ')[1] || prev.shippingLastName,
            }));

            // Then try to fetch full customer data for addresses
            try {
                const customer = await getCustomer(parseInt(user.id));
                if (customer) {
                    setFormData(prev => ({
                        ...prev,
                        phone: customer.billing?.phone || prev.phone,
                        firstName: customer.billing?.first_name || prev.firstName,
                        lastName: customer.billing?.last_name || prev.lastName,
                        address: customer.billing?.address_1 || prev.address,
                        city: customer.billing?.city || prev.city,
                        state: customer.billing?.state || prev.state,
                        postcode: customer.billing?.postcode || prev.postcode,
                        country: customer.billing?.country || prev.country,
                        shippingFirstName: customer.shipping?.first_name || prev.shippingFirstName,
                        shippingLastName: customer.shipping?.last_name || prev.shippingLastName,
                        shippingAddress: customer.shipping?.address_1 || prev.shippingAddress,
                        shippingCity: customer.shipping?.city || prev.shippingCity,
                        shippingState: customer.shipping?.state || prev.shippingState,
                        shippingPostcode: customer.shipping?.postcode || prev.shippingPostcode,
                        shippingCountry: customer.shipping?.country || prev.shippingCountry,
                    }));

                    // If shipping info is different, we might want to show billing address too
                    if (customer.billing?.address_1 !== customer.shipping?.address_1) {
                        setShowBillingAddress(true);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch full customer details for checkout", e);
            }
        }

        syncCustomerData();
    }, [user, allCountries.length]); // Re-sync when user or country data is ready

    useEffect(() => {
        async function loadInitialData() {
            try {
                const [paymentGateways, allZones, countriesData, settings] = await Promise.all([
                    getPaymentGateways(),
                    getShippingZones(),
                    getCountries(),
                    getWoocommerceSettings()
                ]);

                setGateways(paymentGateways);
                if (paymentGateways.length > 0) {
                    setSelectedGateway(paymentGateways[0].id);
                }

                setZones(allZones);
                setAllCountries(countriesData);

                // Handle Allowed Countries based on WooCommerce Settings
                const sellToSpecific = settings.find((s: any) => s.id === 'woocommerce_allowed_countries')?.value;
                const specificCountries = settings.find((s: any) => s.id === 'woocommerce_specific_allowed_countries')?.value || [];

                if (sellToSpecific === 'specific' && Array.isArray(specificCountries)) {
                    setAllowedCountries(countriesData.filter((c: any) => specificCountries.includes(c.code)));
                } else if (sellToSpecific === 'all_except') {
                    const exceptCountries = settings.find((s: any) => s.id === 'woocommerce_all_except_countries')?.value || [];
                    setAllowedCountries(countriesData.filter((c: any) => !exceptCountries.includes(c.code)));
                } else {
                    setAllowedCountries(countriesData);
                }
            } catch (error) {
                console.error("Failed to load initial checkout data", error);
            } finally {
                setIsGatewaysLoading(false);
            }
        }
        loadInitialData();
    }, []);

    // Dynamic Shipping Calculation based on location
    useEffect(() => {
        const activeCountry = formData.shippingCountry;
        const activeState = formData.shippingState;

        async function updateShippingMethods() {
            if (!activeCountry) {
                setShippingMethods([]);
                setShippingCost(0);
                return;
            }

            setIsShippingLoading(true);
            try {
                // 1. Find the matching zone
                // We'll iterate through zones and fetch their locations to find a match
                let matchedZoneId = 0; // Default to 'Everywhere' (Zone 0)

                for (const zone of zones) {
                    if (zone.id === 0) continue;
                    const locations = await getShippingZoneLocations(zone.id);

                    const isMatch = locations.some((loc: any) => {
                        const normalizedActiveState = activeState.includes(':') ? activeState : `${activeCountry}:${activeState}`;
                        const normalizedLocCode = loc.code.includes(':') ? loc.code : `${activeCountry}:${loc.code}`;

                        // Exact State Match
                        if (loc.type === 'state') {
                            return loc.code === activeState || loc.code === normalizedActiveState;
                        }

                        // Country Match (only if no specific state in this country is defined in the same zone)
                        if (loc.type === 'country' && loc.code === activeCountry) {
                            // Check if this specific zone has ANY states defined for THIS country
                            const hasStateRestraintsForCountry = locations.some((l: any) =>
                                l.type === 'state' && l.code.startsWith(`${activeCountry}:`)
                            );

                            if (!hasStateRestraintsForCountry) return true;

                            // If there are states defined for this country in this zone, we MUST match one of them
                            return locations.some((l: any) =>
                                l.type === 'state' && (l.code === activeState || l.code === normalizedActiveState)
                            );
                        }
                        return false;
                    });

                    if (isMatch) {
                        matchedZoneId = zone.id;
                        break;
                    }
                }

                // 2. Fetch methods for the matched zone
                const methods = await getShippingZoneMethods(matchedZoneId);
                const enabledMethods = methods.filter((m: any) => m.enabled);

                setShippingMethods(enabledMethods);
                if (enabledMethods.length > 0) {
                    setSelectedShipping(enabledMethods[0].id);
                    setShippingCost(parseFloat(enabledMethods[0].settings?.cost?.value || '0'));
                } else {
                    setSelectedShipping('');
                    setShippingCost(0);
                }
            } catch (error) {
                console.error("Error updating shipping methods", error);
            } finally {
                setIsShippingLoading(false);
            }
        }

        if (zones.length > 0) {
            updateShippingMethods();
        }
    }, [formData.shippingState, formData.shippingCountry, zones]);

    const discountAmount = appliedCoupon ? (appliedCoupon.discount_type === 'percent' ? (cartTotal * parseFloat(appliedCoupon.amount) / 100) : parseFloat(appliedCoupon.amount)) : 0;
    const total = cartTotal - discountAmount + shippingCost;


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
                applyCoupon(coupon);
                setCouponCode('');
            } else {
                setCouponError('Invalid coupon code');
            }
        } catch (error) {
            setCouponError('Error validating coupon');
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';

        if (showBillingAddress) {
            if (!formData.firstName) errors.firstName = 'First name is required';
            if (!formData.lastName) errors.lastName = 'Last name is required';
            if (!formData.address) errors.address = 'Address is required';
            if (!formData.city) errors.city = 'City is required';
            if (!formData.state) errors.state = 'State is required';
            if (!formData.postcode) errors.postcode = 'Postal code is required';
        }

        if (!formData.shippingFirstName) errors.shippingFirstName = 'First name is required';
        if (!formData.shippingLastName) errors.shippingLastName = 'Last name is required';
        if (!formData.shippingAddress) errors.shippingAddress = 'Address is required';
        if (!formData.shippingCity) errors.shippingCity = 'City is required';
        if (!formData.shippingState) errors.shippingState = 'District is required';
        if (!formData.shippingPostcode) errors.shippingPostcode = 'Postal code is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            const firstError = document.querySelector('.text-red-500');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

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
            const successUrl = `${window.location.origin}/invoice/{order_id}`;
            const cancelUrl = window.location.href;

            const orderData = {
                payment_method: selectedGateway,
                payment_method_title: gatewayTitle,
                set_paid: false,
                billing: showBillingAddress ? {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: formData.address,
                    city: formData.city,
                    state: formData.state,
                    postcode: formData.postcode,
                    country: formData.country,
                    email: formData.email,
                    phone: formData.phone
                } : {
                    first_name: formData.shippingFirstName,
                    last_name: formData.shippingLastName,
                    address_1: formData.shippingAddress,
                    city: formData.shippingCity,
                    state: formData.shippingState,
                    postcode: formData.shippingPostcode,
                    country: formData.shippingCountry,
                    email: formData.email,
                    phone: formData.phone
                },
                shipping: {
                    first_name: formData.shippingFirstName,
                    last_name: formData.shippingLastName,
                    address_1: formData.shippingAddress,
                    city: formData.shippingCity,
                    state: formData.shippingState,
                    postcode: formData.shippingPostcode,
                    country: formData.shippingCountry
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
                coupon_lines: appliedCoupon ? [{ code: appliedCoupon.code }] : [],
                // Multiple keys for compatibility with different gateway plugins
                meta_data: [
                    { key: '_success_url', value: successUrl },
                    { key: '_cancel_url', value: cancelUrl },
                    { key: 'return_url', value: successUrl },
                    { key: 'cancel_url', value: cancelUrl }
                ]
            };

            const response = await createOrder(orderData);

            if (response && response.id) {
                // 1. Check for immediate success methods (Cash on Delivery etc) or status
                const isCOD = selectedGateway === 'cod';
                if (isCOD || response.status === 'processing' || response.status === 'completed') {
                    clearCart();
                    router.push(`/invoice/${response.id}`);
                    return;
                }

                // 2. Identify the payment URL
                let paymentUrl = response.payment_url || response.checkout_url || (response.meta_data?.find((m: any) => m.key === '_payment_url')?.value);

                // Ensure the payment URL points to our local app for the order-pay interception
                if (paymentUrl && paymentUrl.includes('/checkout/order-pay/')) {
                    const urlObj = new URL(paymentUrl);
                    paymentUrl = `${window.location.origin}${urlObj.pathname}${urlObj.search}`;
                }

                if (paymentUrl) {
                    // Try to use the SSLCommerz popup if it's that gateway
                    if (selectedGateway.toLowerCase().includes('sslcommerz')) {
                        try {
                            const btn = document.getElementById('sslczPayBtn');
                            if (btn) {
                                btn.setAttribute('endpoint', paymentUrl);
                                (btn as any).endpoint = paymentUrl; // Set as property too for some versions of the SDK
                            }

                            if ((window as any).OSL_Handler) {
                                (window as any).OSL_Handler(paymentUrl);
                                setIsLoading(false);
                                return;
                            }
                        } catch (e) {
                            console.error("Popup handler failed", e);
                        }
                    }

                    // Fallback to direct redirect
                    window.location.href = paymentUrl;
                } else {
                    clearCart();
                    router.push(`/invoice/${response.id}`);
                }
            }
        } catch (error: any) {
            console.error("Error placing order:", error);
            alert(`Failed to place order: ${error.message}`);
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
            {/* 3. Load the SSLCommerz SDK */}
            {/* Use 'sandbox' for testing, 'seamless-epay' for live */}
            <Script
                src="https://sandbox.sslcommerz.com/embed.min.js"
                strategy="afterInteractive"
            />
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
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={formErrors.email}
                                    placeholder="you@example.com"
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    error={formErrors.phone}
                                    placeholder="+1 (555) 000-0000"
                                    required
                                />
                            </div>
                        </div>

                        {/* 2. Shipping Address */}
                        <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                            <h3 className="font-display text-xl font-bold mb-[var(--spacing-md)] flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#FFE5E5] text-[#B76E79] rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                Shipping Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                                <Input
                                    label="First Name"
                                    name="shippingFirstName"
                                    value={formData.shippingFirstName}
                                    onChange={handleInputChange}
                                    error={formErrors.shippingFirstName}
                                    required
                                />
                                <Input
                                    label="Last Name"
                                    name="shippingLastName"
                                    value={formData.shippingLastName}
                                    onChange={handleInputChange}
                                    error={formErrors.shippingLastName}
                                    required
                                />
                                <Select
                                    label="Country/Region"
                                    name="shippingCountry"
                                    value={formData.shippingCountry}
                                    onChange={(e) => setFormData(prev => ({ ...prev, shippingCountry: e.target.value, shippingState: '' }))}
                                    options={allowedCountries.length > 0 ? allowedCountries.map(c => ({ value: c.code, label: c.name })) : [{ value: 'BD', label: 'Bangladesh' }]}
                                    placeholder="Select Country"
                                    required
                                />
                                {(() => {
                                    const currentCode = formData.shippingCountry?.toUpperCase();
                                    const selectedCountryData = allCountries.find(c => c.code?.toUpperCase() === currentCode);
                                    if (selectedCountryData?.states?.length > 0) {
                                        return (
                                            <Select
                                                label="State / District"
                                                name="shippingState"
                                                value={formData.shippingState}
                                                onChange={(e) => setFormData(prev => ({ ...prev, shippingState: e.target.value }))}
                                                options={selectedCountryData.states.map((s: any) => ({ value: s.code, label: s.name }))}
                                                error={formErrors.shippingState}
                                                placeholder="Select State"
                                                required
                                            />
                                        );
                                    }
                                    return (
                                        <Input
                                            label="State / District"
                                            name="shippingState"
                                            value={formData.shippingState}
                                            onChange={handleInputChange}
                                            error={formErrors.shippingState}
                                            placeholder="Enter State/Province"
                                            required
                                        />
                                    );
                                })()}
                                <div className="md:col-span-2">
                                    <Input
                                        label="Address"
                                        name="shippingAddress"
                                        value={formData.shippingAddress}
                                        onChange={handleInputChange}
                                        error={formErrors.shippingAddress}
                                        required
                                    />
                                </div>
                                <Input
                                    label="City"
                                    name="shippingCity"
                                    value={formData.shippingCity}
                                    onChange={handleInputChange}
                                    error={formErrors.shippingCity}
                                    required
                                />
                                <Input
                                    label="Postal Code"
                                    name="shippingPostcode"
                                    value={formData.shippingPostcode}
                                    onChange={handleInputChange}
                                    error={formErrors.shippingPostcode}
                                    required
                                />
                            </div>

                            <div className="mt-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!showBillingAddress}
                                        onChange={() => setShowBillingAddress(!showBillingAddress)}
                                        className="w-5 h-5 rounded text-[#B76E79] focus:ring-[#B76E79]"
                                    />
                                    <span className="text-sm font-semibold text-[#2C2C2C]">Billing address is same as shipping</span>
                                </label>
                            </div>
                        </div>

                        {/* Optional Billing Address */}
                        {showBillingAddress && (
                            <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm animate-fade-in">
                                <h3 className="font-display text-xl font-bold mb-[var(--spacing-md)]">Billing Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
                                    <Input
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        error={formErrors.firstName}
                                        required
                                    />
                                    <Input
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        error={formErrors.lastName}
                                        required
                                    />
                                    <Select
                                        label="Country/Region"
                                        name="country"
                                        value={formData.country}
                                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value, state: '' }))}
                                        options={allowedCountries.length > 0 ? allowedCountries.map(c => ({ value: c.code, label: c.name })) : [{ value: 'BD', label: 'Bangladesh' }]}
                                        placeholder="Select Country"
                                        required
                                    />
                                    {(() => {
                                        const currentCode = formData.country?.toUpperCase();
                                        const selectedCountryData = allCountries.find(c => c.code?.toUpperCase() === currentCode);
                                        if (selectedCountryData?.states?.length > 0) {
                                            return (
                                                <Select
                                                    label="State / District"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                                    options={selectedCountryData.states.map((s: any) => ({ value: s.code, label: s.name }))}
                                                    error={formErrors.state}
                                                    placeholder="Select State"
                                                    required
                                                />
                                            );
                                        }
                                        return (
                                            <Input
                                                label="State / District"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                error={formErrors.state}
                                                placeholder="Enter State/Province"
                                                required
                                            />
                                        );
                                    })()}
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            error={formErrors.address}
                                            required
                                        />
                                    </div>
                                    <Input
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        error={formErrors.city}
                                        required
                                    />
                                    <Input
                                        label="Postal Code"
                                        name="postcode"
                                        value={formData.postcode}
                                        onChange={handleInputChange}
                                        error={formErrors.postcode}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* 3. Shipping Method */}
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
                                        <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg overflow-hidden relative border border-gray-100 flex-shrink-0">
                                            <NextImage src={item.image} fill className="object-cover" alt={item.name} sizes="64px" />
                                            <span className="absolute top-0 right-0 w-5 h-5 bg-[#B76E79] text-white text-xs flex items-center justify-center rounded-bl-lg z-10">
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
                                            <button onClick={removeCoupon} className="text-[10px] text-red-500 hover:underline">Remove</button>
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
                                id="sslczPayBtn"
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={isLoading}
                                className="btn-primary w-full"
                            >
                                {isLoading ? "Processing..." : `Place Order`}
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
        </main >
    );
}

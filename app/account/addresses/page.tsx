'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getCustomer, updateCustomer, getCountries } from '@/lib/woocommerce';

// Reusable Components
const Input = ({ label, name, value, onChange, placeholder, required = false, type = 'text' }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-[#2C2C2C]">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-2 bg-[#F9F9F9] rounded-lg border border-transparent focus:bg-white focus:border-[#B76E79] outline-none transition-all text-sm"
        />
    </div>
);

const Select = ({ label, name, value, onChange, options, placeholder, required = false }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-[#2C2C2C]">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2 bg-[#F9F9F9] rounded-lg border border-transparent focus:bg-white focus:border-[#B76E79] outline-none transition-all text-sm appearance-none cursor-pointer"
        >
            <option value="">{placeholder}</option>
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

export default function AddressesPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingType, setEditingType] = useState<'billing' | 'shipping' | null>(null);
    const [allCountries, setAllCountries] = useState<any[]>([]);

    const [billingAddress, setBillingAddress] = useState({
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: 'BD',
        email: '',
        phone: ''
    });

    const [shippingAddress, setShippingAddress] = useState({
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: 'BD'
    });

    useEffect(() => {
        async function loadData() {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const [customer, countries] = await Promise.all([
                    getCustomer(parseInt(user.id)),
                    getCountries()
                ]);

                setAllCountries(countries);

                if (customer) {
                    if (customer.billing) {
                        setBillingAddress({
                            first_name: customer.billing.first_name || '',
                            last_name: customer.billing.last_name || '',
                            company: customer.billing.company || '',
                            address_1: customer.billing.address_1 || '',
                            address_2: customer.billing.address_2 || '',
                            city: customer.billing.city || '',
                            state: customer.billing.state || '',
                            postcode: customer.billing.postcode || '',
                            country: customer.billing.country || 'BD',
                            email: customer.billing.email || '',
                            phone: customer.billing.phone || ''
                        });
                    }
                    if (customer.shipping) {
                        setShippingAddress({
                            first_name: customer.shipping.first_name || '',
                            last_name: customer.shipping.last_name || '',
                            company: customer.shipping.company || '',
                            address_1: customer.shipping.address_1 || '',
                            address_2: customer.shipping.address_2 || '',
                            city: customer.shipping.city || '',
                            state: customer.shipping.state || '',
                            postcode: customer.shipping.postcode || '',
                            country: customer.shipping.country || 'BD'
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [user]);

    const handleInputChange = (e: any, type: 'billing' | 'shipping') => {
        const { name, value } = e.target;
        if (type === 'billing') {
            setBillingAddress(prev => ({ ...prev, [name]: value }));
        } else {
            setShippingAddress(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id || !editingType) return;

        setIsSaving(true);
        try {
            const dataToUpdate = editingType === 'billing'
                ? { billing: billingAddress }
                : { shipping: shippingAddress };

            const updated = await updateCustomer(user.id, dataToUpdate);

            if (updated) {
                setEditingType(null);
                alert(`${editingType.charAt(0).toUpperCase() + editingType.slice(1)} address updated successfully!`);
            }
        } catch (error) {
            console.error("Error updating address:", error);
            alert('Failed to update address.');
        } finally {
            setIsSaving(false);
        }
    };

    const AddressCard = ({ type, address }: { type: 'billing' | 'shipping', address: any }) => (
        <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm border border-[#F0F0F0] hover:border-[#B76E79] transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-display text-xl font-bold text-[#2C2C2C]">
                        {type === 'billing' ? 'Billing Address' : 'Shipping Address'}
                    </h3>
                    <p className="text-sm text-[#9E9E9E]">The address used for {type === 'billing' ? 'invoices' : 'deliveries'}</p>
                </div>
                <button
                    onClick={() => setEditingType(type)}
                    className="p-2 text-[#9E9E9E] hover:text-[#B76E79] hover:bg-[#FFE5E5] rounded-lg transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            </div>

            <div className="space-y-1 text-[#2C2C2C]">
                {address.address_1 ? (
                    <>
                        <p className="font-bold">{address.first_name || ''} {address.last_name || ''}</p>
                        {address.company && <p className="text-sm text-[#9E9E9E] italic">{address.company}</p>}
                        <p>{address.address_1}</p>
                        {address.address_2 && <p>{address.address_2}</p>}
                        <p>{address.city || ''}{address.state ? `, ${address.state}` : ''} {address.postcode || ''}</p>
                        <p>{allCountries.find(c => c.code === address.country)?.name || address.country}</p>
                        {type === 'billing' && address.phone && (
                            <p className="mt-4 pt-4 border-t border-[#F0F0F0] text-sm text-[#9E9E9E]">
                                <span className="font-semibold text-[#2C2C2C] mr-2">Phone:</span>
                                {address.phone}
                            </p>
                        )}
                    </>
                ) : (
                    <div className="py-8 text-center bg-[#F9F9F9] rounded-xl border border-dashed border-[#E0E0E0]">
                        <p className="text-[#9E9E9E] italic mb-4">No address provided yet.</p>
                        <button
                            onClick={() => setEditingType(type)}
                            className="text-sm font-bold text-[#B76E79] hover:underline"
                        >
                            + Add {type.charAt(0).toUpperCase() + type.slice(1)} Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (editingType) {
        const currentData = editingType === 'billing' ? billingAddress : shippingAddress;
        const currentCountryData = allCountries.find(c => c.code === currentData.country);

        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setEditingType(null)}
                    className="flex items-center gap-2 text-sm font-semibold text-[#B76E79] mb-6 hover:underline"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Addresses
                </button>

                <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm border border-[#F0F0F0]">
                    <h2 className="font-display text-2xl font-bold mb-6">
                        Edit {editingType === 'billing' ? 'Billing' : 'Shipping'} Address
                    </h2>

                    <form onSubmit={handleSaveChanges} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="first_name"
                                value={currentData.first_name}
                                onChange={(e: any) => handleInputChange(e, editingType)}
                                required
                            />
                            <Input
                                label="Last Name"
                                name="last_name"
                                value={currentData.last_name}
                                onChange={(e: any) => handleInputChange(e, editingType)}
                                required
                            />
                        </div>

                        <Input
                            label="Company (Optional)"
                            name="company"
                            value={currentData.company}
                            onChange={(e: any) => handleInputChange(e, editingType)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Country/Region"
                                name="country"
                                value={currentData.country}
                                onChange={(e: any) => {
                                    handleInputChange(e, editingType);
                                    // Reset state when country changes
                                    if (editingType === 'billing') {
                                        setBillingAddress(prev => ({ ...prev, state: '' }));
                                    } else {
                                        setShippingAddress(prev => ({ ...prev, state: '' }));
                                    }
                                }}
                                options={allCountries.map(c => ({ value: c.code, label: c.name }))}
                                required
                            />

                            {currentCountryData?.states?.length > 0 ? (
                                <Select
                                    label="State / Province"
                                    name="state"
                                    value={currentData.state}
                                    onChange={(e: any) => handleInputChange(e, editingType)}
                                    options={currentCountryData.states.map((s: any) => ({ value: s.code, label: s.name }))}
                                    required
                                />
                            ) : (
                                <Input
                                    label="State / Province"
                                    name="state"
                                    value={currentData.state}
                                    onChange={(e: any) => handleInputChange(e, editingType)}
                                    required
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Street Address"
                                name="address_1"
                                placeholder="House number and street name"
                                value={currentData.address_1}
                                onChange={(e: any) => handleInputChange(e, editingType)}
                                required
                            />
                            <Input
                                label="Apartment, suite, unit, etc. (Optional)"
                                name="address_2"
                                placeholder="Apartment, suite, unit, etc."
                                value={currentData.address_2}
                                onChange={(e: any) => handleInputChange(e, editingType)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Town / City"
                                name="city"
                                value={currentData.city}
                                onChange={(e: any) => handleInputChange(e, editingType)}
                                required
                            />
                            <Input
                                label="Postcode / ZIP"
                                name="postcode"
                                value={currentData.postcode}
                                onChange={(e: any) => handleInputChange(e, editingType)}
                                required
                            />
                        </div>

                        {editingType === 'billing' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    value={(billingAddress as any).phone}
                                    onChange={(e: any) => handleInputChange(e, 'billing')}
                                    required
                                />
                                <Input
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    value={(billingAddress as any).email}
                                    onChange={(e: any) => handleInputChange(e, 'billing')}
                                    required
                                />
                            </div>
                        )}

                        <div className="flex gap-4 pt-4 border-t border-[#F0F0F0]">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`btn-primary px-10 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingType(null)}
                                className="px-8 py-3 rounded-full border border-[#E0E0E0] font-bold text-sm tracking-widest uppercase text-[#2C2C2C] hover:bg-[#F9F9F9] transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-10">
                <h1 className="font-display text-4xl font-bold mb-2 text-[#2C2C2C]">My Addresses</h1>
                <p className="text-[#9E9E9E]">Manage your saved billing and shipping locations for a faster checkout.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-xl)]">
                <AddressCard type="billing" address={billingAddress} />
                <AddressCard type="shipping" address={shippingAddress} />
            </div>

            <div className="mt-12 p-6 bg-[#FFE5E5] rounded-2xl border border-[#B76E79]">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#2C2C2C] mb-1 text-lg">Fast Checkout</h4>
                        <p className="text-[#2C2C2C] text-sm opacity-80">
                            The addresses you save here will be automatically pre-filled during your next checkout process. Keep them updated to avoid delivery delays.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

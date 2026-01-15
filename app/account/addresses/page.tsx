'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getCustomer, updateCustomer } from '@/lib/woocommerce';

export default function AddressesPage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [customerData, setCustomerData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [addressForm, setAddressForm] = useState({
        first_name: '',
        last_name: '',
        address_1: '',
        city: '',
        postcode: '',
        country: 'US',
        phone: ''
    });

    useEffect(() => {
        async function fetchAddress() {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                // In a real app, user.id would be the WC customer id
                // For this demo, we'll try to get customer 1 or based on user.id
                const customer = await getCustomer(parseInt(user.id));
                if (customer) {
                    setCustomerData(customer);
                    const billing = customer.billing;
                    setAddressForm({
                        first_name: billing.first_name || '',
                        last_name: billing.last_name || '',
                        address_1: billing.address_1 || '',
                        city: billing.city || '',
                        postcode: billing.postcode || '',
                        country: billing.country || 'US',
                        phone: billing.phone || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching customer address:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAddress();
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setIsSaving(true);
        try {
            const updated = await updateCustomer(user.id, {
                billing: addressForm,
                shipping: addressForm // Sync shipping with billing for simplicity
            });

            if (updated) {
                setCustomerData(updated);
                setIsEditing(false);
                alert('Address updated successfully!');
            }
        } catch (error) {
            console.error("Error updating address:", error);
            alert('Failed to update address.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <h1 className="font-display text-4xl font-bold mb-2 text-[#2C2C2C]">My Addresses</h1>
            <p className="text-[#9E9E9E] mb-[var(--spacing-xl)]">Manage your shipping and billing addresses</p>

            {!isEditing ? (
                <div className="space-y-[var(--spacing-lg)]">
                    <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm border border-[#B76E79] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#B76E79] text-white text-xs px-3 py-1 rounded-bl-lg font-bold">
                            DEFAULT
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-[#2C2C2C]">
                                    {addressForm.first_name} {addressForm.last_name}
                                </h3>
                                <p className="text-[#9E9E9E]">Billing & Shipping</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-[#2C2C2C]">
                            <p>{addressForm.address_1 || 'No address set'}</p>
                            <p>{addressForm.city}, {addressForm.postcode}</p>
                            <p>{addressForm.country}</p>
                            <p className="mt-2 text-sm text-[#9E9E9E]">{addressForm.phone}</p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm font-semibold hover:border-[#B76E79] hover:text-[#B76E79] transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-[var(--spacing-lg)] shadow-sm">
                    <h2 className="font-display text-2xl font-bold mb-6">Edit Address</h2>
                    <form onSubmit={handleSaveChanges} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={addressForm.first_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#F9F9F9] rounded-lg border border-transparent focus:bg-white focus:border-[#B76E79] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={addressForm.last_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#F9F9F9] rounded-lg border border-transparent focus:bg-white focus:border-[#B76E79] outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Address</label>
                            <input
                                type="text"
                                name="address_1"
                                value={addressForm.address_1}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[#F9F9F9] rounded-lg border border-transparent focus:bg-white focus:border-[#B76E79] outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={addressForm.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#F9F9F9] rounded-lg border border-transparent focus:bg-white focus:border-[#B76E79] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">ZIP Code</label>
                                <input
                                    type="text"
                                    name="postcode"
                                    value={addressForm.postcode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#F9F9F9] rounded-lg border border-transparent focus:bg-white focus:border-[#B76E79] outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={addressForm.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[#F9F9F9] rounded-lg border border-transparent focus:bg-white focus:border-[#B76E79] outline-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`btn-primary px-8 ${isSaving ? 'opacity-50' : ''}`}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 rounded-lg border border-[#E0E0E0] font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

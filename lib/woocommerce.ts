/**
 * WooCommerce API Integration
 * 
 * This file contains functions to interact with your WordPress WooCommerce backend.
 */

// WooCommerce Configuration
const WOOCOMMERCE_CONFIG = {
    url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL,
    consumerKey: process.env.NEXT_PUBLIC_WOOCOMMERCE_KEY,
    consumerSecret: process.env.NEXT_PUBLIC_WOOCOMMERCE_SECRET,
};

// Base API URL
if (!WOOCOMMERCE_CONFIG.url) {
    console.warn("⚠️ WOOCOMMERCE_URL is missing! Ensure '.env.local' is present.");
}
const API_BASE_URL = `${WOOCOMMERCE_CONFIG.url || ''}/wp-json/wc/v3`;

/**
 * Generate authentication headers for WooCommerce API
 */
function getAuthHeaders() {
    const auth = btoa(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`);
    return {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
    };
}

const clientCache = new Map<string, { data: any, timestamp: number }>();

/**
 * Centralized fetch helper for WooCommerce API
 */
async function fetchWooCommerce(endpoint: string, options: RequestInit & { revalidate?: number | false } = {}) {
    const { revalidate = 60, ...fetchOptions } = options;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Simple client-side cache for GET requests
    if (typeof window !== 'undefined' && (!fetchOptions.method || fetchOptions.method === 'GET')) {
        const cached = clientCache.get(url);
        if (cached && Date.now() - cached.timestamp < (Number(revalidate) || 60) * 1000) {
            return cached.data;
        }
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers: {
                ...getAuthHeaders(),
                ...fetchOptions.headers,
            },
            ...(revalidate !== undefined && { next: { revalidate } }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `WooCommerce API Error: ${response.status}`);
        }

        const data = await response.json();

        // Update client-side cache
        if (typeof window !== 'undefined' && (!fetchOptions.method || fetchOptions.method === 'GET')) {
            clientCache.set(url, { data, timestamp: Date.now() });
        }

        return data;
    } catch (error) {
        console.error(`WooCommerce API Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Fetch products from WooCommerce
 */
export async function getProducts(params: {
    per_page?: number;
    page?: number;
    category?: string;
    featured?: boolean;
    on_sale?: boolean;
} = {}) {
    const queryParams = new URLSearchParams({
        per_page: String(params.per_page || 10),
        page: String(params.page || 1),
        ...(params.category && { category: params.category }),
        ...(params.featured && { featured: 'true' }),
        ...(params.on_sale && { on_sale: 'true' }),
    });

    return fetchWooCommerce(`/products?${queryParams}`).catch(() => []);
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: number) {
    return fetchWooCommerce(`/products/${id}`).catch(() => null);
}

/**
 * Fetch product categories
 */
export async function getCategories() {
    return fetchWooCommerce(`/products/categories`, { revalidate: 3600 }).catch(() => []);
}

/**
 * Create an order
 */
export async function createOrder(orderData: any) {
    return fetchWooCommerce(`/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData),
        revalidate: false
    });
}

/**
 * Create a new customer
 */
export async function createCustomer(data: any) {
    return fetchWooCommerce(`/customers`, {
        method: 'POST',
        body: JSON.stringify(data),
        revalidate: false
    });
}

/**
 * Update customer data
 */
export async function updateCustomer(id: string, data: any) {
    return fetchWooCommerce(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        revalidate: false
    });
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
    try {
        const customers = await fetchWooCommerce(`/customers?email=${encodeURIComponent(email)}`);

        if (!customers || customers.length === 0) {
            const searchResults = await fetchWooCommerce(`/customers?search=${encodeURIComponent(email)}`);
            const exactMatch = searchResults.find((c: any) =>
                c.email.toLowerCase() === email.toLowerCase()
            );
            return exactMatch || null;
        }

        return customers[0];
    } catch {
        return null;
    }
}

/**
 * Get customer by ID
 */
export async function getCustomer(id: number) {
    return fetchWooCommerce(`/customers/${id}`).catch(() => null);
}

/**
 * Search products
 */
export async function searchProducts(search: string) {
    return fetchWooCommerce(`/products?search=${encodeURIComponent(search)}`).catch(() => []);
}

/**
 * Fetch a single order by ID
 */
export async function getOrder(id: string) {
    return fetchWooCommerce(`/orders/${id}`, { revalidate: 0 }).catch(() => null);
}

/**
 * Fetch orders for a specific customer
 */
export async function getCustomerOrders(customerId: number) {
    return fetchWooCommerce(`/orders?customer=${customerId}`, { revalidate: 0 }).catch(() => []);
}

/**
 * Fetch product variations
 */
export async function getProductVariations(productId: number) {
    return fetchWooCommerce(`/products/${productId}/variations`).catch(() => []);
}

/**
 * Fetch product reviews
 */
export async function getProductReviews(productId: number) {
    return fetchWooCommerce(`/products/reviews?product=${productId}`).catch(() => []);
}

/**
 * Fetch payment gateways
 */
export async function getPaymentGateways() {
    try {
        const data = await fetchWooCommerce(`/payment_gateways`);
        return data.filter((gateway: any) => gateway.enabled);
    } catch {
        return [];
    }
}

/**
 * Fetch WooCommerce settings
 */
export async function getWoocommerceSettings() {
    return fetchWooCommerce(`/settings/general`, { revalidate: 3600 }).catch(() => []);
}

/**
 * Fetch shipping methods
 */
export async function getShippingMethods() {
    return fetchWooCommerce(`/shipping_methods`, { revalidate: 3600 }).catch(() => []);
}

/**
 * Fetch shipping zones
 */
export async function getShippingZones() {
    return fetchWooCommerce(`/shipping/zones`, { revalidate: 3600 }).catch(() => []);
}

/**
 * Fetch shipping methods for a specific zone
 */
export async function getShippingZoneMethods(zoneId: number) {
    return fetchWooCommerce(`/shipping/zones/${zoneId}/methods`, { revalidate: 3600 }).catch(() => []);
}

/**
 * Fetch locations for a specific shipping zone
 */
export async function getShippingZoneLocations(zoneId: number) {
    return fetchWooCommerce(`/shipping/zones/${zoneId}/locations`, { revalidate: 3600 }).catch(() => []);
}

/**
 * Fetch all countries and their states
 */
export async function getCountries() {
    return fetchWooCommerce(`/data/countries`, { revalidate: 86400 }).catch(() => []); // Cache countries for a day
}

export async function getCurrencySettings() {
    try {
        const settings = await getWoocommerceSettings();
        const currencyCode = settings.find((s: any) => s.id === 'woocommerce_currency')?.value || 'USD';
        const currencyPos = settings.find((s: any) => s.id === 'woocommerce_currency_pos')?.value || 'left';

        const symbols: Record<string, string> = {
            'USD': '$', 'EUR': '€', 'GBP': '£', 'BDT': '৳', 'INR': '₹'
        };

        return {
            code: currencyCode,
            symbol: symbols[currencyCode] || currencyCode,
            position: currencyPos
        };
    } catch {
        return { code: 'USD', symbol: '$', position: 'left' };
    }
}

/**
 * Fetch product tags
 */
export async function getTags() {
    return fetchWooCommerce(`/products/tags`, { revalidate: 3600 }).catch(() => []);
}

/**
 * Map WooCommerce product to application internal format
 */
export function mapWooCommerceProduct(p: WooCommerceProduct) {
    const brandFromCategory = p.categories.find(c => c.name.toLowerCase().includes('brand'))?.name.replace(/brand/gi, '').trim();
    const brandFromTag = p.tags.find(t => t.name.toLowerCase().includes('brand'))?.name.replace(/brand/gi, '').trim();
    const possibleBrand = p.tags?.[0]?.name || '';

    return {
        id: p.id,
        name: p.name,
        type: p.type,
        price: parseFloat(p.regular_price || p.price || '0'),
        regular_price: p.regular_price,
        sale_price: p.sale_price,
        price_html: p.price_html,
        grouped_products: p.grouped_products || [],
        image: p.images?.[0]?.src || 'https://via.placeholder.com/500',
        images: p.images.map(img => img.src),
        category: p.categories?.[0]?.name || 'Uncategorized',
        categories: p.categories.map(c => c.name),
        attributes: p.attributes,
        rating: parseFloat(p.average_rating) || 5,
        isNew: p.status === 'publish' && (new Date().getTime() - new Date(p.date_created || '').getTime() < 30 * 24 * 60 * 60 * 1000),
        onSale: p.on_sale,
        inStock: p.stock_status === 'instock',
        brand: brandFromCategory || brandFromTag || possibleBrand || 'Lumière',
        description: p.description,
        short_description: p.short_description
    };
}

/**
 * Validate a coupon code
 */
export async function validateCoupon(code: string) {
    try {
        const coupons = await fetchWooCommerce(`/coupons?code=${encodeURIComponent(code)}`, { revalidate: 0 });
        return coupons.length > 0 ? coupons[0] : null;
    } catch {
        return null;
    }
}

// Type definitions for WooCommerce data
export interface WooCommerceProduct {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    type: string;
    status: string;
    featured: boolean;
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    price_html: string;
    grouped_products?: number[];
    date_created: string;
    on_sale: boolean;
    images: Array<{ id: number; src: string; name: string; alt: string; }>;
    categories: Array<{ id: number; name: string; slug: string; }>;
    tags: Array<{ id: number; name: string; slug: string; }>;
    attributes: Array<{
        id: number;
        name: string;
        position: number;
        visible: boolean;
        variation: boolean;
        options: string[];
    }>;
    stock_status: string;
    stock_quantity: number | null;
    average_rating: string;
    rating_count: number;
}

export interface WooCommerceCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: { id: number; src: string; name: string; alt: string; } | null;
    count: number;
}

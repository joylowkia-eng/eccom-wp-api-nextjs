/**
 * WooCommerce API Integration
 * 
 * This file contains functions to interact with your WordPress WooCommerce backend.
 * Replace the placeholder values with your actual WooCommerce credentials.
 */

// WooCommerce Configuration
const WOOCOMMERCE_CONFIG = {
    url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://ecommerce.local/',
    consumerKey: process.env.NEXT_PUBLIC_WOOCOMMERCE_KEY || 'ck_e9606279c2965ee75869ac5e6408cbe6f5a33dc4',
    consumerSecret: process.env.NEXT_PUBLIC_WOOCOMMERCE_SECRET || 'cs_6c225ef6747738d7186a2b2625d74898373f1c7a',
};

// Base API URL
const API_BASE_URL = `${WOOCOMMERCE_CONFIG.url}/wp-json/wc/v3`;

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

/**
 * Fetch products from WooCommerce
 * @param params - Query parameters (per_page, page, category, etc.)
 */
export async function getProducts(params: {
    per_page?: number;
    page?: number;
    category?: string;
    featured?: boolean;
    on_sale?: boolean;
} = {}) {
    try {
        const queryParams = new URLSearchParams({
            per_page: String(params.per_page || 10),
            page: String(params.page || 1),
            ...(params.category && { category: params.category }),
            ...(params.featured && { featured: 'true' }),
            ...(params.on_sale && { on_sale: 'true' }),
        });

        const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
            headers: getAuthHeaders(),
            next: { revalidate: 60 }, // Revalidate every 60 seconds
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

/**
 * Fetch a single product by ID
 * @param id - Product ID
 */
export async function getProduct(id: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            headers: getAuthHeaders(),
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

/**
 * Fetch product categories
 */
export async function getCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`, {
            headers: getAuthHeaders(),
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Create an order
 * @param orderData - Order data
 */
export async function createOrder(orderData: {
    payment_method: string;
    payment_method_title: string;
    set_paid: boolean;
    billing: any;
    shipping: any;
    line_items: any[];
    customer_id?: number;
}) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

/**
 * Update customer data
 */
export async function updateCustomer(id: string, data: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to update customer: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating customer:', error);
        return null;
    }
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/customers?email=${encodeURIComponent(email)}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch customer: ${response.statusText}`);
        }

        const customers = await response.json();
        return customers.length > 0 ? customers[0] : null;
    } catch (error) {
        console.error('Error fetching customer by email:', error);
        return null;
    }
}

/**
 * Get customer by ID
 * @param id - Customer ID
 */
export async function getCustomer(id: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch customer: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching customer:', error);
        return null;
    }
}

/**
 * Search products
 */
export async function searchProducts(search: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(search)}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to search products: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

/**
 * Fetch a single order by ID
 */
export async function getOrder(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch order: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}

/**
 * Fetch product variations
 */
export async function getProductVariations(productId: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/variations`, {
            headers: getAuthHeaders(),
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch variations: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching variations:', error);
        return [];
    }
}

/**
 * Fetch payment gateways
 */
export async function getPaymentGateways() {
    try {
        const response = await fetch(`${API_BASE_URL}/payment_gateways`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch payment gateways: ${response.statusText}`);
        }

        const data = await response.json();
        return data.filter((gateway: any) => gateway.enabled);
    } catch (error) {
        console.error('Error fetching payment gateways:', error);
        return [];
    }
}

/**
 * Fetch WooCommerce settings
 */
export async function getWoocommerceSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/general`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch settings: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching settings:', error);
        return [];
    }
}

/**
 * Fetch shipping methods
 */
export async function getShippingMethods() {
    try {
        const response = await fetch(`${API_BASE_URL}/shipping_methods`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch shipping methods: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching shipping methods:', error);
        return [];
    }
}

export async function getCurrencySettings() {
    try {
        const settings = await getWoocommerceSettings();
        const currencyCode = settings.find((s: any) => s.id === 'woocommerce_currency')?.value || 'USD';
        const currencyPos = settings.find((s: any) => s.id === 'woocommerce_currency_pos')?.value || 'left';

        const symbols: Record<string, string> = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'BDT': '৳',
            'INR': '₹'
        };

        return {
            code: currencyCode,
            symbol: symbols[currencyCode] || currencyCode,
            position: currencyPos
        };
    } catch (error) {
        return { code: 'USD', symbol: '$', position: 'left' };
    }
}

/**
 * Fetch product tags
 */
export async function getTags() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/tags`, {
            headers: getAuthHeaders(),
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tags: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching tags:', error);
        return [];
    }
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
    date_created: string;
    on_sale: boolean;
    images: Array<{
        id: number;
        src: string;
        name: string;
        alt: string;
    }>;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    tags: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
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
    image: {
        id: number;
        src: string;
        name: string;
        alt: string;
    } | null;
    count: number;
}

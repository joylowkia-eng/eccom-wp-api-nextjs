import SSLCommerzPayment from 'sslcommerz-lts';

const store_id = process.env.SSLCOMMERZ_STORE_ID || '';
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || '';
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

export const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);

export const PAYMENT_CONFIG = {
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/success`,
    fail_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/fail`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/cancel`,
    ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/ipn`,
};

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
    apiVersion: '2025-01-27-acacia' as any, // Using a recent stable version
    typescript: true,
});

export const PLANS = {
    FREE: {
        name: 'Free',
        priceId: '',
        limit: 3,
        features: ['3 Generations per day', 'Standard Hooks', 'Basic Campaign Analysis', 'Script Refiner (Basic)'],
    },
    PRO: {
        name: 'Pro',
        priceId: process.env.STRIPE_PRO_PRICE_ID || '',
        price: 9.99,
        limit: 50,
        features: ['50 Generations per day', 'Advanced Tones (Emotional, Luxury)', 'PRO Script Refiner (Soul, Story)', 'High AI Priority'],
    },
    ULTIMATE: {
        name: 'Ultimate',
        priceId: process.env.STRIPE_ULTIMATE_PRICE_ID || '',
        price: 49.99,
        limit: 9999, // Unlimited
        features: ['Unlimited Generations', 'Everything in Pro', 'Custom Brand Models', 'Multi-platform Sync', 'API Access'],
    },
};

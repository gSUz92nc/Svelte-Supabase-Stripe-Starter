export interface Subscription {
    id: string;
    user_id: string;
    status: string;
    price_id: string;
    quantity: number;
    cancel_at_period_end: boolean;
    created: string;
    current_period_start: string;
    current_period_end: string;
    ended_at: string | null;
    cancel_at: string | null;
    canceled_at: string | null;
    trial_start: string | null;
    trial_end: string | null;
    prices?: PriceWithProduct | null;
}

export interface Product {
    id: string;
    active: boolean;
    name: string;
    description: string | null;
    image: string | null;
    metadata?: Record<string, any>;
    prices?: Price[];
}

export interface Price {
    id: string;
    product_id: string;
    active: boolean;
    description: string | null;
    unit_amount: number;
    currency: string;
    type: 'one_time' | 'recurring';
    interval: 'day' | 'week' | 'month' | 'year' | 'lifetime';
    interval_count: number;
    trial_period_days: number | null;
    metadata?: Record<string, any>;
    products?: Product | null;
}

export interface ProductWithPrices extends Product {
    prices: Price[];
}

export interface PriceWithProduct extends Price {
    products: Product | null;
}

export interface SubscriptionWithProduct extends Subscription {
    prices: PriceWithProduct | null;
}

export type BillingInterval = 'lifetime' | 'year' | 'month';
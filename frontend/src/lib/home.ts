import { apiRequest } from './api';

export type HomeCategory = {
    id: number;
    name: string;
    slug: string;
    tone: string;
    listing_count: number;
    children_count: number;
};

export type HomeStore = {
    id: number;
    name: string;
    slug: string;
    tagline: string | null;
    banner_url: string | null;
    logo_url: string | null;
    verified: boolean;
};

export type HomeListing = {
    id: number;
    name: string;
    slug: string;
    sku: string;
    type: string;
    tagline: string | null;
    price: number;
    compare_at_price: number | null;
    discount_percent: number | null;
    currency: string;
    image_url: string | null;
    store: { id: number; name: string; slug: string; verified: boolean } | null;
    category: { id: number; name: string; slug: string } | null;
};

export type HomeSlide = {
    id: number;
    slug: string;
    copy_key: string;
    href: string | null;
    image_url: string | null;
};

export type HomePayload = {
    slides: HomeSlide[];
    categories: HomeCategory[];
    panels: {
        deals: string[];
        services: string[];
        stores: string[];
        selling: string[];
    };
    deals: HomeListing[];
    services: HomeListing[];
    products: HomeListing[];
    stores: HomeStore[];
};

export const emptyHome: HomePayload = {
    slides: [],
    categories: [],
    panels: { deals: [], services: [], stores: [], selling: [] },
    deals: [],
    services: [],
    products: [],
    stores: [],
};

export const homeApi = {
    async show() {
        return await apiRequest<HomePayload>('/home');
    },
};

export function storeHref(slug: string): string {
    return `?store=${encodeURIComponent(slug)}#storefront`;
}

export function formatMoney(amount: number, currency: string, locale: string): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency || 'USD' }).format(amount);
}

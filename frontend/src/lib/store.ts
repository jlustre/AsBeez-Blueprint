import { apiRequest, getToken } from './api';

/* ------------------------------------------------------------------ */
/* Structure — the admin-curated option lists                          */
/* ------------------------------------------------------------------ */

export type StructureCategory = {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    tone: string;
};

export type StructureSocialPlatform = {
    id: number;
    key: string;
    label: string;
    icon: string | null;
    /** Brand marks lucide does not ship arrive as a raw SVG path. */
    icon_path: string | null;
    input_type: string;
    placeholder: string | null;
    tone: string;
};

export type StructurePolicyType = {
    id: number;
    key: string;
    label: string;
    hint: string | null;
    icon: string;
    tone: string;
    is_required: boolean;
};

export type StructureSettingDefinition = {
    id: number;
    key: string;
    group: string;
    label: string;
    hint: string | null;
    type: 'bool' | 'select' | 'number' | 'text';
    options: { value: string; label: string }[] | null;
    default_value: string | null;
};

export type StructureNavLink = {
    id: number;
    group: string;
    label: string;
    hint: string | null;
    icon: string;
    tone: string;
    route: string;
    badge_source: string | null;
    roles: string[] | null;
};

export type StructureCountry = {
    code: string;
    name: string;
};

export type StructureRegion = {
    code: string;
    name: string;
    /** state | province | territory | region | district | country */
    type: string;
};

export type Structure = {
    categories: StructureCategory[];
    countries: StructureCountry[];
    /** Keyed by country code; absent means that country has no seeded list. */
    regions: Record<string, StructureRegion[]>;
    social_platforms: StructureSocialPlatform[];
    policy_types: StructurePolicyType[];
    setting_definitions: StructureSettingDefinition[];
    /** Keyed by context: 'vendor' | 'member'. */
    nav_links: Record<string, StructureNavLink[]>;
};

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export type StoreStatus = 'draft' | 'active' | 'paused' | 'suspended';

export type StoreSummary = {
    id: number;
    name: string;
    slug: string;
    status: StoreStatus;
    logo_url: string | null;
    verified: boolean;
};

export type StoreHour = {
    weekday: number;
    day: string;
    opens_at: string | null;
    closes_at: string | null;
    is_closed: boolean;
};

export type StoreSocialValue = {
    platform_id: number;
    platform_key: string | null;
    value: string;
};

export type StorePolicyRow = {
    id: number;
    policy_type_id: number;
    type_key: string | null;
    status: 'draft' | 'published';
    body: string | null;
    published_at: string | null;
};

export type StoreVerificationRow = {
    kind: string;
    status: 'unverified' | 'pending' | 'verified' | 'rejected';
    reference: string | null;
    verified_at: string | null;
};

export type CompletenessTask = {
    key: string;
    label: string;
    hint: string;
    done: boolean;
    cta: string;
    href: string;
};

export type Completeness = {
    percent: number;
    completed: number;
    total: number;
    remaining: number;
    tasks: CompletenessTask[];
};

export type StoreProfile = {
    id: number;
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    status: StoreStatus;
    verified_at: string | null;
    media: { banner_url: string | null; logo_url: string | null };
    contact: { public_email: string | null; public_phone: string | null; website: string | null };
    location: {
        country: string | null;
        /** Resolved for display; the code is what is stored. */
        country_name: string | null;
        state: string | null;
        state_name: string | null;
        city: string | null;
        postal_code: string | null;
        address_line: string | null;
        hide_address: boolean;
        service_area: string | null;
        latitude: number | null;
        longitude: number | null;
    };
    commerce: {
        timezone: string;
        currency: string;
        language: string;
        min_order_amount: number | null;
    };
    categories: { id: number; name: string; slug: string; tone: string }[];
    hours: StoreHour[];
    socials: StoreSocialValue[];
    policies: StorePolicyRow[];
    verifications: StoreVerificationRow[];
    settings: Record<string, string | null>;
    completeness: Completeness;
};

/** Everything the core PUT accepts; all optional, so a patch is a patch. */
export type StoreCorePatch = Partial<{
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    public_email: string | null;
    public_phone: string | null;
    website: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    postal_code: string | null;
    address_line: string | null;
    hide_address: boolean;
    service_area: string | null;
    timezone: string;
    currency: string;
    language: string;
    min_order_amount: number | null;
    status: StoreStatus;
}>;

export type HoursPayload = {
    weekday: number;
    is_closed: boolean;
    opens_at: string | null;
    closes_at: string | null;
}[];

export type SocialsPayload = { platform_id: number; value: string }[];

/** What the public storefront endpoint returns. */
export type PublicStore = Omit<StoreProfile, 'completeness'>;

export const storefrontApi = {
    /**
     * Fetches a storefront by slug. Sends the bearer token when there is one:
     * an owner (or admin) may preview a store that is not published yet, and
     * the `preview` flag says that is what happened.
     */
    async get(slug: string) {
        const authenticated = getToken() !== null;

        return await apiRequest<{ store: PublicStore; preview: boolean }>(
            `/stores/${encodeURIComponent(slug)}`,
            {},
            authenticated,
        );
    },
};

export const structureApi = {
    async get() {
        return await apiRequest<Structure>('/structure', {}, true);
    },
};

export const storeApi = {
    async list() {
        return (await apiRequest<{ stores: StoreSummary[] }>('/vendor/stores', {}, true)).stores;
    },

    async create(name: string) {
        return (await apiRequest<{ store: StoreProfile }>('/vendor/stores', {
            method: 'POST',
            body: JSON.stringify({ name }),
        }, true)).store;
    },

    async get(id: number) {
        return (await apiRequest<{ store: StoreProfile }>(`/vendor/stores/${id}`, {}, true)).store;
    },

    async updateCore(id: number, patch: StoreCorePatch) {
        return (await apiRequest<{ store: StoreProfile }>(`/vendor/stores/${id}`, {
            method: 'PUT',
            body: JSON.stringify(patch),
        }, true)).store;
    },

    async saveHours(id: number, hours: HoursPayload) {
        return (await apiRequest<{ store: StoreProfile }>(`/vendor/stores/${id}/hours`, {
            method: 'PUT',
            body: JSON.stringify({ hours }),
        }, true)).store;
    },

    async saveSocials(id: number, socials: SocialsPayload) {
        return (await apiRequest<{ store: StoreProfile }>(`/vendor/stores/${id}/socials`, {
            method: 'PUT',
            body: JSON.stringify({ socials }),
        }, true)).store;
    },

    async saveCategories(id: number, categoryIds: number[]) {
        return (await apiRequest<{ store: StoreProfile }>(`/vendor/stores/${id}/categories`, {
            method: 'PUT',
            body: JSON.stringify({ category_ids: categoryIds }),
        }, true)).store;
    },

    async saveSettings(id: number, settings: Record<string, string | boolean | null>) {
        return (await apiRequest<{ store: StoreProfile }>(`/vendor/stores/${id}/settings`, {
            method: 'PUT',
            body: JSON.stringify({ settings }),
        }, true)).store;
    },

    async uploadMedia(id: number, kind: 'banner' | 'logo', file: File) {
        const body = new FormData();
        body.append('file', file);

        return (await apiRequest<{ store: StoreProfile }>(`/vendor/stores/${id}/media/${kind}`, {
            method: 'POST',
            body,
        }, true)).store;
    },

    async removeMedia(id: number, kind: 'banner' | 'logo') {
        return (await apiRequest<{ store: StoreProfile }>(`/vendor/stores/${id}/media/${kind}`, {
            method: 'DELETE',
        }, true)).store;
    },

    async savePolicy(id: number, input: { policy_type_id: number; body: string | null; status: 'draft' | 'published' }) {
        return await apiRequest<{ policy: StorePolicyRow }>(`/vendor/stores/${id}/policies`, {
            method: 'PUT',
            body: JSON.stringify(input),
        }, true);
    },

    async deletePolicy(id: number, policyId: number) {
        return await apiRequest<{ message: string }>(`/vendor/stores/${id}/policies/${policyId}`, {
            method: 'DELETE',
        }, true);
    },

    async requestVerification(id: number, kind: string) {
        return await apiRequest<{ message: string }>(`/vendor/stores/${id}/verifications`, {
            method: 'POST',
            body: JSON.stringify({ kind }),
        }, true);
    },

    async completeness(id: number) {
        return await apiRequest<Completeness>(`/vendor/stores/${id}/completeness`, {}, true);
    },
};

import { apiRequest } from './api';

export type RegistryProgress = { done: number; percent: number };

export type TranslationRegistry = {
    slug: string;
    label: string;
    rows: number;
    fields: string[];
    translatable: number;
    progress: Record<string, RegistryProgress>;
};

export type TranslationRow = {
    id: number;
    /** Human-recognisable key for the row, e.g. a slug. */
    identifier: string;
    fields: { field: string; source: string; value: string }[];
};

export type MemberStatus = 'active' | 'pending' | 'restricted' | 'suspended' | 'deactivated';

export type AdminMember = {
    id: number;
    name: string;
    email: string;
    username: string | null;
    phone: string | null;
    avatar_url: string | null;
    initials: string;
    status: MemberStatus;
    email_verified_at: string | null;
    joined_at: string | null;
    last_active_at: string | null;
    status_changed_at: string | null;
};

export type AdminMemberDetail = AdminMember & {
    display_name: string | null;
    language: string | null;
    timezone: string | null;
    is_public: boolean;
    status_reason: string | null;
    status_changed_by: string | null;
    address_count: number;
    location: { city: string; state: string | null; country: string } | null;
    events: AdminMemberEvent[];
};

export type AdminMemberEvent = {
    id: number;
    type: 'note' | 'status' | string;
    body: string | null;
    from_status: string | null;
    to_status: string | null;
    author: string | null;
    created_at: string | null;
    member?: string | null;
    member_id?: number;
};

export type AdminMemberStats = {
    total: number;
    verified: number;
    unverified: number;
    new_this_month: number;
    active: number;
    pending: number;
    restricted: number;
    suspended: number;
    deactivated: number;
};

export type AdminMemberList = {
    members: AdminMember[];
    meta: {
        page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number | null;
        to: number | null;
    };
    stats: AdminMemberStats;
    statuses: MemberStatus[];
};

export type MemberListQuery = {
    search?: string;
    status?: MemberStatus | '';
    verification?: 'verified' | 'unverified' | '';
    registered_from?: string;
    registered_to?: string;
    sort?: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'recently-active';
    per_page?: number;
    page?: number;
};

export const adminApi = {
    async registries() {
        return await apiRequest<{
            fallback: string;
            locales: string[];
            registries: TranslationRegistry[];
        }>('/admin/translations', {}, true);
    },

    async rows(registry: string, locale: string) {
        return await apiRequest<{
            registry: { slug: string; label: string };
            locale: string;
            rows: TranslationRow[];
        }>(`/admin/translations/${registry}?locale=${encodeURIComponent(locale)}`, {}, true);
    },

    async save(registry: string, id: number, locale: string, values: Record<string, string>) {
        return await apiRequest<{ message: string; row: { id: number; values: Record<string, string> } }>(
            `/admin/translations/${registry}/${id}`,
            { method: 'PUT', body: JSON.stringify({ locale, values }) },
            true,
        );
    },

    async members(query: MemberListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminMemberList>(`/admin/members${suffix}`, {}, true);
    },

    async member(id: number) {
        return (await apiRequest<{ member: AdminMemberDetail }>(`/admin/members/${id}`, {}, true)).member;
    },

    async updateMemberStatus(id: number, status: MemberStatus, reason?: string) {
        return (await apiRequest<{ member: AdminMemberDetail }>(
            `/admin/members/${id}/status`,
            { method: 'PUT', body: JSON.stringify({ status, reason: reason || null }) },
            true,
        )).member;
    },

    async addMemberNote(id: number, body: string) {
        return (await apiRequest<{ member: AdminMemberDetail }>(
            `/admin/members/${id}/notes`,
            { method: 'POST', body: JSON.stringify({ body }) },
            true,
        )).member;
    },

    async memberEvents(limit = 10) {
        return await apiRequest<{ events: AdminMemberEvent[] }>(
            `/admin/members/events?limit=${limit}`,
            {},
            true,
        );
    },

    async vendors(query: VendorListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminVendorList>(`/admin/vendors${suffix}`, {}, true);
    },

    async vendor(id: number) {
        return (await apiRequest<{ vendor: AdminVendorDetail }>(`/admin/vendors/${id}`, {}, true)).vendor;
    },

    async updateVendorStatus(id: number, status: MemberStatus, reason?: string) {
        return (await apiRequest<{ vendor: AdminVendorDetail }>(
            `/admin/vendors/${id}/status`,
            { method: 'PUT', body: JSON.stringify({ status, reason: reason || null }) },
            true,
        )).vendor;
    },

    async addVendorNote(id: number, body: string) {
        return (await apiRequest<{ vendor: AdminVendorDetail }>(
            `/admin/vendors/${id}/notes`,
            { method: 'POST', body: JSON.stringify({ body }) },
            true,
        )).vendor;
    },

    async updateStoreStatus(vendorId: number, storeId: number, status: StoreStatus) {
        return (await apiRequest<{ vendor: AdminVendorDetail }>(
            `/admin/vendors/${vendorId}/stores/${storeId}/status`,
            { method: 'PUT', body: JSON.stringify({ status }) },
            true,
        )).vendor;
    },

    async vendorEvents(limit = 10) {
        return await apiRequest<{ events: AdminVendorEvent[] }>(
            `/admin/vendors/events?limit=${limit}`,
            {},
            true,
        );
    },

    async products(query: ProductListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminProductList>(`/admin/products${suffix}`, {}, true);
    },

    async product(id: number) {
        return (await apiRequest<{ product: AdminProductDetail }>(`/admin/products/${id}`, {}, true)).product;
    },

    async updateProductStatus(id: number, status: ProductStatus, reason?: string) {
        return (await apiRequest<{ product: AdminProductDetail }>(
            `/admin/products/${id}/status`,
            { method: 'PUT', body: JSON.stringify({ status, reason: reason || null }) },
            true,
        )).product;
    },

    async addProductNote(id: number, body: string) {
        return (await apiRequest<{ product: AdminProductDetail }>(
            `/admin/products/${id}/notes`,
            { method: 'POST', body: JSON.stringify({ body }) },
            true,
        )).product;
    },

    async productEvents(limit = 10) {
        return await apiRequest<{ events: AdminProductEvent[] }>(
            `/admin/products/events?limit=${limit}`,
            {},
            true,
        );
    },

    async services(query: ServiceListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminServiceList>(`/admin/services${suffix}`, {}, true);
    },

    async service(id: number) {
        return (await apiRequest<{ service: AdminServiceDetail }>(`/admin/services/${id}`, {}, true)).service;
    },

    async updateServiceStatus(id: number, status: ProductStatus, reason?: string) {
        return (await apiRequest<{ service: AdminServiceDetail }>(
            `/admin/services/${id}/status`,
            { method: 'PUT', body: JSON.stringify({ status, reason: reason || null }) },
            true,
        )).service;
    },

    async addServiceNote(id: number, body: string) {
        return (await apiRequest<{ service: AdminServiceDetail }>(
            `/admin/services/${id}/notes`,
            { method: 'POST', body: JSON.stringify({ body }) },
            true,
        )).service;
    },

    async serviceEvents(limit = 10) {
        return await apiRequest<{ events: AdminProductEvent[] }>(
            `/admin/services/events?limit=${limit}`,
            {},
            true,
        );
    },

    async orders(query: OrderListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminOrderList>(`/admin/orders${suffix}`, {}, true);
    },

    async order(id: number) {
        return (await apiRequest<{ order: AdminOrderDetail }>(`/admin/orders/${id}`, {}, true)).order;
    },

    async updateOrderStatus(id: number, status: OrderStatus, reason?: string) {
        return (await apiRequest<{ order: AdminOrderDetail }>(
            `/admin/orders/${id}/status`,
            { method: 'PUT', body: JSON.stringify({ status, reason: reason || null }) },
            true,
        )).order;
    },

    async addOrderNote(id: number, body: string) {
        return (await apiRequest<{ order: AdminOrderDetail }>(
            `/admin/orders/${id}/notes`,
            { method: 'POST', body: JSON.stringify({ body }) },
            true,
        )).order;
    },

    async orderEvents(limit = 10) {
        return await apiRequest<{ events: AdminOrderEvent[] }>(
            `/admin/orders/events?limit=${limit}`,
            {},
            true,
        );
    },

    async disputes(query: DisputeListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminDisputeList>(`/admin/disputes${suffix}`, {}, true);
    },

    async dispute(id: number) {
        return (await apiRequest<{ dispute: AdminDisputeDetail }>(`/admin/disputes/${id}`, {}, true)).dispute;
    },

    async updateDisputeStatus(id: number, status: DisputeStatus, reason?: string) {
        return (await apiRequest<{ dispute: AdminDisputeDetail }>(
            `/admin/disputes/${id}/status`,
            { method: 'PUT', body: JSON.stringify({ status, reason: reason || null }) },
            true,
        )).dispute;
    },

    async addDisputeNote(id: number, body: string) {
        return (await apiRequest<{ dispute: AdminDisputeDetail }>(
            `/admin/disputes/${id}/notes`,
            { method: 'POST', body: JSON.stringify({ body }) },
            true,
        )).dispute;
    },

    async disputeEvents(limit = 10) {
        return await apiRequest<{ events: AdminDisputeEvent[] }>(
            `/admin/disputes/events?limit=${limit}`,
            {},
            true,
        );
    },

    async financials(query: FinancialListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminFinancialList>(`/admin/financials${suffix}`, {}, true);
    },

    async financialEntry(id: number) {
        return (await apiRequest<{ entry: AdminFinancialDetail }>(`/admin/financials/${id}`, {}, true)).entry;
    },

    async updateFinancialStatus(id: number, status: FinancialStatus, reason?: string) {
        return (await apiRequest<{ entry: AdminFinancialDetail }>(
            `/admin/financials/${id}/status`,
            { method: 'PUT', body: JSON.stringify({ status, reason: reason || null }) },
            true,
        )).entry;
    },

    async addFinancialNote(id: number, body: string) {
        return (await apiRequest<{ entry: AdminFinancialDetail }>(
            `/admin/financials/${id}/notes`,
            { method: 'POST', body: JSON.stringify({ body }) },
            true,
        )).entry;
    },

    async financialEvents(limit = 10) {
        return await apiRequest<{ events: AdminFinancialEvent[] }>(
            `/admin/financials/events?limit=${limit}`,
            {},
            true,
        );
    },

    async categories(query: CategoryListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminCategoryList>(`/admin/categories${suffix}`, {}, true);
    },

    async category(id: number) {
        return (await apiRequest<{ category: AdminCategoryDetail }>(`/admin/categories/${id}`, {}, true)).category;
    },

    async createCategory(payload: CategoryPayload) {
        return await apiRequest<{ category: AdminCategoryDetail; message: string }>(
            '/admin/categories',
            { method: 'POST', body: JSON.stringify(payload) },
            true,
        );
    },

    async updateCategory(id: number, payload: CategoryPayload) {
        return await apiRequest<{ category: AdminCategoryDetail; message: string }>(
            `/admin/categories/${id}`,
            { method: 'PUT', body: JSON.stringify(payload) },
            true,
        );
    },

    async content(query: ContentListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminContentList>(`/admin/content${suffix}`, {}, true);
    },

    async contentItem(type: ContentType, id: number) {
        return (await apiRequest<{ item: AdminContentItem }>(`/admin/content/${type}/${id}`, {}, true)).item;
    },

    async updateContentVisibility(type: ContentType, id: number, isActive: boolean) {
        return await apiRequest<{ item: AdminContentItem; message: string }>(
            `/admin/content/${type}/${id}`,
            { method: 'PUT', body: JSON.stringify({ is_active: isActive }) },
            true,
        );
    },

    async commissions(query: CommissionListQuery = {}) {
        const params = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
            }
        });

        const suffix = params.size > 0 ? `?${params.toString()}` : '';

        return await apiRequest<AdminCommissionList>(`/admin/commissions${suffix}`, {}, true);
    },

    async commissionRule(id: number) {
        return (await apiRequest<{ rule: AdminCommissionDetail }>(`/admin/commissions/${id}`, {}, true)).rule;
    },

    async createCommissionRule(payload: CommissionPayload) {
        return await apiRequest<{ rule: AdminCommissionDetail; message: string }>(
            '/admin/commissions',
            { method: 'POST', body: JSON.stringify(payload) },
            true,
        );
    },

    async updateCommissionRule(id: number, payload: CommissionPayload) {
        return await apiRequest<{ rule: AdminCommissionDetail; message: string }>(
            `/admin/commissions/${id}`,
            { method: 'PUT', body: JSON.stringify(payload) },
            true,
        );
    },

    async updateCommissionStatus(id: number, status: CommissionStoredStatus) {
        return await apiRequest<{ rule: AdminCommissionDetail; message: string }>(
            `/admin/commissions/${id}/status`,
            { method: 'PUT', body: JSON.stringify({ status }) },
            true,
        );
    },

    async addCommissionNote(id: number, body: string) {
        return await apiRequest<{ rule: AdminCommissionDetail; message: string }>(
            `/admin/commissions/${id}/notes`,
            { method: 'POST', body: JSON.stringify({ body }) },
            true,
        );
    },

    async updateCommissionSettings(payload: CommissionSettings) {
        return await apiRequest<{ settings: CommissionSettings; message: string }>(
            '/admin/commissions/settings',
            { method: 'PUT', body: JSON.stringify(payload) },
            true,
        );
    },

    async commissionEvents(limit = 10) {
        return await apiRequest<{ events: AdminCommissionEvent[] }>(
            `/admin/commissions/events?limit=${limit}`,
            {},
            true,
        );
    },

    async ppf() {
        return await apiRequest<AdminPpfDirectory>('/admin/ppf', {}, true);
    },

    async updatePpfSettings(payload: PpfSettingsPayload) {
        return await apiRequest<{ settings: import('./ppf').PpfSettings; message: string }>(
            '/admin/ppf/settings',
            { method: 'PUT', body: JSON.stringify(payload) },
            true,
        );
    },

    async createPpfTier(payload: PpfTierPayload) {
        return await apiRequest<{ tier: import('./ppf').PpfTier; message: string }>(
            '/admin/ppf/tiers',
            { method: 'POST', body: JSON.stringify(payload) },
            true,
        );
    },

    async updatePpfTier(id: number, payload: PpfTierPayload) {
        return await apiRequest<{ tier: import('./ppf').PpfTier; message: string }>(
            `/admin/ppf/tiers/${id}`,
            { method: 'PUT', body: JSON.stringify(payload) },
            true,
        );
    },

    async deletePpfTier(id: number) {
        return await apiRequest<{ message: string }>(`/admin/ppf/tiers/${id}`, { method: 'DELETE' }, true);
    },

    async createPpfMarket(payload: PpfMarketPayload) {
        return await apiRequest<{ market: import('./ppf').PpfMarket; message: string }>(
            '/admin/ppf/markets',
            { method: 'POST', body: JSON.stringify(payload) },
            true,
        );
    },

    async updatePpfMarket(id: number, payload: PpfMarketPayload) {
        return await apiRequest<{ market: import('./ppf').PpfMarket; message: string }>(
            `/admin/ppf/markets/${id}`,
            { method: 'PUT', body: JSON.stringify(payload) },
            true,
        );
    },

    async deletePpfMarket(id: number) {
        return await apiRequest<{ message: string }>(`/admin/ppf/markets/${id}`, { method: 'DELETE' }, true);
    },

    async createPpfPlan(payload: PpfPlanPayload) {
        return await apiRequest<{ plan: import('./ppf').PpfPlan; message: string }>(
            '/admin/ppf/plans',
            { method: 'POST', body: JSON.stringify(payload) },
            true,
        );
    },

    async updatePpfPlan(id: number, payload: PpfPlanPayload) {
        return await apiRequest<{ plan: import('./ppf').PpfPlan; message: string }>(
            `/admin/ppf/plans/${id}`,
            { method: 'PUT', body: JSON.stringify(payload) },
            true,
        );
    },

    async deletePpfPlan(id: number) {
        return await apiRequest<{ message: string }>(`/admin/ppf/plans/${id}`, { method: 'DELETE' }, true);
    },

    async createPpfFaq(payload: PpfFaqPayload) {
        return await apiRequest<{ faq: import('./ppf').PpfFaq; message: string }>(
            '/admin/ppf/faqs',
            { method: 'POST', body: JSON.stringify(payload) },
            true,
        );
    },

    async updatePpfFaq(id: number, payload: PpfFaqPayload) {
        return await apiRequest<{ faq: import('./ppf').PpfFaq; message: string }>(
            `/admin/ppf/faqs/${id}`,
            { method: 'PUT', body: JSON.stringify(payload) },
            true,
        );
    },

    async deletePpfFaq(id: number) {
        return await apiRequest<{ message: string }>(`/admin/ppf/faqs/${id}`, { method: 'DELETE' }, true);
    },
};

export type AdminPpfStats = {
    published: boolean;
    tiers: number;
    markets: number;
    schedules: number;
    plans: number;
    faqs: number;
    inactive: number;
};

export type AdminPpfDirectory = {
    settings: import('./ppf').PpfSettings;
    tiers: import('./ppf').PpfTier[];
    markets: import('./ppf').PpfMarket[];
    plans: import('./ppf').PpfPlan[];
    faqs: import('./ppf').PpfFaq[];
    stats: AdminPpfStats;
    emphases: import('./ppf').PpfTier['emphasis'][];
    styles: import('./ppf').PpfPlan['style'][];
};

export type PpfSettingsPayload = Partial<import('./ppf').PpfSettings>;
export type PpfTierPayload = Partial<import('./ppf').PpfTier> & { name?: string; badge?: string };
export type PpfMarketPayload = Partial<import('./ppf').PpfMarket> & { label?: string };
export type PpfPlanPayload = Partial<import('./ppf').PpfPlan> & { name?: string; ppf_market_id?: number };
export type PpfFaqPayload = Partial<import('./ppf').PpfFaq> & { question?: string; answer?: string };

export type StoreStatus = 'draft' | 'active' | 'paused' | 'suspended';

export type AdminVendorStore = {
    id: number;
    name: string;
    slug: string;
    status: StoreStatus;
    tagline: string | null;
    logo_url: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    service_area: string | null;
    public_email: string | null;
    public_phone: string | null;
    website: string | null;
    verified_at: string | null;
    categories: { id: number; name: string; slug: string }[];
    verification: { verified: number; pending: number; rejected: number };
    completeness?: { percent: number; completed: number; total: number; remaining: number };
    verifications?: { kind: string; status: string; reference: string | null; verified_at: string | null }[];
};

export type AdminVendor = {
    id: number;
    name: string;
    email: string;
    username: string | null;
    phone: string | null;
    avatar_url: string | null;
    initials: string;
    status: MemberStatus;
    email_verified_at: string | null;
    joined_at: string | null;
    last_active_at: string | null;
    status_changed_at: string | null;
    store_count: number;
    verification: 'verified' | 'pending' | 'unverified';
    stores: AdminVendorStore[];
};

export type AdminVendorDetail = AdminVendor & {
    status_reason: string | null;
    status_changed_by: string | null;
    events: AdminVendorEvent[];
};

export type AdminVendorEvent = {
    id: number;
    type: 'note' | 'status' | string;
    body: string | null;
    from_status: string | null;
    to_status: string | null;
    author: string | null;
    created_at: string | null;
    vendor?: string | null;
    vendor_id?: number;
};

export type AdminVendorStats = AdminMemberStats & {
    pending_verification: number;
    store_verified: number;
    stores_active: number;
};

export type AdminVendorList = {
    vendors: AdminVendor[];
    meta: AdminMemberList['meta'];
    stats: AdminVendorStats;
    statuses: MemberStatus[];
    store_statuses: StoreStatus[];
};

export type VendorListQuery = {
    search?: string;
    status?: MemberStatus | '';
    store_status?: StoreStatus | '';
    verification?: 'verified' | 'pending' | 'unverified' | '';
    registered_from?: string;
    registered_to?: string;
    sort?: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'recently-active';
    per_page?: number;
    page?: number;
};

export type ProductStatus = 'draft' | 'pending' | 'published' | 'hidden' | 'rejected' | 'archived';
export type ProductType = 'physical' | 'digital' | 'service' | 'bundle' | 'custom';
export type ProductInventory = 'in_stock' | 'low_stock' | 'out_of_stock' | 'not_tracked';

export type AdminProductStore = {
    id: number;
    name: string;
    slug: string;
    status: StoreStatus;
    logo_url: string | null;
    vendor_id: number;
    vendor_name: string | null;
};

export type AdminProduct = {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    type: ProductType;
    status: ProductStatus;
    brand: string | null;
    tagline: string | null;
    price: number | null;
    compare_at_price: number | null;
    currency: string;
    track_inventory: boolean;
    stock_qty: number | null;
    inventory: ProductInventory;
    country: string | null;
    created_at: string | null;
    updated_at: string | null;
    published_at: string | null;
    duration_minutes: number | null;
    delivery_method: ServiceDelivery | null;
    booking_model: ServiceBooking | null;
    service_area: string | null;
    category: { id: number; name: string; slug: string } | null;
    store: AdminProductStore | null;
};

export type AdminProductDetail = AdminProduct & {
    description: string | null;
    low_stock_threshold: number | null;
    status_reason: string | null;
    status_changed_at: string | null;
    status_changed_by: string | null;
    completeness: { percent: number; completed: number; total: number; remaining: number; tasks: { key: string; done: boolean }[] };
    events: AdminProductEvent[];
};

export type AdminProductEvent = {
    id: number;
    type: 'note' | 'status' | string;
    body: string | null;
    from_status: string | null;
    to_status: string | null;
    author: string | null;
    created_at: string | null;
    product?: string | null;
    product_id?: number;
    vendor?: string | null;
    store?: string | null;
};

export type AdminProductStats = {
    total: number;
    new_this_month: number;
    out_of_stock: number;
    low_stock: number;
    draft: number;
    pending: number;
    published: number;
    hidden: number;
    rejected: number;
    archived: number;
};

export type AdminProductList = {
    products: AdminProduct[];
    meta: AdminMemberList['meta'];
    stats: AdminProductStats;
    statuses: ProductStatus[];
    types: ProductType[];
    categories: { id: number; name: string; slug: string }[];
    stores: { id: number; name: string; slug: string; vendor_id: number; vendor_name: string | null }[];
};

export type ProductListQuery = {
    search?: string;
    status?: ProductStatus | '';
    type?: ProductType | '';
    inventory?: ProductInventory | '';
    store_id?: number | '';
    category_id?: number | '';
    sort?: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'price-high' | 'price-low' | 'stock-low' | 'updated';
    per_page?: number;
    page?: number;
};

export type ServiceDelivery = 'on_site' | 'remote' | 'provider_location' | 'hybrid';
export type ServiceBooking = 'instant' | 'request' | 'quote' | 'none';

export type AdminServiceDetail = AdminProductDetail;
export type AdminServiceList = Omit<AdminProductList, 'products' | 'types'> & {
    services: AdminProduct[];
    types: ProductType[];
    delivery_methods: ServiceDelivery[];
    booking_models: ServiceBooking[];
};

export type ServiceListQuery = {
    search?: string;
    status?: ProductStatus | '';
    delivery_method?: ServiceDelivery | '';
    booking_model?: ServiceBooking | '';
    store_id?: number | '';
    category_id?: number | '';
    sort?: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'price-high' | 'price-low' | 'updated';
    per_page?: number;
    page?: number;
};

export type OrderType = 'product_order' | 'service_booking';
export type OrderStatus = 'new' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
export type OrderPayment = 'none' | 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
export type OrderFulfillment = 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'ready_for_pickup' | 'not_applicable';
export type OrderAppointment = 'scheduled' | 'assigned' | 'in_progress' | 'completed' | 'no_show' | 'not_applicable';

export type AdminOrder = {
    id: number;
    code: string;
    type: OrderType;
    status: OrderStatus;
    payment_status: OrderPayment;
    fulfillment_status: OrderFulfillment | null;
    appointment_status: OrderAppointment | null;
    item_name: string;
    item_count: number;
    total: number | null;
    currency: string;
    scheduled_at: string | null;
    needs_attention: boolean;
    created_at: string | null;
    updated_at: string | null;
    customer: { id: number; name: string; email: string } | null;
    store: {
        id: number;
        name: string;
        slug: string;
        logo_url: string | null;
        vendor_id: number;
        vendor_name: string | null;
    } | null;
    listing: { id: number; name: string; type: string; category: string | null } | null;
};

export type AdminOrderDetail = AdminOrder & {
    status_reason: string | null;
    status_changed_at: string | null;
    status_changed_by: string | null;
    events: AdminOrderEvent[];
};

export type AdminOrderEvent = {
    id: number;
    type: 'note' | 'status' | string;
    body: string | null;
    from_status: string | null;
    to_status: string | null;
    author: string | null;
    created_at: string | null;
    order?: string | null;
    order_id?: number;
    item?: string | null;
    customer?: string | null;
    vendor?: string | null;
    store?: string | null;
};

export type AdminOrderStats = {
    total: number;
    product_orders: number;
    service_bookings: number;
    new_this_month: number;
    attention: number;
    payment_failed: number;
    upcoming: number;
    new: number;
    confirmed: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    on_hold: number;
};

export type AdminOrderList = {
    orders: AdminOrder[];
    meta: AdminMemberList['meta'];
    stats: AdminOrderStats;
    types: OrderType[];
    statuses: OrderStatus[];
    payment_statuses: OrderPayment[];
    fulfillment_statuses: OrderFulfillment[];
    appointment_statuses: OrderAppointment[];
    categories: { id: number; name: string; slug: string }[];
    stores: { id: number; name: string; slug: string; vendor_id: number; vendor_name: string | null }[];
};

export type OrderListQuery = {
    search?: string;
    type?: OrderType | '';
    status?: OrderStatus | '';
    payment_status?: OrderPayment | '';
    fulfillment_status?: OrderFulfillment | '';
    appointment_status?: OrderAppointment | '';
    store_id?: number | '';
    category_id?: number | '';
    attention?: boolean | '';
    created_from?: string;
    created_to?: string;
    min_amount?: number | '';
    max_amount?: number | '';
    sort?: 'newest' | 'oldest' | 'amount-high' | 'amount-low' | 'updated';
    per_page?: number;
    page?: number;
};

export type DisputeType = 'order_dispute' | 'booking_dispute' | 'payment_dispute' | 'chargeback' | 'safety';
export type DisputeReason = 'not_received' | 'damaged' | 'unauthorized' | 'no_show' | 'unsatisfactory' | 'other';
export type DisputeStatus = 'new' | 'open' | 'awaiting_customer' | 'awaiting_vendor' | 'under_review' | 'escalated' | 'resolved' | 'closed';
export type DisputePriority = 'low' | 'normal' | 'high' | 'urgent' | 'critical';
export type DisputeOutcome = 'none' | 'customer' | 'vendor' | 'split' | 'dismissed';

export type AdminDispute = {
    id: number;
    code: string;
    type: DisputeType;
    reason: DisputeReason;
    status: DisputeStatus;
    priority: DisputePriority;
    outcome: DisputeOutcome;
    subject: string;
    amount: number | null;
    currency: string;
    due_at: string | null;
    is_overdue: boolean;
    needs_attention: boolean;
    created_at: string | null;
    updated_at: string | null;
    customer: { id: number; name: string; email: string } | null;
    store: {
        id: number;
        name: string;
        slug: string;
        logo_url: string | null;
        vendor_id: number;
        vendor_name: string | null;
    } | null;
    order: { id: number; code: string; type: string; item_name: string } | null;
    assignee: { id: number; name: string } | null;
};

export type AdminDisputeDetail = AdminDispute & {
    status_reason: string | null;
    status_changed_at: string | null;
    status_changed_by: string | null;
    events: AdminDisputeEvent[];
};

export type AdminDisputeEvent = {
    id: number;
    type: 'note' | 'status' | string;
    body: string | null;
    from_status: string | null;
    to_status: string | null;
    author: string | null;
    created_at: string | null;
    dispute?: string | null;
    dispute_id?: number;
    subject?: string | null;
    customer?: string | null;
    vendor?: string | null;
};

export type AdminDisputeStats = {
    total: number;
    new_this_month: number;
    resolved_this_month: number;
    overdue: number;
    attention: number;
    chargebacks: number;
    open_total: number;
    new: number;
    open: number;
    awaiting_customer: number;
    awaiting_vendor: number;
    under_review: number;
    escalated: number;
    resolved: number;
    closed: number;
};

export type AdminDisputeList = {
    disputes: AdminDispute[];
    meta: AdminMemberList['meta'];
    stats: AdminDisputeStats;
    types: DisputeType[];
    reasons: DisputeReason[];
    statuses: DisputeStatus[];
    priorities: DisputePriority[];
    outcomes: DisputeOutcome[];
    stores: { id: number; name: string; slug: string; vendor_id: number; vendor_name: string | null }[];
};

export type DisputeListQuery = {
    search?: string;
    type?: DisputeType | '';
    reason?: DisputeReason | '';
    status?: DisputeStatus | '';
    priority?: DisputePriority | '';
    outcome?: DisputeOutcome | '';
    store_id?: number | '';
    attention?: boolean | '';
    overdue?: boolean | '';
    unassigned?: boolean | '';
    created_from?: string;
    created_to?: string;
    min_amount?: number | '';
    max_amount?: number | '';
    sort?: 'newest' | 'oldest' | 'amount-high' | 'amount-low' | 'deadline' | 'updated';
    per_page?: number;
    page?: number;
};

export type FinancialType = 'payment' | 'payout' | 'refund' | 'commission' | 'fee' | 'tax' | 'chargeback' | 'adjustment';
export type FinancialDirection = 'inflow' | 'outflow';
export type FinancialStatus = 'pending' | 'posted' | 'failed' | 'on_hold' | 'reversed';

export type AdminFinancial = {
    id: number;
    code: string;
    type: FinancialType;
    direction: FinancialDirection;
    status: FinancialStatus;
    subject: string;
    amount: number;
    signed_amount: number;
    currency: string;
    needs_attention: boolean;
    created_at: string | null;
    updated_at: string | null;
    customer: { id: number; name: string; email: string } | null;
    store: {
        id: number;
        name: string;
        slug: string;
        logo_url: string | null;
        vendor_id: number;
        vendor_name: string | null;
    } | null;
    order: { id: number; code: string; type: string; item_name: string } | null;
};

export type AdminFinancialDetail = AdminFinancial & {
    status_reason: string | null;
    status_changed_at: string | null;
    status_changed_by: string | null;
    events: AdminFinancialEvent[];
};

export type AdminFinancialEvent = {
    id: number;
    type: 'note' | 'status' | string;
    body: string | null;
    from_status: string | null;
    to_status: string | null;
    author: string | null;
    created_at: string | null;
    entry?: string | null;
    entry_id?: number;
    subject?: string | null;
    vendor?: string | null;
};

export type AdminFinancialStats = {
    total: number;
    new_this_month: number;
    attention: number;
    inflow_total: number;
    outflow_total: number;
    net_total: number;
    payment: number;
    payout: number;
    refund: number;
    commission: number;
    fee: number;
    tax: number;
    chargeback: number;
    adjustment: number;
    payment_amount: number;
    payout_amount: number;
    refund_amount: number;
    commission_amount: number;
    fee_amount: number;
    tax_amount: number;
    chargeback_amount: number;
    adjustment_amount: number;
    pending: number;
    posted: number;
    failed: number;
    on_hold: number;
    reversed: number;
};

export type AdminFinancialList = {
    entries: AdminFinancial[];
    meta: AdminMemberList['meta'];
    stats: AdminFinancialStats;
    types: FinancialType[];
    statuses: FinancialStatus[];
    directions: FinancialDirection[];
    stores: { id: number; name: string; slug: string; vendor_id: number; vendor_name: string | null }[];
};

export type FinancialListQuery = {
    search?: string;
    type?: FinancialType | '';
    status?: FinancialStatus | '';
    direction?: FinancialDirection | '';
    store_id?: number | '';
    attention?: boolean | '';
    created_from?: string;
    created_to?: string;
    min_amount?: number | '';
    max_amount?: number | '';
    sort?: 'newest' | 'oldest' | 'amount-high' | 'amount-low' | 'updated';
    per_page?: number;
    page?: number;
};

export type AdminCategory = {
    id: number;
    code: string;
    name: string;
    slug: string;
    tone: string;
    position: number;
    is_active: boolean;
    parent_id: number | null;
    parent: { id: number; name: string; slug: string } | null;
    level: number;
    children_count: number;
    product_listings: number;
    service_listings: number;
    store_count: number;
    is_empty: boolean;
    created_at: string | null;
    updated_at: string | null;
};

export type AdminCategoryTree = AdminCategory & { children: AdminCategoryTree[] };

export type AdminCategoryDetail = AdminCategory & {
    spanish_name: string | null;
    children: { id: number; name: string; slug: string; is_active: boolean }[];
};

export type AdminCategoryStats = {
    total: number;
    active: number;
    inactive: number;
    roots: number;
    children: number;
    empty: number;
    product_listings: number;
    service_listings: number;
    stores: number;
};

export type AdminCategoryList = {
    categories: AdminCategory[];
    tree: AdminCategoryTree[];
    meta: AdminMemberList['meta'];
    stats: AdminCategoryStats;
    tones: string[];
    parents: { id: number; name: string; slug: string; parent_id: number | null }[];
};

export type CategoryListQuery = {
    search?: string;
    parent_id?: number | '';
    roots?: boolean | '';
    children?: boolean | '';
    active?: boolean | '';
    empty?: boolean | '';
    kind?: 'product' | 'service' | '';
    sort?: 'position' | 'name-asc' | 'name-desc' | 'newest' | 'oldest' | 'updated';
    per_page?: number;
    page?: number;
};

export type CategoryPayload = {
    name?: string;
    slug?: string;
    tone?: string;
    position?: number;
    is_active?: boolean;
    parent_id?: number | null;
};

export type ContentType =
    | 'nav-links'
    | 'policy-types'
    | 'setting-definitions'
    | 'social-platforms'
    | 'notification-topics'
    | 'notification-channels'
    | 'categories';

export type AdminContentItem = {
    id: number;
    type: ContentType;
    code: string;
    title: string;
    identifier: string;
    hint: string | null;
    group: string | null;
    context: string | null;
    tone: string | null;
    position: number;
    is_active: boolean;
    can_toggle: boolean;
    translation: { locale: string; done: number; total: number; incomplete: number; percent: number };
    created_at: string | null;
    updated_at: string | null;
};

export type AdminContentTree = {
    context: string;
    groups: { name: string; items: { id: number; title: string; is_active: boolean }[] }[];
};

export type AdminContentStats = {
    total: number;
    navigation: number;
    policies: number;
    settings: number;
    social: number;
    notifications: number;
    categories: number;
    active: number;
    inactive: number;
    translated_fields: number;
    missing_fields: number;
};

export type AdminContentList = {
    items: AdminContentItem[];
    tree: AdminContentTree[];
    meta: AdminMemberList['meta'];
    stats: AdminContentStats;
    types: ContentType[];
};

export type ContentTypeFilter = ContentType | 'notifications';

export type ContentListQuery = {
    search?: string;
    type?: ContentTypeFilter | '';
    active?: boolean | '';
    translation?: 'complete' | 'incomplete' | '';
    sort?: 'position' | 'name-asc' | 'name-desc' | 'newest' | 'updated';
    per_page?: number;
    page?: number;
};

export type CommissionStoredStatus = 'draft' | 'active' | 'scheduled' | 'disabled';
export type CommissionStatus = CommissionStoredStatus | 'expired';
export type CommissionCalc = 'percentage' | 'fixed' | 'percentage_plus_fixed';
export type CommissionScope = 'all_vendors' | 'selected_vendors' | 'products' | 'services' | 'categories';
export type CommissionTreatment = 'exclude' | 'include';
export type CommissionDiscount = 'after' | 'before';
export type CommissionRefund = 'proportional' | 'full' | 'retain' | 'manual';

export type AdminCommission = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    status: CommissionStoredStatus;
    effective_status: CommissionStatus;
    calculation_type: CommissionCalc;
    percentage_rate: number | null;
    fixed_amount: number | null;
    rate_label: string;
    applies_to: CommissionScope;
    priority: number;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    category: { id: number; name: string; slug: string } | null;
    store: { id: number; name: string; slug: string; vendor_id: number; vendor_name: string | null } | null;
};

export type AdminCommissionEvent = {
    id: number;
    type: 'note' | 'status' | 'created' | 'updated' | string;
    body: string | null;
    from_status: string | null;
    to_status: string | null;
    author: string | null;
    created_at: string | null;
    rule?: string | null;
    rule_id?: number;
    subject?: string | null;
    vendor?: string | null;
};

export type AdminCommissionDetail = AdminCommission & {
    min_commission: number | null;
    max_commission: number | null;
    min_order_value: number | null;
    max_order_value: number | null;
    tax_treatment: CommissionTreatment;
    shipping_treatment: CommissionTreatment;
    discount_treatment: CommissionDiscount;
    refund_treatment: CommissionRefund;
    notes: string | null;
    events: AdminCommissionEvent[];
};

export type CommissionSettings = {
    global_rate: number | null;
    product_rate: number | null;
    service_rate: number | null;
    fixed_fee: number | null;
    min_commission: number | null;
    max_commission: number | null;
    tax_treatment: CommissionTreatment;
    discount_treatment: CommissionDiscount;
    reserve_days: number | null;
    rounding: 'half_up' | 'down' | 'bankers';
    currency: 'USD' | 'CAD';
    include_shipping: boolean;
    include_taxes: boolean;
    auto_refund_reversal: boolean;
    allow_negative_balances: boolean;
    approve_adjustments: boolean;
    updated_at?: string | null;
};

export type AdminCommissionEntry = {
    id: number;
    code: string;
    status: FinancialStatus;
    subject: string;
    amount: number;
    currency: string;
    created_at: string | null;
    customer: { id: number; name: string } | null;
    store: { id: number; name: string; vendor_name: string | null } | null;
    order: { id: number; code: string; type: string; item_name: string } | null;
};

export type AdminCommissionStats = {
    total: number;
    new_this_month: number;
    draft: number;
    active: number;
    scheduled: number;
    disabled: number;
    expired: number;
    attention: number;
    all_vendors: number;
    selected_vendors: number;
    products: number;
    services: number;
    categories: number;
    average_rate: number | null;
    commission_entries: number;
    commission_amount: number;
};

export type AdminCommissionList = {
    rules: AdminCommission[];
    meta: AdminMemberList['meta'];
    stats: AdminCommissionStats;
    settings: CommissionSettings;
    entries: AdminCommissionEntry[];
    statuses: CommissionStatus[];
    calculation_types: CommissionCalc[];
    applies_to: CommissionScope[];
    categories: { id: number; name: string; slug: string; parent_id: number | null }[];
    stores: { id: number; name: string; slug: string; vendor_id: number; vendor_name: string | null }[];
};

export type CommissionListQuery = {
    search?: string;
    status?: CommissionStatus | '';
    calculation_type?: CommissionCalc | '';
    applies_to?: CommissionScope | '';
    category_id?: number | '';
    store_id?: number | '';
    attention?: boolean | '';
    sort?: 'priority' | 'name-asc' | 'name-desc' | 'newest' | 'oldest' | 'updated' | 'rate-high' | 'rate-low';
    per_page?: number;
    page?: number;
};

export type CommissionPayload = {
    name?: string;
    description?: string | null;
    status?: CommissionStoredStatus;
    calculation_type?: CommissionCalc;
    percentage_rate?: number | null;
    fixed_amount?: number | null;
    min_commission?: number | null;
    max_commission?: number | null;
    applies_to?: CommissionScope;
    category_id?: number | null;
    store_id?: number | null;
    priority?: number;
    starts_at?: string | null;
    ends_at?: string | null;
    min_order_value?: number | null;
    max_order_value?: number | null;
    tax_treatment?: CommissionTreatment;
    shipping_treatment?: CommissionTreatment;
    discount_treatment?: CommissionDiscount;
    refund_treatment?: CommissionRefund;
    notes?: string | null;
};

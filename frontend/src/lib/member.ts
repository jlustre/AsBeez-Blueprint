import { apiRequest } from './api';

export type MemberAccount = {
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    member_since: string | null;
};

export type MemberPersonal = {
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    display_name: string | null;
    username: string | null;
    birth_date: string | null;
    gender: string | null;
    pronouns: string | null;
    occupation: string | null;
    company: string | null;
    website: string | null;
    bio: string | null;
    phone: string | null;
    language: string;
    timezone: string;
};

export type MemberPublicProfile = {
    is_public: boolean;
    show_activity: boolean;
    show_reviews: boolean;
    allow_vendor_contact: boolean;
    avatar_url: string | null;
    initials: string;
    public_name: string;
};

export type MemberAddress = {
    id: number;
    label: string;
    recipient: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string | null;
    state_name: string | null;
    postal_code: string | null;
    country: string;
    country_name: string;
    phone: string | null;
    is_default_shipping: boolean;
    is_default_billing: boolean;
};

export type NotificationChannel = {
    key: string;
    label: string;
    /** False when the member has no contact detail for this channel. */
    available: boolean;
};

export type NotificationTopic = {
    key: string;
    label: string;
    group: string;
    is_mandatory: boolean;
    channels: Record<string, boolean>;
};

export type MemberCompletenessTask = {
    key: string;
    label: string;
    done: boolean;
    cta: string;
    href: string;
};

export type MemberCompleteness = {
    percent: number;
    completed: number;
    total: number;
    remaining: number;
    tasks: MemberCompletenessTask[];
};

export type MemberProfile = {
    id: number;
    account: MemberAccount;
    personal: MemberPersonal;
    public_profile: MemberPublicProfile;
    preferences: { favorite_business: string | null; shopping_radius_km: number | null };
    interests: { id: number; name: string; slug: string; tone: string }[];
    addresses: MemberAddress[];
    notifications: { channels: NotificationChannel[]; topics: NotificationTopic[] };
    completeness: MemberCompleteness;
};

export type MemberProfilePatch = Partial<
    MemberPersonal & Omit<MemberPublicProfile, 'avatar_url' | 'initials' | 'public_name'> & {
        favorite_business: string | null;
        shopping_radius_km: number | null;
    }
>;

export type AddressInput = {
    label: string;
    recipient: string;
    line1: string;
    line2?: string | null;
    city: string;
    state?: string | null;
    postal_code?: string | null;
    country: string;
    phone?: string | null;
    is_default_shipping?: boolean;
    is_default_billing?: boolean;
};

export type PublicMember = {
    username: string;
    name: string;
    initials: string;
    avatar_url: string | null;
    bio: string | null;
    occupation: string | null;
    website: string | null;
    pronouns: string | null;
    verified: boolean;
    member_since: string | null;
    interests: { id: number; name: string; slug: string; tone: string }[];
    show_activity: boolean;
    show_reviews: boolean;
    allow_vendor_contact: boolean;
};

export const memberApi = {
    async get() {
        return (await apiRequest<{ profile: MemberProfile }>('/member/profile', {}, true)).profile;
    },

    async update(patch: MemberProfilePatch) {
        return (await apiRequest<{ profile: MemberProfile }>('/member/profile', {
            method: 'PUT',
            body: JSON.stringify(patch),
        }, true)).profile;
    },

    async saveInterests(categoryIds: number[]) {
        return (await apiRequest<{ profile: MemberProfile }>('/member/profile/interests', {
            method: 'PUT',
            body: JSON.stringify({ category_ids: categoryIds }),
        }, true)).profile;
    },

    async saveNotifications(preferences: Record<string, Record<string, boolean>>) {
        return (await apiRequest<{ profile: MemberProfile }>('/member/profile/notifications', {
            method: 'PUT',
            body: JSON.stringify({ preferences }),
        }, true)).profile;
    },

    async uploadAvatar(file: File) {
        const body = new FormData();
        body.append('file', file);

        return (await apiRequest<{ profile: MemberProfile }>('/member/profile/avatar', {
            method: 'POST',
            body,
        }, true)).profile;
    },

    async removeAvatar() {
        return (await apiRequest<{ profile: MemberProfile }>('/member/profile/avatar', {
            method: 'DELETE',
        }, true)).profile;
    },

    async addAddress(input: AddressInput) {
        return (await apiRequest<{ profile: MemberProfile }>('/member/addresses', {
            method: 'POST',
            body: JSON.stringify(input),
        }, true)).profile;
    },

    async updateAddress(id: number, input: Partial<AddressInput>) {
        return (await apiRequest<{ profile: MemberProfile }>(`/member/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        }, true)).profile;
    },

    async deleteAddress(id: number) {
        return (await apiRequest<{ profile: MemberProfile }>(`/member/addresses/${id}`, {
            method: 'DELETE',
        }, true)).profile;
    },

    async makeAddressDefault(id: number, kind: 'shipping' | 'billing') {
        return (await apiRequest<{ profile: MemberProfile }>(`/member/addresses/${id}/default`, {
            method: 'PUT',
            body: JSON.stringify({ kind }),
        }, true)).profile;
    },
};

export const publicMemberApi = {
    async get(username: string) {
        return await apiRequest<{ member: PublicMember; preview: boolean }>(
            `/members/${encodeURIComponent(username)}`,
            {},
            true,
        );
    },
};

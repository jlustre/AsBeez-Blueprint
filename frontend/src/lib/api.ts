export type UserRole = 'super-admin' | 'vendor' | 'member';

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    email_verified_at: string | null;
    /** Null until the member uploads one; shells fall back to `initials`. */
    avatar_url: string | null;
    initials: string;
};

type AuthResponse = {
    user: User;
    token: string;
};

export type FieldErrors = Record<string, string[]>;

/**
 * Carries Laravel's 422 payload so forms can put messages next to the field
 * that caused them instead of dumping everything into one banner.
 */
export class ApiError extends Error {
    readonly status: number;
    readonly errors: FieldErrors;

    constructor(message: string, status: number, errors: FieldErrors = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }

    /** First message recorded against a field, if any. */
    fieldError(field: string): string | undefined {
        return this.errors[field]?.[0];
    }
}

import { getActiveLocale } from '../i18n';

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '');
const tokenKey = 'asbeez_auth_token';

export function getToken(): string | null {
    try {
        return window.localStorage.getItem(tokenKey);
    } catch {
        return null;
    }
}

function setToken(token: string): void {
    try {
        window.localStorage.setItem(tokenKey, token);
    } catch {
        // Private browsing with storage blocked: the session simply won't survive a reload.
    }
}

function clearToken(): void {
    try {
        window.localStorage.removeItem(tokenKey);
    } catch {
        // Nothing to clean up if storage was unavailable in the first place.
    }
}

/**
 * Shared fetch wrapper. Exported as `apiRequest` so feature modules (store,
 * admin, …) reuse the same auth header, error shape and 401 handling instead
 * of each rolling their own.
 */
export async function apiRequest<T>(path: string, options: RequestInit = {}, authenticated = false): Promise<T> {
    const headers = new Headers(options.headers);

    headers.set('Accept', 'application/json');

    // Validation errors and server messages come back in this language.
    headers.set('Accept-Language', getActiveLocale());

    // FormData must set its own multipart Content-Type, boundary included —
    // forcing application/json here would corrupt every upload.
    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    if (authenticated) {
        const token = getToken();

        if (!token) {
            throw new ApiError('You need to sign in to continue.', 401);
        }

        headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;

    try {
        response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });
    } catch {
        throw new ApiError('Could not reach the AsBeez server. Check your connection and try again.', 0);
    }

    const payload = response.status === 204 ? null : await response.json().catch(() => null);

    if (!response.ok) {
        // An expired or revoked token should not leave a dead credential behind.
        if (response.status === 401 && authenticated) {
            clearToken();
        }

        throw new ApiError(
            payload?.message ?? 'The request could not be completed.',
            response.status,
            payload?.errors ?? {},
        );
    }

    return payload as T;
}

const request = apiRequest;

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: UserRole;
};

export type ResetPasswordInput = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type ChangePasswordInput = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export const authApi = {
    async register(input: RegisterInput) {
        const response = await request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ ...input, device_name: 'frontend' }),
        });
        setToken(response.token);
        return response.user;
    },

    async login(input: { email: string; password: string }) {
        const response = await request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ ...input, device_name: 'frontend' }),
        });
        setToken(response.token);
        return response.user;
    },

    async me() {
        return (await request<{ user: User }>('/auth/me', {}, true)).user;
    },

    async logout() {
        try {
            await request('/auth/logout', { method: 'POST' }, true);
        } finally {
            clearToken();
        }
    },

    async logoutAll() {
        try {
            await request('/auth/logout-all', { method: 'POST' }, true);
        } finally {
            clearToken();
        }
    },

    async forgotPassword(email: string) {
        return await request<{ message: string }>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async resetPassword(input: ResetPasswordInput) {
        return await request<{ message: string }>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },

    async changePassword(input: ChangePasswordInput) {
        return await request<{ message: string }>('/auth/password', {
            method: 'PUT',
            body: JSON.stringify(input),
        }, true);
    },

    async resendVerification() {
        return await request<{ message: string }>('/auth/email/verification-notification', {
            method: 'POST',
        }, true);
    },

    async verificationStatus() {
        return await request<{ verified: boolean; verification_url: string | null }>('/auth/email/status', {}, true);
    },
};

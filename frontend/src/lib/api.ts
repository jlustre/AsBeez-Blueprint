export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
};

type AuthResponse = {
    user: User;
    token: string;
};

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '');
const tokenKey = 'asbeez_auth_token';

async function request<T>(path: string, options: RequestInit = {}, authenticated = false): Promise<T> {
    const token = window.localStorage.getItem(tokenKey);
    const headers = new Headers(options.headers);

    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    if (authenticated && token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const message = payload?.message ?? 'The request could not be completed.';
        throw new Error(message);
    }

    return payload as T;
}

export const authApi = {
    async register(input: { name: string; email: string; password: string; password_confirmation: string }) {
        const response = await request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ ...input, device_name: 'frontend' }),
        });
        window.localStorage.setItem(tokenKey, response.token);
        return response.user;
    },

    async login(input: { email: string; password: string }) {
        const response = await request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ ...input, device_name: 'frontend' }),
        });
        window.localStorage.setItem(tokenKey, response.token);
        return response.user;
    },

    async me() {
        return (await request<{ user: User }>('/auth/me', {}, true)).user;
    },

    async logout() {
        try {
            await request('/auth/logout', { method: 'POST' }, true);
        } finally {
            window.localStorage.removeItem(tokenKey);
        }
    },
};

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import {
    authApi,
    getToken,
    type ChangePasswordInput,
    type RegisterInput,
    type ResetPasswordInput,
    type User,
    type UserRole,
} from '../lib/api';

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (input: RegisterInput) => Promise<User>;
    logout: () => Promise<void>;
    logoutAll: () => Promise<void>;
    forgotPassword: (email: string) => Promise<string>;
    resetPassword: (input: ResetPasswordInput) => Promise<string>;
    changePassword: (input: ChangePasswordInput) => Promise<string>;
    resendVerification: () => Promise<string>;
    refresh: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Where each role belongs once it is signed in. */
export function dashboardHashFor(role: UserRole): string {
    if (role === 'super-admin') {
        return '#admin-dashboard';
    }

    if (role === 'vendor') {
        return '#vendor-dashboard';
    }

    return '#member-dashboard';
}

/**
 * Where a visitor was headed when a gate sent them to sign in.
 *
 * Lives here because `enter()` is what consumes it: any route may set it, but
 * exactly one place gets to decide what happens after a successful sign in.
 */
export const RETURN_HASH_KEY = 'asbeez_return_hash';

/** Remembers the intended destination before bouncing someone to sign in. */
export function rememberReturnHash(hash: string = window.location.hash): void {
    try {
        window.sessionStorage.setItem(RETURN_HASH_KEY, hash);
    } catch {
        // Storage blocked. Signing in still works; it just lands on the
        // dashboard instead of coming back here.
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        // No stored token means no session to restore — skip the guaranteed 401.
        if (!getToken()) {
            setUser(null);
            return null;
        }

        try {
            const currentUser = await authApi.me();
            setUser(currentUser);
            return currentUser;
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        refresh().finally(() => setLoading(false));
    }, [refresh]);

    function enter(authenticatedUser: User) {
        setUser(authenticatedUser);

        try {
            const pending = window.sessionStorage.getItem(RETURN_HASH_KEY);

            if (pending) {
                window.sessionStorage.removeItem(RETURN_HASH_KEY);
                window.location.hash = pending;
                return authenticatedUser;
            }
        } catch {
            // Storage blocked; fall through to the role dashboard.
        }

        window.location.hash = dashboardHashFor(authenticatedUser.role);
        return authenticatedUser;
    }

    async function login(email: string, password: string) {
        return enter(await authApi.login({ email, password }));
    }

    async function register(input: RegisterInput) {
        return enter(await authApi.register(input));
    }

    async function logout() {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
            window.location.hash = '';
        }
    }

    async function logoutAll() {
        try {
            await authApi.logoutAll();
        } finally {
            setUser(null);
            window.location.hash = '';
        }
    }

    async function forgotPassword(email: string) {
        return (await authApi.forgotPassword(email)).message;
    }

    async function resetPassword(input: ResetPasswordInput) {
        const { message } = await authApi.resetPassword(input);
        // Every token was revoked server side, so drop any local session too.
        setUser(null);
        return message;
    }

    async function changePassword(input: ChangePasswordInput) {
        return (await authApi.changePassword(input)).message;
    }

    async function resendVerification() {
        return (await authApi.resendVerification()).message;
    }

    const value: AuthContextValue = {
        user,
        loading,
        login,
        register,
        logout,
        logoutAll,
        forgotPassword,
        resetPassword,
        changePassword,
        resendVerification,
        refresh,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}

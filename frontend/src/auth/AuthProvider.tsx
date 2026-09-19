import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { authApi, type User } from '../lib/api';

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (input: { name: string; email: string; password: string; password_confirmation: string }) => Promise<User>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authApi.me()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const authenticatedUser = await authApi.login({ email, password });
        setUser(authenticatedUser);
        window.location.hash = '#member-dashboard';
        return authenticatedUser;
    }

    async function register(input: { name: string; email: string; password: string; password_confirmation: string }) {
        const authenticatedUser = await authApi.register(input);
        setUser(authenticatedUser);
        window.location.hash = '#member-dashboard';
        return authenticatedUser;
    }

    async function logout() {
        await authApi.logout();
        setUser(null);
        window.location.hash = '';
    }

    return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}

import Alpine from 'alpinejs';
import React, { useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

import './bootstrap';
import { AuthProvider, dashboardHashFor, useAuth } from './auth/AuthProvider';
import {
    AccessDeniedPage,
    AccountSecurityPage,
    EmailVerifiedPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    SignInPage,
    SignUpPage,
    VerifyEmailBanner,
} from './components/auth/AuthPages';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { StorefrontPage } from './components/storefront/StorefrontPage';
import { HomePage } from './components/home/HomePage';
import { MemberDashboardPage } from './components/member/MemberDashboardPage';
import { VendorDashboardPage } from './components/vendor/VendorDashboardPage';
import type { UserRole } from './lib/api';
import './styles/app.css';

const alpineWindow = window as typeof window & { Alpine: typeof Alpine };

alpineWindow.Alpine = Alpine;
Alpine.start();

type ReactMountElement = HTMLElement & {
    dataset: DOMStringMap & {
        component?: string;
    };
};

/** Routes anyone may open, signed in or not. */
const publicRoutes: Record<string, ComponentType> = {
    // A storefront is public; the API decides whether an unpublished one is
    // visible to this particular caller.
    '#storefront': StorefrontPage,
    '#signin': SignInPage,
    '#signup': SignUpPage,
    '#forgot-password': ForgotPasswordPage,
    '#reset-password': ResetPasswordPage,
    '#email-verified': EmailVerifiedPage,
};

/** Dashboards, and which roles may open each one. */
const dashboardRoutes: Record<string, { component: ComponentType; roles: UserRole[] }> = {
    '#admin-dashboard': { component: AdminDashboardPage, roles: ['super-admin'] },
    '#vendor-dashboard': { component: VendorDashboardPage, roles: ['super-admin', 'vendor'] },
    // Same shell as the vendor dashboard; it swaps its own main content on this hash.
    '#store-profile': { component: VendorDashboardPage, roles: ['super-admin', 'vendor'] },
    '#member-dashboard': { component: MemberDashboardPage, roles: ['super-admin', 'vendor', 'member'] },
};

/** Mount points can name a starting route via data-component. */
const componentRoutes: Record<string, string> = {
    'admin-dashboard': '#admin-dashboard',
    'member-dashboard': '#member-dashboard',
    'vendor-dashboard': '#vendor-dashboard',
};

function useRouteHash(fallback: string) {
    const [routeHash, setRouteHash] = useState(() => window.location.hash || fallback);

    useEffect(() => {
        const onHashChange = () => setRouteHash(window.location.hash || fallback);
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [fallback]);

    return routeHash;
}

function ReactMount({ element }: { element: ReactMountElement }) {
    const { user, loading } = useAuth();
    const component = element.dataset.component ?? 'home';
    const routeHash = useRouteHash(componentRoutes[component] ?? '');

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-cream text-charcoal">Loading your workspace…</div>;
    }

    const PublicRoute = publicRoutes[routeHash];

    if (PublicRoute) {
        // Someone already signed in has no use for the sign-in or sign-up screens.
        if (user && (routeHash === '#signin' || routeHash === '#signup')) {
            return <Dashboard role={user.role} />;
        }

        return <PublicRoute />;
    }

    if (routeHash === '#account-security') {
        return <AccountSecurityPage />;
    }

    // Explicit way back to the storefront from inside a dashboard. Naming the
    // route beats relying on the empty-hash default, which a mount carrying
    // data-component="…-dashboard" would send straight back to that dashboard.
    if (routeHash === '#marketplace') {
        return <Chrome><HomePage /></Chrome>;
    }

    const dashboard = dashboardRoutes[routeHash];

    if (dashboard) {
        if (!user) {
            return <SignInPage />;
        }

        if (!dashboard.roles.includes(user.role)) {
            return <AccessDeniedPage />;
        }

        const DashboardView = dashboard.component;

        return <Chrome><DashboardView /></Chrome>;
    }

    if (component === 'home' || component === 'platform-shell') {
        return <Chrome><HomePage /></Chrome>;
    }

    return <div data-react-component={component} data-react-scaffold="true" />;
}

function Dashboard({ role }: { role: UserRole }) {
    const { component: DashboardView } = dashboardRoutes[dashboardHashFor(role)];

    return <Chrome><DashboardView /></Chrome>;
}

/** Wraps a signed-in view with the account-wide notices that sit above it. */
function Chrome({ children }: { children: React.ReactNode }) {
    return <>
        <VerifyEmailBanner />
        {children}
    </>;
}

const mount = document.querySelector<ReactMountElement>('[data-react-root], #root');

if (mount) {
    createRoot(mount).render(
        <React.StrictMode>
            <AuthProvider>
                <ReactMount element={mount} />
            </AuthProvider>
        </React.StrictMode>,
    );
}

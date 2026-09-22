import Alpine from 'alpinejs';
import React, { useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

import './bootstrap';
import { AuthProvider, dashboardHashFor, rememberReturnHash, useAuth } from './auth/AuthProvider';
import { I18nProvider, useTranslation } from './i18n';
import { PageLoader } from './components/ui/Spinner';
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
import { MembersManagementPage } from './components/admin/MembersManagementPage';
import { VendorsManagementPage } from './components/admin/VendorsManagementPage';
import { ProductsManagementPage } from './components/admin/ProductsManagementPage';
import { ServicesManagementPage } from './components/admin/ServicesManagementPage';
import { OrdersManagementPage } from './components/admin/OrdersManagementPage';
import { DisputesManagementPage } from './components/admin/DisputesManagementPage';
import { FinancialsManagementPage } from './components/admin/FinancialsManagementPage';
import { CategoriesManagementPage } from './components/admin/CategoriesManagementPage';
import { ContentManagementPage } from './components/admin/ContentManagementPage';
import { CommissionManagementPage } from './components/admin/CommissionManagementPage';
import { PpfManagementPage } from './components/admin/PpfManagementPage';
import { TranslationsPage } from './components/admin/TranslationsPage';
import { StorefrontPage } from './components/storefront/StorefrontPage';
import { HomePage } from './components/home/HomePage';
import { HowItWorksPage } from './components/guide/HowItWorksPage';
import { SellOnAsBeezPage } from './components/sell/SellOnAsBeezPage';
import { MemberDashboardPage } from './components/member/MemberDashboardPage';
import { MemberProfilePage } from './components/member/MemberProfilePage';
import { RewardPointsPage } from './components/member/RewardPointsPage';
import { PublicMemberPage } from './components/member/PublicMemberPage';
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
    '#member': PublicMemberPage,
    '#signin': SignInPage,
    '#signup': SignUpPage,
    '#forgot-password': ForgotPasswordPage,
    '#reset-password': ResetPasswordPage,
    '#email-verified': EmailVerifiedPage,
};

/**
 * Puts a route behind sign-in, remembering where the visitor was headed.
 *
 * Signing in and registering both end in AuthProvider's `enter()`, which
 * consumes the remembered hash — so either form brings the visitor back here
 * rather than dropping them on their dashboard, and a deep link such as
 * `#sell-on-asbeez/step-3` returns to the step they asked for.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    // An effect, not a render-time write: rendering must stay side-effect free.
    useEffect(() => {
        if (!user) {
            rememberReturnHash();
        }
    }, [user]);

    return user ? <>{children}</> : <SignInPage />;
}

/**
 * The member profile lives inside the member shell, so it keeps the sidebar
 * and top bar rather than opening as a bare page. The vendor side reaches the
 * same result differently: its shell has no content slot, so it swaps its own
 * main content on the `#store-profile` hash.
 */
function MemberProfileRoute() {
    return <MemberDashboardPage mainContent={<MemberProfilePage />} />;
}

function MemberRewardsRoute() {
    return <MemberDashboardPage mainContent={<RewardPointsPage />} />;
}

function AdminMembersRoute() {
    return <AdminDashboardPage mainContent={<MembersManagementPage />} />;
}

function AdminVendorsRoute() {
    return <AdminDashboardPage mainContent={<VendorsManagementPage />} />;
}

function AdminProductsRoute() {
    return <AdminDashboardPage mainContent={<ProductsManagementPage />} />;
}

function AdminServicesRoute() {
    return <AdminDashboardPage mainContent={<ServicesManagementPage />} />;
}

function AdminOrdersRoute() {
    return <AdminDashboardPage mainContent={<OrdersManagementPage />} />;
}

function AdminDisputesRoute() {
    return <AdminDashboardPage mainContent={<DisputesManagementPage />} />;
}

function AdminFinancialsRoute() {
    return <AdminDashboardPage mainContent={<FinancialsManagementPage />} />;
}

function AdminCategoriesRoute() {
    return <AdminDashboardPage mainContent={<CategoriesManagementPage />} />;
}

function AdminContentRoute() {
    return <AdminDashboardPage mainContent={<ContentManagementPage />} />;
}

function AdminCommissionsRoute() {
    return <AdminDashboardPage mainContent={<CommissionManagementPage />} />;
}

function AdminPpfRoute() {
    return <AdminDashboardPage mainContent={<PpfManagementPage />} />;
}

/** Dashboards, and which roles may open each one. */
const dashboardRoutes: Record<string, { component: ComponentType; roles: UserRole[] }> = {
    '#admin-dashboard': { component: AdminDashboardPage, roles: ['super-admin'] },
    '#admin-members': { component: AdminMembersRoute, roles: ['super-admin'] },
    '#admin-vendors': { component: AdminVendorsRoute, roles: ['super-admin'] },
    '#admin-products': { component: AdminProductsRoute, roles: ['super-admin'] },
    '#admin-services': { component: AdminServicesRoute, roles: ['super-admin'] },
    '#admin-orders': { component: AdminOrdersRoute, roles: ['super-admin'] },
    '#admin-disputes': { component: AdminDisputesRoute, roles: ['super-admin'] },
    '#admin-financials': { component: AdminFinancialsRoute, roles: ['super-admin'] },
    '#admin-categories': { component: AdminCategoriesRoute, roles: ['super-admin'] },
    '#admin-content': { component: AdminContentRoute, roles: ['super-admin'] },
    '#admin-commissions': { component: AdminCommissionsRoute, roles: ['super-admin'] },
    '#admin-ppf': { component: AdminPpfRoute, roles: ['super-admin'] },
    '#vendor-dashboard': { component: VendorDashboardPage, roles: ['super-admin', 'vendor'] },
    // Same shell as the vendor dashboard; it swaps its own main content on this hash.
    '#store-profile': { component: VendorDashboardPage, roles: ['super-admin', 'vendor'] },
    // Likewise: what a partner pays is a seller screen, so it renders inside
    // the vendor shell rather than as a standalone marketing page.
    '#platform-fees': { component: VendorDashboardPage, roles: ['super-admin', 'vendor'] },
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
    const { t } = useTranslation();
    const { user, loading } = useAuth();
    const component = element.dataset.component ?? 'home';
    const routeHash = useRouteHash(componentRoutes[component] ?? '');

    if (loading) {
        return <PageLoader full label={t('common.loadingWorkspace')} />;
    }

    if (routeHash === '#how-it-works' || routeHash.startsWith('#how-it-works/')) {
        return <HowItWorksPage />;
    }

    // Becoming a seller is an application against an account, so the form is
    // never shown to an anonymous visitor: there would be nothing to save it
    // to, and twelve steps of typing would be lost at the first save.
    if (routeHash === '#sell-on-asbeez' || routeHash.startsWith('#sell-on-asbeez/')) {
        return <RequireAuth><SellOnAsBeezPage /></RequireAuth>;
    }

    const PublicRoute = publicRoutes[routeHash];

    if (PublicRoute) {
        // Someone already signed in has no use for the sign-in or sign-up screens.
        if (user && (routeHash === '#signin' || routeHash === '#signup')) {
            return <Dashboard role={user.role} />;
        }

        return <PublicRoute />;
    }

    // Reward points belong to an account rather than a role, so like the
    // profile above they are open to anyone signed in.
    if (routeHash === '#member-rewards' || routeHash.startsWith('#member-rewards/')) {
        return user ? <Chrome><MemberRewardsRoute /></Chrome> : <SignInPage />;
    }

    // Any signed-in account has a member profile, so this is not role-gated —
    // hence an early return rather than an entry in dashboardRoutes, which
    // would have to name every role and be revisited when one is added.
    if (routeHash === '#member-profile') {
        return user ? <Chrome><MemberProfileRoute /></Chrome> : <SignInPage />;
    }

    // Admin-only: the API enforces the same, this just avoids a dead screen.
    if (routeHash === '#admin-translations') {
        if (!user) {
            return <SignInPage />;
        }

        return user.role === 'super-admin'
            ? <Chrome><TranslationsPage /></Chrome>
            : <AccessDeniedPage />;
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

    // `#platform-fees/estimator` is the same screen as `#platform-fees`: what
    // follows the slash is an in-page section the view scrolls to itself. No
    // dashboard hash contains a slash, so trimming one is safe here.
    const dashboard = dashboardRoutes[routeHash.split('/')[0]];

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
            <I18nProvider>
                <AuthProvider>
                    <ReactMount element={mount} />
                </AuthProvider>
            </I18nProvider>
        </React.StrictMode>,
    );
}

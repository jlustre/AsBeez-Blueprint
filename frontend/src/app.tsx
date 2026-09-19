import Alpine from 'alpinejs';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './bootstrap';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { HomePage } from './components/home/HomePage';
import { MemberDashboardPage } from './components/member/MemberDashboardPage';
import { VendorDashboardPage } from './components/vendor/VendorDashboardPage';
import './styles/app.css';

const alpineWindow = window as typeof window & { Alpine: typeof Alpine };

alpineWindow.Alpine = Alpine;
Alpine.start();

type ReactMountElement = HTMLElement & {
    dataset: DOMStringMap & {
        component?: string;
    };
};

function ReactMount({ element }: { element: ReactMountElement }) {
    const { user, loading } = useAuth();
    const component = element.dataset.component ?? 'home';
    const [routeHash, setRouteHash] = useState(window.location.hash);

    useEffect(() => {
        const onHashChange = () => setRouteHash(window.location.hash);
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const routeAdmin = routeHash === '#admin-dashboard' || component === 'admin-dashboard';
    const routeMember = routeHash === '#member-dashboard' || component === 'member-dashboard';
    const routeVendor = routeHash === '#vendor-dashboard' || component === 'vendor-dashboard';

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-cream text-charcoal">Loading your workspace…</div>;
    }

    if (routeAdmin) {
        return <AdminDashboardPage />;
    }

    if (routeVendor) {
        return <VendorDashboardPage />;
    }

    if (user && routeMember) {
        return <MemberDashboardPage />;
    }

    if (user) {
        return <MemberDashboardPage />;
    }

    if (component === 'home' || component === 'platform-shell') {
        return <HomePage />;
    }

    return <div data-react-component={component} data-react-scaffold="true" />;
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

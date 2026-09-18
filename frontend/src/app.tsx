import Alpine from 'alpinejs';
import React from 'react';
import { createRoot } from 'react-dom/client';

import './bootstrap';
import { PlatformShell } from './components/PlatformShell';
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
    const component = element.dataset.component ?? 'platform-shell';

    if (component === 'platform-shell') {
        return <PlatformShell />;
    }

    return <div data-react-component={component} data-react-scaffold="true" />;
}

const mount = document.querySelector<ReactMountElement>('[data-react-root], #root');

if (mount) {
    createRoot(mount).render(
        <React.StrictMode>
            <ReactMount element={mount} />
        </React.StrictMode>,
    );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ApiError, type FieldErrors } from '../../lib/api';
import {
    storeApi,
    structureApi,
    type HoursPayload,
    type StoreCorePatch,
    type StoreProfile,
    type StoreSummary,
    type Structure,
} from '../../lib/store';

/**
 * The editable shape of a store profile.
 *
 * Kept separate from StoreProfile (the server's read model) because the form
 * edits flat values while the API returns grouped, derived data. Dirty state is
 * a comparison of this against the snapshot taken when the store last loaded.
 */
export type DraftCore = {
    // Every text field is a plain string: the draft normalises the API's nulls
    // to '' on load and back to null on save, so inputs stay controlled.
    name: string;
    slug: string;
    tagline: string;
    description: string;
    public_email: string;
    public_phone: string;
    website: string;
    country: string;
    state: string;
    city: string;
    postal_code: string;
    address_line: string;
    hide_address: boolean;
    service_area: string;
    timezone: string;
    currency: string;
    language: string;
    min_order_amount: string;
};

export type Draft = {
    core: DraftCore;
    categoryIds: number[];
    hours: HoursPayload;
    /** platform id → value; blank means "not set" and is dropped on save. */
    socials: Record<number, string>;
    settings: Record<string, string>;
};

function draftFrom(store: StoreProfile): Draft {
    return {
        core: {
            name: store.name,
            slug: store.slug,
            tagline: store.tagline ?? '',
            description: store.description ?? '',
            public_email: store.contact.public_email ?? '',
            public_phone: store.contact.public_phone ?? '',
            website: store.contact.website ?? '',
            country: store.location.country ?? '',
            state: store.location.state ?? '',
            city: store.location.city ?? '',
            postal_code: store.location.postal_code ?? '',
            address_line: store.location.address_line ?? '',
            hide_address: store.location.hide_address,
            service_area: store.location.service_area ?? '',
            timezone: store.commerce.timezone,
            currency: store.commerce.currency,
            language: store.commerce.language,
            min_order_amount: store.commerce.min_order_amount?.toString() ?? '',
        },
        categoryIds: store.categories.map((c) => c.id),
        hours: store.hours.map((h) => ({
            weekday: h.weekday,
            is_closed: h.is_closed,
            opens_at: h.opens_at,
            closes_at: h.closes_at,
        })),
        socials: Object.fromEntries(store.socials.map((s) => [s.platform_id, s.value])),
        settings: Object.fromEntries(
            Object.entries(store.settings).map(([key, value]) => [key, value ?? '']),
        ),
    };
}

/** Structural comparison; the draft is plain data so this is enough. */
function same(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export type SaveState = { saving: boolean; message: string; error: string; fieldErrors: FieldErrors };

export function useStoreProfile(storeIdFromRoute: number | null) {
    const [structure, setStructure] = useState<Structure | null>(null);
    const [stores, setStores] = useState<StoreSummary[]>([]);
    const [store, setStore] = useState<StoreProfile | null>(null);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [save, setSave] = useState<SaveState>({ saving: false, message: '', error: '', fieldErrors: {} });

    /** The last-saved draft; dirty state is measured against this. */
    const baseline = useRef<Draft | null>(null);

    const adopt = useCallback((fresh: StoreProfile) => {
        const next = draftFrom(fresh);
        setStore(fresh);
        setDraft(next);
        baseline.current = next;
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setLoadError('');

            try {
                const [structureData, list] = await Promise.all([structureApi.get(), storeApi.list()]);

                if (cancelled) {
                    return;
                }

                setStructure(structureData);
                setStores(list);

                if (list.length === 0) {
                    setStore(null);
                    setDraft(null);
                    return;
                }

                const wanted = list.find((s) => s.id === storeIdFromRoute) ?? list[0];
                const profile = await storeApi.get(wanted.id);

                if (!cancelled) {
                    adopt(profile);
                }
            } catch (error) {
                if (!cancelled) {
                    setLoadError(error instanceof Error ? error.message : 'Could not load this store.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => { cancelled = true; };
    }, [storeIdFromRoute, adopt]);

    const dirty = useMemo(
        () => draft !== null && baseline.current !== null && !same(draft, baseline.current),
        [draft],
    );

    /** Warn before a reload or tab close discards unsaved edits. */
    useEffect(() => {
        if (!dirty) {
            return;
        }

        const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener('beforeunload', onBeforeUnload);

        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, [dirty]);

    const patch = useCallback((update: (current: Draft) => Draft) => {
        setDraft((current) => (current ? update(current) : current));
        setSave((s) => (s.message || s.error ? { ...s, message: '', error: '' } : s));
    }, []);

    const setCore = useCallback(<K extends keyof Draft['core']>(key: K, value: Draft['core'][K]) => {
        patch((current) => ({ ...current, core: { ...current.core, [key]: value } }));
    }, [patch]);

    const setSetting = useCallback((key: string, value: string) => {
        patch((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
    }, [patch]);

    const setSocial = useCallback((platformId: number, value: string) => {
        patch((current) => ({ ...current, socials: { ...current.socials, [platformId]: value } }));
    }, [patch]);

    const toggleCategory = useCallback((id: number) => {
        patch((current) => ({
            ...current,
            categoryIds: current.categoryIds.includes(id)
                ? current.categoryIds.filter((c) => c !== id)
                : [...current.categoryIds, id],
        }));
    }, [patch]);

    const setHours = useCallback((hours: HoursPayload) => {
        patch((current) => ({ ...current, hours }));
    }, [patch]);

    /**
     * Saves only the sections that actually changed. Each endpoint is a bulk
     * replace, so sending an untouched section would be a pointless write.
     */
    const commit = useCallback(async () => {
        if (!store || !draft || !baseline.current) {
            return;
        }

        const before = baseline.current;
        setSave({ saving: true, message: '', error: '', fieldErrors: {} });

        try {
            let latest = store;

            if (!same(draft.core, before.core)) {
                const { min_order_amount, ...rest } = draft.core;
                latest = await storeApi.updateCore(store.id, {
                    ...rest,
                    tagline: rest.tagline || null,
                    description: rest.description || null,
                    public_email: rest.public_email || null,
                    public_phone: rest.public_phone || null,
                    website: rest.website || null,
                    address_line: rest.address_line || null,
                    service_area: rest.service_area || null,
                    min_order_amount: min_order_amount === '' ? null : Number(min_order_amount),
                });
            }

            if (!same(draft.categoryIds, before.categoryIds)) {
                latest = await storeApi.saveCategories(store.id, draft.categoryIds);
            }

            if (!same(draft.hours, before.hours)) {
                latest = await storeApi.saveHours(store.id, draft.hours);
            }

            if (!same(draft.socials, before.socials)) {
                latest = await storeApi.saveSocials(
                    store.id,
                    Object.entries(draft.socials).map(([id, value]) => ({ platform_id: Number(id), value })),
                );
            }

            if (!same(draft.settings, before.settings)) {
                latest = await storeApi.saveSettings(store.id, draft.settings);
            }

            adopt(latest);
            setSave({ saving: false, message: 'Changes saved.', error: '', fieldErrors: {} });
        } catch (error) {
            setSave({
                saving: false,
                message: '',
                error: error instanceof Error ? error.message : 'Could not save your changes.',
                fieldErrors: error instanceof ApiError ? error.errors : {},
            });
        }
    }, [store, draft, adopt]);

    const discard = useCallback(() => {
        if (baseline.current) {
            setDraft(baseline.current);
            setSave({ saving: false, message: '', error: '', fieldErrors: {} });
        }
    }, []);

    /** Media and policy calls return a fresh profile; adopt it wholesale. */
    const replaceStore = useCallback((fresh: StoreProfile) => adopt(fresh), [adopt]);

    const refresh = useCallback(async () => {
        if (store) {
            adopt(await storeApi.get(store.id));
        }
    }, [store, adopt]);

    return {
        structure,
        stores,
        store,
        draft,
        loading,
        loadError,
        dirty,
        save,
        setCore,
        setSetting,
        setSocial,
        toggleCategory,
        setHours,
        commit,
        discard,
        replaceStore,
        refresh,
    };
}

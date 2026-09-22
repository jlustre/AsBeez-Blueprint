import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Download,
  ExternalLink,
  Plus,
  Store,
  Upload,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminVendor,
  type AdminVendorDetail,
  type AdminVendorEvent,
  type AdminVendorStats,
  type AdminVendorStore,
  type MemberStatus,
  type StoreStatus,
  type VendorListQuery,
} from '../../lib/admin';
import {
  AdminActionMenu,
  AdminActivityCard,
  AdminBulkButton,
  AdminDefinitionGrid,
  AdminDetailAside,
  AdminDirectory,
  AdminFeedback,
  AdminField,
  AdminFilterCard,
  AdminLinkGrid,
  AdminMenuItem,
  AdminMetricTiles,
  AdminNotesCard,
  AdminPageHeader,
  AdminPageShell,
  AdminPaginationBar,
  AdminSelect,
  AdminSelectedBar,
  AdminSplitLayout,
  AdminStatGrid,
  AdminStatusBadge,
  AdminStatusCard,
  AdminTableHead,
  AdminToolbarButton,
  formatDate,
  formatDateTime,
  inputClass,
} from './partials';

const emptyFilters: VendorListQuery = {
  search: '',
  status: '',
  store_status: '',
  verification: '',
  registered_from: '',
  registered_to: '',
  sort: 'newest',
  per_page: 25,
  page: 1,
};

const statusTone: Record<MemberStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  restricted: 'bg-orange-100 text-orange-700',
  suspended: 'bg-rose-100 text-rose-700',
  deactivated: 'bg-slate-200 text-slate-700',
};

const statusLabel: Record<MemberStatus, MessageKey> = {
  active: 'admin.statusActive',
  pending: 'admin.statusPending',
  restricted: 'admin.statusRestricted',
  suspended: 'admin.statusSuspended',
  deactivated: 'admin.statusDeactivated',
};

const storeTone: Record<StoreStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-800',
  suspended: 'bg-rose-100 text-rose-700',
};

const storeLabel: Record<StoreStatus, MessageKey> = {
  draft: 'admin.storeDraft',
  active: 'admin.storeActive',
  paused: 'admin.storePaused',
  suspended: 'admin.storeSuspended',
};

const verificationLabel: Record<AdminVendor['verification'], MessageKey> = {
  verified: 'admin.vendorVerified',
  pending: 'admin.vendorPendingReview',
  unverified: 'admin.vendorUnverified',
};

const verificationKindLabel: Record<string, MessageKey> = {
  business: 'admin.verifyBusiness',
  identity: 'admin.verifyIdentity',
  email: 'admin.verifyEmail',
  phone: 'admin.verifyPhone',
  payment: 'admin.verifyPayment',
};

const verificationStatusLabel: Record<string, MessageKey> = {
  verified: 'admin.verifyStatusVerified',
  pending: 'admin.verifyStatusPending',
  unverified: 'admin.verifyStatusUnverified',
  rejected: 'admin.verifyStatusRejected',
};

function vendorCode(id: number): string {
  return `VND-${String(id).padStart(6, '0')}`;
}

function primaryStore(vendor: AdminVendor): AdminVendorStore | undefined {
  return vendor.stores.find((store) => store.status === 'active') ?? vendor.stores[0];
}

export function VendorsManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<VendorListQuery>(emptyFilters);
  const [draft, setDraft] = useState<VendorListQuery>(emptyFilters);
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [stats, setStats] = useState<AdminVendorStats | null>(null);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminVendorDetail | null>(null);
  const [events, setEvents] = useState<AdminVendorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [note, setNote] = useState('');
  const [statusAction, setStatusAction] = useState<MemberStatus | ''>('');
  const [statusReason, setStatusReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const loadList = useCallback(async (query: VendorListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.vendors(query);
      setVendors(data.vendors);
      setStats(data.stats);
      setMeta(data.meta);
      setSelectedIds([]);
      setActiveId((current) => current ?? data.vendors[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.vendorsLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadEvents = useCallback(async () => {
    try {
      setEvents((await adminApi.vendorEvents(8)).events);
    } catch {
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    void loadList(filters);
    void loadEvents();
  }, [filters, loadList, loadEvents]);

  useEffect(() => {
    if (!activeId) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);

    adminApi.vendor(activeId)
      .then((vendor) => { if (!cancelled) setDetail(vendor); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });

    return () => { cancelled = true; };
  }, [activeId]);

  const verificationRate = useMemo(() => {
    if (!stats || stats.total === 0) {
      return '0%';
    }

    return `${Math.round((stats.store_verified / stats.total) * 1000) / 10}%`;
  }, [stats]);

  function applyDraft(next: VendorListQuery = { ...draft, page: 1 }) {
    setDraft(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<VendorListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = vendors.map((vendor) => vendor.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  async function refreshAfterChange(vendor: AdminVendorDetail) {
    setDetail(vendor);
    setNotice(t('admin.vendorStatusUpdated'));
    await loadList(filters);
    await loadEvents();
  }

  async function changeStatus(id: number, status: MemberStatus, reason?: string) {
    setSaving(true);
    setError('');

    try {
      await refreshAfterChange(await adminApi.updateVendorStatus(id, status, reason));
      setStatusAction('');
      setStatusReason('');
      setConfirmation('');
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
      setOpenAction(null);
    }
  }

  async function applySelectedStatus(status: MemberStatus) {
    if (selectedIds.length === 0) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      for (const id of selectedIds) {
        await adminApi.updateVendorStatus(id, status, status === 'active' ? undefined : t('admin.vendorBulkReason'));
      }

      setNotice(t('admin.vendorStatusUpdated'));
      await loadList(filters);
      await loadEvents();
      if (activeId) {
        setDetail(await adminApi.vendor(activeId));
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  }

  async function submitNote() {
    if (!detail || !note.trim()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      setDetail(await adminApi.addVendorNote(detail.id, note.trim()));
      setNote('');
      setNotice(t('admin.vendorNoteAdded'));
      await loadEvents();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  }

  async function submitStatusForm() {
    if (!detail || !statusAction) {
      return;
    }

    if (confirmation.trim().toUpperCase() !== vendorCode(detail.id)) {
      setError(t('admin.vendorConfirmMismatch'));
      return;
    }

    await changeStatus(detail.id, statusAction, statusReason);
  }

  async function changeStoreStatus(storeId: number, status: StoreStatus) {
    if (!detail) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const vendor = await adminApi.updateStoreStatus(detail.id, storeId, status);
      setDetail(vendor);
      setNotice(t('admin.storeStatusUpdated'));
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.vendorStatTotal'), value: stats.total, tone: 'bg-slate-100 text-slate-700', onClick: () => applyStatFilter({}) },
    { key: 'active', label: t('admin.vendorStatActive'), value: stats.active, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ status: 'active' }) },
    { key: 'new', label: t('admin.vendorStatNew'), value: stats.new_this_month, tone: 'bg-sky-100 text-sky-700', onClick: () => applyStatFilter({ registered_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10) }) },
    { key: 'pending', label: t('admin.vendorStatPending'), value: stats.pending, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({ status: 'pending' }) },
    { key: 'verification', label: t('admin.vendorStatPendingVerification'), value: stats.pending_verification, tone: 'bg-amber-100 text-amber-800', onClick: () => applyStatFilter({ verification: 'pending' }) },
    { key: 'restricted', label: t('admin.statRestricted'), value: stats.restricted, tone: 'bg-orange-100 text-orange-700', onClick: () => applyStatFilter({ status: 'restricted' }) },
    { key: 'suspended', label: t('admin.statSuspended'), value: stats.suspended, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ status: 'suspended' }) },
    { key: 'deactivated', label: t('admin.statDeactivated'), value: stats.deactivated, tone: 'bg-slate-100 text-slate-600', onClick: () => applyStatFilter({ status: 'deactivated' }) },
  ] : [];

  const selectedStore = detail ? primaryStore(detail) : undefined;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.vendorsTitle')}
        intro={t('admin.vendorsIntro')}
        crumb={t('admin.navVendors')}
        badge={stats ? t('admin.vendorsTotal', { count: stats.total }) : undefined}
        actions={(
          <>
            <AdminToolbarButton icon={Download} disabled>{t('admin.exportVendors')}</AdminToolbarButton>
            <AdminToolbarButton icon={Upload} disabled>{t('admin.importVendors')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} disabled primary>{t('admin.addVendor')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid variant="kpi" icon={Store} cards={statCards} />

      <AdminMetricTiles
        title={t('admin.vendorGrowthTitle')}
        intro={t('admin.vendorGrowthIntro')}
        columnsClass="grid-cols-2 sm:grid-cols-5"
        tiles={[
          { key: 'registrations', label: t('admin.growthRegistrations'), value: stats?.new_this_month ?? 0, tone: 'bg-sky-50' },
          { key: 'pending', label: t('admin.vendorStatPending'), value: stats?.pending ?? 0, tone: 'bg-amber-50', valueClass: 'text-amber-700' },
          { key: 'stores', label: t('admin.vendorStoresActive'), value: stats?.stores_active ?? 0, tone: 'bg-emerald-50', valueClass: 'text-emerald-700' },
          { key: 'verification', label: t('admin.growthVerification'), value: verificationRate, tone: 'bg-violet-50', valueClass: 'text-violet-700' },
          { key: 'pendingVerification', label: t('admin.vendorStatPendingVerification'), value: stats?.pending_verification ?? 0, tone: 'bg-rose-50', valueClass: 'text-rose-700' },
        ]}
      />

      <AdminFilterCard
        title={t('admin.vendorFilterTitle')}
        search={{
          value: draft.search ?? '',
          onChange: (value) => setDraft((current) => ({ ...current, search: value })),
          placeholder: t('admin.vendorSearchPlaceholder'),
        }}
        onSubmit={() => applyDraft({ ...draft, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
      >
        <AdminField label={t('admin.filterStatus')}>
          <AdminSelect value={draft.status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, status: value as MemberStatus | '' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            {(['active', 'pending', 'restricted', 'suspended', 'deactivated'] as MemberStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.vendorStoreStatus')}>
          <AdminSelect value={draft.store_status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, store_status: value as StoreStatus | '' }))}>
            <option value="">{t('admin.allStoreStatuses')}</option>
            {(['draft', 'active', 'paused', 'suspended'] as StoreStatus[]).map((status) => <option key={status} value={status}>{t(storeLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterVerification')}>
          <AdminSelect value={draft.verification ?? ''} onChange={(value) => setDraft((current) => ({ ...current, verification: value as VendorListQuery['verification'] }))}>
            <option value="">{t('admin.filterAllVerification')}</option>
            <option value="verified">{t('admin.vendorVerified')}</option>
            <option value="pending">{t('admin.vendorPendingReview')}</option>
            <option value="unverified">{t('admin.vendorUnverified')}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterSort')}>
          <AdminSelect value={draft.sort ?? ''} onChange={(value) => setDraft((current) => ({ ...current, sort: value as VendorListQuery['sort'] }))}>
            <option value="newest">{t('admin.vendorSortNewest')}</option>
            <option value="oldest">{t('admin.vendorSortOldest')}</option>
            <option value="name-asc">{t('admin.vendorSortNameAsc')}</option>
            <option value="name-desc">{t('admin.vendorSortNameDesc')}</option>
            <option value="recently-active">{t('admin.sortActive')}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterFrom')}>
          <input type="date" value={draft.registered_from ?? ''} onChange={(event) => setDraft((current) => ({ ...current, registered_from: event.target.value }))} className={inputClass} />
        </AdminField>
        <AdminField label={t('admin.filterTo')}>
          <input type="date" value={draft.registered_to ?? ''} onChange={(event) => setDraft((current) => ({ ...current, registered_to: event.target.value }))} className={inputClass} />
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.vendorDirectoryTitle')}
          showing={t('admin.vendorDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.vendorSelectPage')}
          selected={vendors.length > 0 && vendors.every((vendor) => selectedIds.includes(vendor.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.vendorSelectedCount', { count: selectedIds.length })}>
              <button type="button" disabled={saving} onClick={() => void applySelectedStatus('restricted')} className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-700">{t('admin.bulkRestrict')}</button>
              <AdminBulkButton tone="rose" disabled={saving} onClick={() => void applySelectedStatus('suspended')}>{t('admin.bulkSuspend')}</AdminBulkButton>
              <AdminBulkButton tone="emerald" disabled={saving} onClick={() => void applySelectedStatus('active')}>{t('admin.bulkReactivate')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={vendors.length === 0 ? t('admin.noVendors') : null}
          tableClassName="w-full min-w-[72rem] text-left text-sm"
          pagination={(
            <AdminPaginationBar
              meta={meta}
              perPage={filters.per_page ?? 25}
              onPerPage={(size) => applyDraft({ ...filters, per_page: size, page: 1 })}
              onPage={(page) => applyDraft({ ...filters, page })}
            />
          )}
        >
          <AdminTableHead>
            <tr>
              <th className="px-4 py-3"><input type="checkbox" checked={vendors.every((vendor) => selectedIds.includes(vendor.id))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.colVendorStore')}</th>
              <th className="px-4 py-3">{t('admin.colVendorId')}</th>
              <th className="px-4 py-3">{t('admin.colOwnerContact')}</th>
              <th className="px-4 py-3">{t('admin.colCategory')}</th>
              <th className="px-4 py-3">{t('admin.vendorStoreStatus')}</th>
              <th className="px-4 py-3">{t('admin.colVerification')}</th>
              <th className="px-4 py-3">{t('admin.colJoined')}</th>
              <th className="px-4 py-3">{t('admin.colLastActive')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {vendors.map((vendor) => {
              const store = primaryStore(vendor);
              const rowTone = vendor.status === 'suspended' ? 'bg-rose-50/30' : vendor.status === 'restricted' ? 'bg-orange-50/30' : vendor.status === 'deactivated' ? 'text-slate-500' : selectedIds.includes(vendor.id) || activeId === vendor.id ? 'bg-amber-50/40' : '';

              return (
                <tr key={vendor.id} className={`${rowTone} cursor-pointer hover:bg-amber-50`} onClick={() => setActiveId(vendor.id)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(vendor.id)} onChange={() => toggleSelected(vendor.id)} className="rounded border-slate-300 text-amber-600" />
                  </td>
                  <th className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {store?.logo_url ? <img src={store.logo_url} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 font-black text-slate-950">{vendor.initials}</span>}
                      <div>
                        <p className="font-bold text-slate-950">{store?.name ?? vendor.name}</p>
                        <p className="text-xs text-slate-500">{store ? `/${store.slug}` : t('admin.noStoreYet')} · {t('admin.storeCount', { count: vendor.store_count })}</p>
                      </div>
                    </div>
                  </th>
                  <td className="px-4 py-4 font-mono text-xs">{vendorCode(vendor.id)}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{vendor.name}</p>
                    <p className="text-xs text-slate-500">{store?.public_email ?? vendor.email}</p>
                    <p className="text-xs text-slate-500">{store?.public_phone ?? vendor.phone ?? t('admin.unavailable')}</p>
                  </td>
                  <td className="px-4 py-4">{store?.categories[0]?.name ?? t('admin.unavailable')}</td>
                  <td className="px-4 py-4">{store ? <AdminStatusBadge label={t(storeLabel[store.status])} tone={storeTone[store.status]} /> : t('admin.unavailable')}</td>
                  <td className="px-4 py-4">
                    <p className={`font-semibold ${vendor.verification === 'verified' ? 'text-emerald-700' : vendor.verification === 'pending' ? 'text-amber-700' : 'text-slate-600'}`}>{t(verificationLabel[vendor.verification])}</p>
                  </td>
                  <td className="px-4 py-4">{formatDate(vendor.joined_at, locale)}</td>
                  <td className="px-4 py-4">{formatDateTime(vendor.last_active_at, locale)}</td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(statusLabel[vendor.status])} tone={statusTone[vendor.status]} /></td>
                  <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <AdminActionMenu
                      open={openAction === vendor.id}
                      onToggle={() => setOpenAction((current) => (current === vendor.id ? null : vendor.id))}
                      onClose={() => setOpenAction(null)}
                      label={t('admin.actions')}
                    >
                      <AdminMenuItem onClick={() => { setActiveId(vendor.id); setOpenAction(null); }}>{t('admin.viewVendor')}</AdminMenuItem>
                      {store ? <a href={`/?store=${store.slug}#storefront`} className="block rounded-lg p-2 hover:bg-amber-50">{t('admin.viewLiveStore')}</a> : null}
                      {vendor.status !== 'active' ? <AdminMenuItem tone="emerald" onClick={() => void changeStatus(vendor.id, 'active')}>{t('admin.bulkReactivate')}</AdminMenuItem> : null}
                      {vendor.status === 'active' ? (
                        <button type="button" onClick={() => void changeStatus(vendor.id, 'restricted', t('admin.vendorBulkReason'))} className="block w-full rounded-lg p-2 text-left text-orange-700 hover:bg-orange-50">{t('admin.bulkRestrict')}</button>
                      ) : null}
                      {vendor.status !== 'suspended' ? <AdminMenuItem tone="rose" onClick={() => void changeStatus(vendor.id, 'suspended', t('admin.vendorBulkReason'))}>{t('admin.bulkSuspend')}</AdminMenuItem> : null}
                    </AdminActionMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={t('admin.vendorOverviewTitle')}
          intro={t('admin.vendorOverviewSelected')}
          loading={detailLoading}
          loadingLabel={t('common.loading')}
          empty={t('admin.vendorOverviewEmpty')}
          isEmpty={!detail}
        >
          {detail ? (
            <>
              <div className="p-5 text-center">
                {selectedStore?.logo_url ? <img src={selectedStore.logo_url} alt="" className="mx-auto h-20 w-20 rounded-2xl object-cover ring-4 ring-amber-100" /> : <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400 text-2xl font-black text-slate-950 ring-4 ring-amber-100">{detail.initials}</div>}
                <h3 className="mt-3 text-lg font-bold">{selectedStore?.name ?? detail.name}</h3>
                <p className="text-sm text-slate-500">{detail.name}</p>
                <p className="text-xs text-slate-400">{vendorCode(detail.id)}{selectedStore ? ` · /${selectedStore.slug}` : ''}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <AdminStatusBadge label={t(statusLabel[detail.status])} tone={statusTone[detail.status]} />
                  <AdminStatusBadge
                    label={t(verificationLabel[detail.verification])}
                    tone={detail.verification === 'verified' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}
                  />
                </div>
              </div>
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.vendorOwner'), value: detail.name },
                  { label: t('admin.memberSince'), value: formatDate(detail.joined_at, locale) },
                  { label: t('admin.lastActive'), value: formatDateTime(detail.last_active_at, locale) },
                  { label: t('admin.location'), value: selectedStore ? [selectedStore.city, selectedStore.state, selectedStore.country].filter(Boolean).join(', ') || t('admin.unavailable') : t('admin.unavailable') },
                  { label: t('admin.colContact'), value: selectedStore?.public_email ?? detail.email, span: true },
                  { label: t('admin.storeCountLabel'), value: detail.store_count },
                  { label: t('admin.colCategory'), value: selectedStore?.categories.map((category) => category.name).join(', ') || t('admin.unavailable') },
                ]}
              />
              {selectedStore ? (
                <div className="grid grid-cols-2 gap-2 p-5">
                  <a href={`/?store=${selectedStore.slug}#storefront`} className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-amber-500 hover:text-slate-950"><ExternalLink className="h-3.5 w-3.5" />{t('admin.viewLiveStore')}</a>
                  <button type="button" disabled={saving || selectedStore.status === 'paused'} onClick={() => void changeStoreStatus(selectedStore.id, 'paused')} className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-50 disabled:opacity-50">{t('admin.pauseStore')}</button>
                  <button type="button" disabled={saving || selectedStore.status === 'active'} onClick={() => void changeStoreStatus(selectedStore.id, 'active')} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50">{t('admin.activateStore')}</button>
                  <button type="button" disabled={saving || selectedStore.status === 'suspended'} onClick={() => void changeStoreStatus(selectedStore.id, 'suspended')} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50">{t('admin.suspendStore')}</button>
                </div>
              ) : null}
            </>
          ) : null}
        </AdminDetailAside>
      </AdminSplitLayout>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminNotesCard
          title={t('admin.vendorNotesTitle')}
          intro={t('admin.notesIntro')}
          note={note}
          onChange={setNote}
          onSave={() => void submitNote()}
          saving={saving || !detail}
          placeholder={t('admin.notePlaceholder')}
          locale={locale}
          events={(detail?.events ?? []).filter((event) => event.type === 'note').slice(0, 4).map((event) => ({
            id: event.id,
            body: event.body ?? undefined,
            author: event.author,
            created_at: event.created_at,
          }))}
        />

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold">{t('admin.vendorVerificationTitle')}</h2>
            <p className="mt-1 text-xs text-slate-500">{t('admin.vendorVerificationIntro')}</p>
          </div>
          <div className="space-y-4 p-5">
            {selectedStore?.completeness ? (
              <div>
                <div className="flex justify-between text-xs font-bold"><span>{t('admin.storeHealth')}</span><span>{selectedStore.completeness.percent}%</span></div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${selectedStore.completeness.percent}%` }} /></div>
              </div>
            ) : null}
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {(selectedStore?.verifications ?? []).map((row) => (
                <div key={row.kind}>
                  <dt className="text-xs text-slate-500">{verificationKindLabel[row.kind] ? t(verificationKindLabel[row.kind]) : row.kind}</dt>
                  <dd className={`font-bold ${row.status === 'verified' ? 'text-emerald-700' : row.status === 'pending' ? 'text-amber-700' : 'text-slate-700'}`}>{verificationStatusLabel[row.status] ? t(verificationStatusLabel[row.status]) : row.status}</dd>
                </div>
              ))}
              {!selectedStore?.verifications?.length ? <p className="col-span-2 text-sm text-slate-500">{t('admin.noVerifications')}</p> : null}
            </dl>
          </div>
        </section>

        <AdminStatusCard
          title={t('admin.vendorStatusActions')}
          intro={t('admin.statusActionsIntro')}
          onApply={() => void submitStatusForm()}
          disabled={!detail || !statusAction || saving}
        >
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-slate-500">{t('admin.currentStatus')}</dt><dd className="font-bold">{detail ? t(statusLabel[detail.status]) : t('admin.unavailable')}</dd></div>
            <div><dt className="text-xs text-slate-500">{t('admin.changedBy')}</dt><dd className="font-bold">{detail?.status_changed_by ?? t('admin.none')}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-slate-500">{t('admin.statusReason')}</dt><dd className="font-bold">{detail?.status_reason ?? t('admin.none')}</dd></div>
          </dl>
          <select value={statusAction} onChange={(event) => setStatusAction(event.target.value as MemberStatus | '')} className={inputClass}>
            <option value="">{t('admin.selectAction')}</option>
            {(['active', 'pending', 'restricted', 'suspended', 'deactivated'] as MemberStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </select>
          <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={t('admin.vendorConfirmationPlaceholder')} className={inputClass} />
          <textarea rows={3} value={statusReason} onChange={(event) => setStatusReason(event.target.value)} className={inputClass} />
        </AdminStatusCard>
      </div>

      <AdminActivityCard
        title={t('admin.vendorActivityTitle')}
        intro={t('admin.vendorActivityIntro')}
        headers={[t('admin.colAction'), t('admin.navVendors'), t('admin.colAdministrator'), t('admin.colDate'), t('admin.colReason')]}
      >
        {events.length === 0 ? (
          <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">{t('admin.noVendors')}</td></tr>
        ) : events.map((event) => (
          <tr key={event.id}>
            <td className="px-5 py-4 font-semibold">{event.type === 'note' ? t('admin.eventNote') : t('admin.eventStatus')}</td>
            <td className="px-5 py-4">{event.vendor ?? detail?.name ?? t('admin.unavailable')}</td>
            <td className="px-5 py-4">{event.author ?? t('admin.unavailable')}</td>
            <td className="px-5 py-4">{formatDateTime(event.created_at, locale)}</td>
            <td className="px-5 py-4">{event.body ?? (event.from_status && event.to_status ? `${event.from_status} → ${event.to_status}` : t('admin.none'))}</td>
          </tr>
        ))}
      </AdminActivityCard>

      <AdminLinkGrid
        title={t('admin.vendorAdminLinks')}
        intro={t('admin.vendorAdminLinksIntro')}
        footnote={t('admin.vendorCommerceNotReady')}
        links={[
          { key: 'all', label: t('admin.vendorLinkAll'), onClick: () => applyStatFilter({}) },
          { key: 'active', label: t('admin.vendorLinkActive'), onClick: () => applyStatFilter({ status: 'active' }) },
          { key: 'pending', label: t('admin.vendorLinkPending'), onClick: () => applyStatFilter({ status: 'pending' }) },
          { key: 'restricted', label: t('admin.vendorLinkRestricted'), onClick: () => applyStatFilter({ status: 'restricted' }) },
          { key: 'suspended', label: t('admin.vendorLinkSuspended'), count: stats?.suspended, onClick: () => applyStatFilter({ status: 'suspended' }) },
          { key: 'verification', label: t('admin.vendorLinkVerification'), count: stats?.pending_verification, onClick: () => applyStatFilter({ verification: 'pending' }) },
          { key: 'draft', label: t('admin.vendorLinkDraftStores'), onClick: () => applyStatFilter({ store_status: 'draft' }) },
          { key: 'new', label: t('admin.vendorLinkNew'), onClick: () => applyStatFilter({ registered_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10) }) },
        ]}
      />
    </AdminPageShell>
  );
}

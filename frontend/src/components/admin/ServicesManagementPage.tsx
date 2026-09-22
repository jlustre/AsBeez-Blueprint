import { useCallback, useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  Download,
  ExternalLink,
  Plus,
  Upload,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminProduct,
  type AdminProductDetail,
  type AdminProductEvent,
  type AdminProductStats,
  type AdminServiceList,
  type ProductStatus,
  type ServiceBooking,
  type ServiceDelivery,
  type ServiceListQuery,
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
  formatMoney,
  inputClass,
} from './partials';

const emptyFilters: ServiceListQuery = {
  search: '',
  status: '',
  delivery_method: '',
  booking_model: '',
  store_id: '',
  category_id: '',
  sort: 'newest',
  per_page: 25,
  page: 1,
};

const statusTone: Record<ProductStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  pending: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700',
  hidden: 'bg-orange-100 text-orange-700',
  rejected: 'bg-rose-100 text-rose-700',
  archived: 'bg-slate-200 text-slate-700',
};

const statusLabel: Record<ProductStatus, MessageKey> = {
  draft: 'admin.productDraft',
  pending: 'admin.productPending',
  published: 'admin.productPublished',
  hidden: 'admin.servicePaused',
  rejected: 'admin.productRejected',
  archived: 'admin.productArchived',
};

const deliveryLabel: Record<ServiceDelivery, MessageKey> = {
  on_site: 'admin.deliveryOnSite',
  remote: 'admin.deliveryRemote',
  provider_location: 'admin.deliveryProvider',
  hybrid: 'admin.deliveryHybrid',
};

const bookingLabel: Record<ServiceBooking, MessageKey> = {
  instant: 'admin.bookingInstant',
  request: 'admin.bookingRequest',
  quote: 'admin.bookingQuote',
  none: 'admin.bookingNone',
};

const completenessLabel: Record<string, MessageKey> = {
  name: 'admin.productTaskName',
  sku: 'admin.productTaskSku',
  tagline: 'admin.productTaskTagline',
  description: 'admin.productTaskDescription',
  category: 'admin.productTaskCategory',
  price: 'admin.productTaskPrice',
  brand: 'admin.productTaskBrand',
  duration: 'admin.serviceTaskDuration',
  delivery: 'admin.serviceTaskDelivery',
  booking: 'admin.serviceTaskBooking',
};

function serviceCode(id: number): string {
  return `SRV-${String(id).padStart(6, '0')}`;
}

function formatDuration(minutes: number | null, t: (key: MessageKey, vars?: Record<string, string | number>) => string): string {
  if (!minutes) {
    return '—';
  }

  if (minutes % 60 === 0) {
    return t('admin.serviceHours', { count: minutes / 60 });
  }

  return t('admin.serviceMinutes', { count: minutes });
}

export function ServicesManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<ServiceListQuery>(emptyFilters);
  const [draft, setDraft] = useState<ServiceListQuery>(emptyFilters);
  const [services, setServices] = useState<AdminProduct[]>([]);
  const [stats, setStats] = useState<AdminProductStats | null>(null);
  const [categories, setCategories] = useState<AdminServiceList['categories']>([]);
  const [stores, setStores] = useState<AdminServiceList['stores']>([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminProductDetail | null>(null);
  const [events, setEvents] = useState<AdminProductEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [note, setNote] = useState('');
  const [statusAction, setStatusAction] = useState<ProductStatus | ''>('');
  const [statusReason, setStatusReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const loadList = useCallback(async (query: ServiceListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.services(query);
      setServices(data.services);
      setStats(data.stats);
      setMeta(data.meta);
      setCategories(data.categories);
      setStores(data.stores);
      setSelectedIds([]);
      setActiveId((current) => current ?? data.services[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.servicesLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadEvents = useCallback(async () => {
    try {
      setEvents((await adminApi.serviceEvents(8)).events);
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

    adminApi.service(activeId)
      .then((service) => { if (!cancelled) setDetail(service); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });

    return () => { cancelled = true; };
  }, [activeId]);

  function applyDraft(next: ServiceListQuery = { ...draft, page: 1 }) {
    setDraft(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<ServiceListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = services.map((service) => service.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  async function refreshAfterChange(service: AdminProductDetail) {
    setDetail(service);
    setNotice(t('admin.serviceStatusUpdated'));
    await loadList(filters);
    await loadEvents();
  }

  async function changeStatus(id: number, status: ProductStatus, reason?: string) {
    setSaving(true);
    setError('');

    try {
      await refreshAfterChange(await adminApi.updateServiceStatus(id, status, reason));
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

  async function applySelectedStatus(status: ProductStatus) {
    if (selectedIds.length === 0) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      for (const id of selectedIds) {
        await adminApi.updateServiceStatus(id, status, status === 'published' || status === 'draft' || status === 'pending' ? undefined : t('admin.serviceBulkReason'));
      }

      setNotice(t('admin.serviceStatusUpdated'));
      await loadList(filters);
      await loadEvents();
      if (activeId) {
        setDetail(await adminApi.service(activeId));
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
      setDetail(await adminApi.addServiceNote(detail.id, note.trim()));
      setNote('');
      setNotice(t('admin.serviceNoteAdded'));
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

    if (confirmation.trim().toUpperCase() !== serviceCode(detail.id)) {
      setError(t('admin.serviceConfirmMismatch'));
      return;
    }

    await changeStatus(detail.id, statusAction, statusReason);
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.serviceStatTotal'), value: stats.total, tone: 'bg-slate-100 text-slate-700', onClick: () => applyStatFilter({}) },
    { key: 'published', label: t('admin.productStatPublished'), value: stats.published, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ status: 'published' }) },
    { key: 'draft', label: t('admin.productStatDraft'), value: stats.draft, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({ status: 'draft' }) },
    { key: 'pending', label: t('admin.productStatPending'), value: stats.pending, tone: 'bg-amber-100 text-amber-800', onClick: () => applyStatFilter({ status: 'pending' }) },
    { key: 'hidden', label: t('admin.serviceStatPaused'), value: stats.hidden, tone: 'bg-orange-100 text-orange-700', onClick: () => applyStatFilter({ status: 'hidden' }) },
    { key: 'rejected', label: t('admin.productStatRejected'), value: stats.rejected, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ status: 'rejected' }) },
    { key: 'archived', label: t('admin.productStatArchived'), value: stats.archived, tone: 'bg-slate-100 text-slate-600', onClick: () => applyStatFilter({ status: 'archived' }) },
    { key: 'new', label: t('admin.serviceStatNew'), value: stats.new_this_month, tone: 'bg-sky-100 text-sky-700', onClick: () => applyStatFilter({}) },
  ] : [];

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.servicesTitle')}
        intro={t('admin.servicesIntro')}
        crumb={t('nav.services')}
        badge={stats ? t('admin.servicesTotal', { count: stats.total }) : undefined}
        actions={(
          <>
            <AdminToolbarButton icon={Download} disabled>{t('admin.exportServices')}</AdminToolbarButton>
            <AdminToolbarButton icon={Upload} disabled>{t('admin.importServices')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} disabled primary>{t('admin.addService')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid variant="kpi" icon={BriefcaseBusiness} cards={statCards} />

      <AdminMetricTiles
        title={t('admin.serviceGrowthTitle')}
        intro={t('admin.serviceGrowthIntro')}
        columnsClass="grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
        tiles={[
          { key: 'new', label: t('admin.serviceStatNew'), value: stats?.new_this_month ?? 0, tone: 'bg-sky-50' },
          { key: 'published', label: t('admin.productStatPublished'), value: stats?.published ?? 0, tone: 'bg-emerald-50', valueClass: 'text-emerald-700' },
          { key: 'pending', label: t('admin.productStatPending'), value: stats?.pending ?? 0, tone: 'bg-amber-50', valueClass: 'text-amber-700' },
          { key: 'draft', label: t('admin.productStatDraft'), value: stats?.draft ?? 0, tone: 'bg-slate-50' },
          { key: 'rejected', label: t('admin.productStatRejected'), value: stats?.rejected ?? 0, tone: 'bg-rose-50', valueClass: 'text-rose-700' },
          { key: 'paused', label: t('admin.serviceStatPaused'), value: stats?.hidden ?? 0, tone: 'bg-orange-50', valueClass: 'text-orange-700' },
          { key: 'archived', label: t('admin.productStatArchived'), value: stats?.archived ?? 0, tone: 'bg-slate-50' },
        ]}
      />

      <AdminFilterCard
        title={t('admin.serviceFilterTitle')}
        onSubmit={() => applyDraft({ ...draft, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        search={{
          value: draft.search ?? '',
          onChange: (value) => setDraft((current) => ({ ...current, search: value })),
          placeholder: t('admin.serviceSearchPlaceholder'),
        }}
      >
        <AdminField label={t('admin.serviceStatus')}>
          <AdminSelect value={draft.status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, status: value as ProductStatus | '' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            {(Object.keys(statusLabel) as ProductStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.serviceDelivery')}>
          <AdminSelect value={draft.delivery_method ?? ''} onChange={(value) => setDraft((current) => ({ ...current, delivery_method: value as ServiceDelivery | '' }))}>
            <option value="">{t('admin.allDelivery')}</option>
            {(Object.keys(deliveryLabel) as ServiceDelivery[]).map((method) => <option key={method} value={method}>{t(deliveryLabel[method])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.serviceBooking')}>
          <AdminSelect value={draft.booking_model ?? ''} onChange={(value) => setDraft((current) => ({ ...current, booking_model: value as ServiceBooking | '' }))}>
            <option value="">{t('admin.allBooking')}</option>
            {(Object.keys(bookingLabel) as ServiceBooking[]).map((model) => <option key={model} value={model}>{t(bookingLabel[model])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.productStore')}>
          <AdminSelect value={draft.store_id ?? ''} onChange={(value) => setDraft((current) => ({ ...current, store_id: value ? Number(value) : '' }))}>
            <option value="">{t('admin.allStores')}</option>
            {stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.colCategory')}>
          <AdminSelect value={draft.category_id ?? ''} onChange={(value) => setDraft((current) => ({ ...current, category_id: value ? Number(value) : '' }))}>
            <option value="">{t('admin.allCategories')}</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterSort')}>
          <AdminSelect value={draft.sort ?? ''} onChange={(value) => setDraft((current) => ({ ...current, sort: value as ServiceListQuery['sort'] }))}>
            <option value="newest">{t('admin.serviceSortNewest')}</option>
            <option value="oldest">{t('admin.serviceSortOldest')}</option>
            <option value="name-asc">{t('admin.sortNameAsc')}</option>
            <option value="name-desc">{t('admin.sortNameDesc')}</option>
            <option value="updated">{t('admin.productSortUpdated')}</option>
            <option value="price-high">{t('admin.productSortPriceHigh')}</option>
            <option value="price-low">{t('admin.productSortPriceLow')}</option>
          </AdminSelect>
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.serviceDirectoryTitle')}
          showing={t('admin.serviceDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.serviceSelectPage')}
          selected={services.length > 0 && services.every((service) => selectedIds.includes(service.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.serviceSelectedCount', { count: selectedIds.length })}>
              <AdminBulkButton disabled={saving} tone="emerald" onClick={() => void applySelectedStatus('published')}>{t('admin.productPublish')}</AdminBulkButton>
              <button type="button" disabled={saving} onClick={() => void applySelectedStatus('hidden')} className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-700">{t('admin.productHide')}</button>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedStatus('archived')}>{t('admin.productArchive')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={services.length === 0 ? t('admin.noServices') : null}
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
              <th className="px-4 py-3"><input type="checkbox" checked={services.every((service) => selectedIds.includes(service.id))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.colService')}</th>
              <th className="px-4 py-3">{t('admin.colServiceId')}</th>
              <th className="px-4 py-3">{t('admin.colVendorStore')}</th>
              <th className="px-4 py-3">{t('admin.colCategory')}</th>
              <th className="px-4 py-3">{t('admin.serviceDelivery')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colPrice')}</th>
              <th className="px-4 py-3">{t('admin.serviceDuration')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3">{t('admin.colUpdated')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {services.map((service) => {
              const rowTone = service.status === 'rejected' || service.status === 'hidden' ? 'bg-rose-50/30' : service.status === 'archived' ? 'text-slate-500' : selectedIds.includes(service.id) || activeId === service.id ? 'bg-amber-50/40' : '';

              return (
                <tr key={service.id} className={`${rowTone} cursor-pointer hover:bg-amber-50`} onClick={() => setActiveId(service.id)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(service.id)} onChange={() => toggleSelected(service.id)} className="rounded border-slate-300 text-amber-600" />
                  </td>
                  <th className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {service.store?.logo_url ? <img src={service.store.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-slate-950"><BriefcaseBusiness className="h-6 w-6" /></span>}
                      <div>
                        <p className="font-bold text-slate-950">{service.name}</p>
                        <p className="text-xs text-slate-500">{service.tagline ?? service.brand ?? service.slug}</p>
                      </div>
                    </div>
                  </th>
                  <td className="px-4 py-4"><p className="font-mono text-xs">{serviceCode(service.id)}</p><p className="text-xs text-slate-500">{service.sku ?? t('admin.unavailable')}</p></td>
                  <td className="px-4 py-4"><p className="font-semibold">{service.store?.vendor_name ?? t('admin.unavailable')}</p><p className="text-xs text-slate-500">{service.store?.name ?? t('admin.unavailable')}</p></td>
                  <td className="px-4 py-4">{service.category?.name ?? t('admin.unavailable')}</td>
                  <td className="px-4 py-4">{service.delivery_method ? t(deliveryLabel[service.delivery_method]) : t('admin.unavailable')}</td>
                  <td className="px-4 py-4 text-right font-bold">{formatMoney(service.price, service.currency, locale)}</td>
                  <td className="px-4 py-4">{formatDuration(service.duration_minutes, t)}</td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(statusLabel[service.status])} tone={statusTone[service.status]} /></td>
                  <td className="px-4 py-4">{formatDate(service.updated_at, locale)}</td>
                  <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <AdminActionMenu
                      open={openAction === service.id}
                      onToggle={() => setOpenAction((current) => (current === service.id ? null : service.id))}
                      onClose={() => setOpenAction(null)}
                      label={t('admin.actions')}
                    >
                      <AdminMenuItem onClick={() => { setActiveId(service.id); setOpenAction(null); }}>{t('admin.viewService')}</AdminMenuItem>
                      {service.store ? <a href={`/?store=${service.store.slug}#storefront`} className="block rounded-lg p-2 hover:bg-amber-50">{t('admin.viewLiveStore')}</a> : null}
                      {service.status !== 'published' ? <AdminMenuItem tone="emerald" onClick={() => void changeStatus(service.id, 'published')}>{t('admin.productPublish')}</AdminMenuItem> : null}
                      {service.status === 'published' ? <button type="button" onClick={() => void changeStatus(service.id, 'hidden', t('admin.serviceBulkReason'))} className="block w-full rounded-lg p-2 text-left text-orange-700 hover:bg-orange-50">{t('admin.productHide')}</button> : null}
                      {service.status !== 'archived' ? <AdminMenuItem onClick={() => void changeStatus(service.id, 'archived', t('admin.serviceBulkReason'))}>{t('admin.productArchive')}</AdminMenuItem> : <AdminMenuItem tone="emerald" onClick={() => void changeStatus(service.id, 'draft')}>{t('admin.productRestore')}</AdminMenuItem>}
                    </AdminActionMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={t('admin.serviceOverviewTitle')}
          intro={t('admin.serviceOverviewSelected')}
          loading={detailLoading}
          loadingLabel={t('common.loading')}
          empty={t('admin.serviceOverviewEmpty')}
          isEmpty={!detail}
        >
          {detail ? (
            <>
              <div className="p-5 text-center">
                {detail.store?.logo_url ? <img src={detail.store.logo_url} alt="" className="mx-auto h-20 w-20 rounded-2xl object-cover ring-4 ring-amber-100" /> : <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 ring-4 ring-amber-100"><BriefcaseBusiness className="h-8 w-8" /></div>}
                <h3 className="mt-3 text-lg font-bold">{detail.name}</h3>
                <p className="text-xs text-slate-400">{serviceCode(detail.id)}{detail.sku ? ` · ${detail.sku}` : ''}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <AdminStatusBadge label={t(statusLabel[detail.status])} tone={statusTone[detail.status]} />
                  {detail.delivery_method ? <AdminStatusBadge label={t(deliveryLabel[detail.delivery_method])} tone="bg-sky-100 text-sky-700" /> : null}
                </div>
              </div>
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.vendorOwner'), value: detail.store?.vendor_name ?? t('admin.unavailable') },
                  { label: t('admin.productStore'), value: detail.store?.name ?? t('admin.unavailable') },
                  { label: t('admin.colCategory'), value: detail.category?.name ?? t('admin.unavailable') },
                  { label: t('admin.serviceBooking'), value: detail.booking_model ? t(bookingLabel[detail.booking_model]) : t('admin.unavailable') },
                  { label: t('admin.colPrice'), value: formatMoney(detail.price, detail.currency, locale) },
                  { label: t('admin.serviceDuration'), value: formatDuration(detail.duration_minutes, t) },
                  { label: t('admin.serviceArea'), value: detail.service_area ?? t('admin.unavailable'), span: true },
                ]}
              />
              {detail.store ? (
                <div className="grid grid-cols-2 gap-2 p-5">
                  <a href={`/?store=${detail.store.slug}#storefront`} className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-amber-500 hover:text-slate-950"><ExternalLink className="h-3.5 w-3.5" />{t('admin.viewLiveStore')}</a>
                  <a href="#admin-vendors" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('admin.viewVendor')}</a>
                </div>
              ) : null}
            </>
          ) : null}
        </AdminDetailAside>
      </AdminSplitLayout>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold">{t('admin.serviceQualityTitle')}</h2>
            <p className="mt-1 text-xs text-slate-500">{t('admin.serviceQualityIntro')}</p>
          </div>
          <div className="space-y-4 p-5">
            {detail?.completeness ? (
              <>
                <div>
                  <div className="flex justify-between text-xs font-bold"><span>{t('admin.productCompleteness')}</span><span>{detail.completeness.percent}%</span></div>
                  <div className="mt-2 h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${detail.completeness.percent}%` }} /></div>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {detail.completeness.tasks.map((task) => (
                    <div key={task.key}>
                      <dt className="text-xs text-slate-500">{completenessLabel[task.key] ? t(completenessLabel[task.key]) : task.key}</dt>
                      <dd className={`font-bold ${task.done ? 'text-emerald-700' : 'text-amber-700'}`}>{task.done ? t('admin.productTaskDone') : t('admin.productTaskMissing')}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : <p className="text-sm text-slate-500">{t('admin.serviceOverviewEmpty')}</p>}
          </div>
        </section>

        <AdminNotesCard
          title={t('admin.serviceNotesTitle')}
          intro={t('admin.serviceNotesIntro')}
          note={note}
          onChange={setNote}
          onSave={() => void submitNote()}
          saving={saving || !detail}
          placeholder={t('admin.notePlaceholder')}
          events={(detail?.events ?? []).filter((event) => event.type === 'note').slice(0, 4).map((event) => ({
            id: event.id,
            body: event.body ?? undefined,
            author: event.author,
            created_at: event.created_at,
          }))}
          locale={locale}
        />

        <AdminStatusCard
          title={t('admin.serviceStatusActions')}
          intro={t('admin.serviceStatusActionsIntro')}
          onApply={() => void submitStatusForm()}
          disabled={!detail || !statusAction || saving}
        >
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-slate-500">{t('admin.currentStatus')}</dt><dd className="font-bold">{detail ? t(statusLabel[detail.status]) : t('admin.unavailable')}</dd></div>
            <div><dt className="text-xs text-slate-500">{t('admin.changedBy')}</dt><dd className="font-bold">{detail?.status_changed_by ?? t('admin.none')}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-slate-500">{t('admin.statusReason')}</dt><dd className="font-bold">{detail?.status_reason ?? t('admin.none')}</dd></div>
          </dl>
          <AdminSelect value={statusAction} onChange={(value) => setStatusAction(value as ProductStatus | '')}>
            <option value="">{t('admin.selectAction')}</option>
            {(Object.keys(statusLabel) as ProductStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
          <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={t('admin.serviceConfirmationPlaceholder')} className={inputClass} />
          <textarea rows={3} value={statusReason} onChange={(event) => setStatusReason(event.target.value)} className={inputClass} />
        </AdminStatusCard>
      </div>

      <AdminActivityCard
        title={t('admin.serviceActivityTitle')}
        intro={t('admin.serviceActivityIntro')}
        headers={[t('admin.colAction'), t('nav.services'), t('admin.navVendors'), t('admin.colAdministrator'), t('admin.colDate'), t('admin.colReason')]}
      >
        {events.length === 0 ? (
          <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">{t('admin.noServices')}</td></tr>
        ) : events.map((event) => (
          <tr key={event.id}>
            <td className="px-5 py-4 font-semibold">{event.type === 'note' ? t('admin.eventNote') : t('admin.eventStatus')}</td>
            <td className="px-5 py-4">{event.product ?? detail?.name ?? t('admin.unavailable')}</td>
            <td className="px-5 py-4">{event.vendor ?? t('admin.unavailable')}</td>
            <td className="px-5 py-4">{event.author ?? t('admin.unavailable')}</td>
            <td className="px-5 py-4">{formatDateTime(event.created_at, locale)}</td>
            <td className="px-5 py-4">{event.body ?? (event.from_status && event.to_status ? `${event.from_status} → ${event.to_status}` : t('admin.none'))}</td>
          </tr>
        ))}
      </AdminActivityCard>

      <AdminLinkGrid
        title={t('admin.serviceAdminLinks')}
        intro={t('admin.serviceAdminLinksIntro')}
        footnote={t('admin.serviceCommerceNotReady')}
        links={[
          { key: 'all', label: t('admin.serviceLinkAll'), onClick: () => applyStatFilter({}) },
          { key: 'published', label: t('admin.productLinkPublished'), onClick: () => applyStatFilter({ status: 'published' }) },
          { key: 'draft', label: t('admin.serviceLinkDraft'), onClick: () => applyStatFilter({ status: 'draft' }) },
          { key: 'pending', label: t('admin.productLinkPending'), count: stats?.pending, onClick: () => applyStatFilter({ status: 'pending' }) },
          { key: 'paused', label: t('admin.serviceLinkPaused'), count: stats?.hidden, onClick: () => applyStatFilter({ status: 'hidden' }) },
          { key: 'rejected', label: t('admin.productLinkRejected'), count: stats?.rejected, onClick: () => applyStatFilter({ status: 'rejected' }) },
          { key: 'remote', label: t('admin.serviceLinkRemote'), onClick: () => applyStatFilter({ delivery_method: 'remote' }) },
          { key: 'on_site', label: t('admin.serviceLinkOnSite'), onClick: () => applyStatFilter({ delivery_method: 'on_site' }) },
        ]}
      />
    </AdminPageShell>
  );
}

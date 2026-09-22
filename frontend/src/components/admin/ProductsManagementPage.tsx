import { useCallback, useEffect, useState } from 'react';
import {
  Download,
  ExternalLink,
  Package,
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
  type AdminProductList,
  type AdminProductStats,
  type ProductInventory,
  type ProductListQuery,
  type ProductStatus,
  type ProductType,
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

const emptyFilters: ProductListQuery = {
  search: '',
  status: '',
  type: '',
  inventory: '',
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
  hidden: 'admin.productHidden',
  rejected: 'admin.productRejected',
  archived: 'admin.productArchived',
};

const typeTone: Record<ProductType, string> = {
  physical: 'bg-slate-100 text-slate-700',
  digital: 'bg-sky-100 text-sky-700',
  service: 'bg-amber-100 text-amber-800',
  bundle: 'bg-violet-100 text-violet-700',
  custom: 'bg-slate-100 text-slate-700',
};

const typeLabel: Record<ProductType, MessageKey> = {
  physical: 'admin.productTypePhysical',
  digital: 'admin.productTypeDigital',
  service: 'admin.productTypeService',
  bundle: 'admin.productTypeBundle',
  custom: 'admin.productTypeCustom',
};

const inventoryTone: Record<ProductInventory, string> = {
  in_stock: 'text-emerald-700',
  low_stock: 'text-amber-700',
  out_of_stock: 'text-rose-700',
  not_tracked: 'text-sky-700',
};

const inventoryLabel: Record<ProductInventory, MessageKey> = {
  in_stock: 'admin.inventoryInStock',
  low_stock: 'admin.inventoryLowStock',
  out_of_stock: 'admin.inventoryOutOfStock',
  not_tracked: 'admin.inventoryNotTracked',
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

function productCode(id: number): string {
  return `PRD-${String(id).padStart(6, '0')}`;
}

export function ProductsManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<ProductListQuery>(emptyFilters);
  const [draft, setDraft] = useState<ProductListQuery>(emptyFilters);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stats, setStats] = useState<AdminProductStats | null>(null);
  const [categories, setCategories] = useState<AdminProductList['categories']>([]);
  const [stores, setStores] = useState<AdminProductList['stores']>([]);
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

  const loadList = useCallback(async (query: ProductListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.products(query);
      setProducts(data.products);
      setStats(data.stats);
      setMeta(data.meta);
      setCategories(data.categories);
      setStores(data.stores);
      setSelectedIds([]);
      setActiveId((current) => current ?? data.products[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.productsLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadEvents = useCallback(async () => {
    try {
      setEvents((await adminApi.productEvents(8)).events);
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

    adminApi.product(activeId)
      .then((product) => { if (!cancelled) setDetail(product); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });

    return () => { cancelled = true; };
  }, [activeId]);

  function applyDraft(next: ProductListQuery = { ...draft, page: 1 }) {
    setDraft(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<ProductListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = products.map((product) => product.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  async function refreshAfterChange(product: AdminProductDetail) {
    setDetail(product);
    setNotice(t('admin.productStatusUpdated'));
    await loadList(filters);
    await loadEvents();
  }

  async function changeStatus(id: number, status: ProductStatus, reason?: string) {
    setSaving(true);
    setError('');

    try {
      await refreshAfterChange(await adminApi.updateProductStatus(id, status, reason));
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
        await adminApi.updateProductStatus(id, status, status === 'published' || status === 'draft' || status === 'pending' ? undefined : t('admin.productBulkReason'));
      }

      setNotice(t('admin.productStatusUpdated'));
      await loadList(filters);
      await loadEvents();
      if (activeId) {
        setDetail(await adminApi.product(activeId));
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
      setDetail(await adminApi.addProductNote(detail.id, note.trim()));
      setNote('');
      setNotice(t('admin.productNoteAdded'));
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

    if (confirmation.trim().toUpperCase() !== productCode(detail.id)) {
      setError(t('admin.productConfirmMismatch'));
      return;
    }

    await changeStatus(detail.id, statusAction, statusReason);
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.productStatTotal'), value: stats.total, tone: 'bg-slate-100 text-slate-700', onClick: () => applyStatFilter({}) },
    { key: 'published', label: t('admin.productStatPublished'), value: stats.published, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ status: 'published' }) },
    { key: 'draft', label: t('admin.productStatDraft'), value: stats.draft, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({ status: 'draft' }) },
    { key: 'pending', label: t('admin.productStatPending'), value: stats.pending, tone: 'bg-amber-100 text-amber-800', onClick: () => applyStatFilter({ status: 'pending' }) },
    { key: 'hidden', label: t('admin.productStatHidden'), value: stats.hidden, tone: 'bg-orange-100 text-orange-700', onClick: () => applyStatFilter({ status: 'hidden' }) },
    { key: 'rejected', label: t('admin.productStatRejected'), value: stats.rejected, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ status: 'rejected' }) },
    { key: 'out', label: t('admin.productStatOutOfStock'), value: stats.out_of_stock, tone: 'bg-slate-100 text-slate-600', onClick: () => applyStatFilter({ inventory: 'out_of_stock' }) },
    { key: 'low', label: t('admin.productStatLowStock'), value: stats.low_stock, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ inventory: 'low_stock' }) },
  ] : [];

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.productsTitle')}
        intro={t('admin.productsIntro')}
        crumb={t('nav.products')}
        badge={stats ? t('admin.productsTotal', { count: stats.total }) : undefined}
        actions={(
          <>
            <AdminToolbarButton icon={Download} disabled>{t('admin.exportProducts')}</AdminToolbarButton>
            <AdminToolbarButton icon={Upload} disabled>{t('admin.importProducts')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} disabled primary>{t('admin.addProduct')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid variant="kpi" icon={Package} cards={statCards} />

      <AdminMetricTiles
        title={t('admin.productGrowthTitle')}
        intro={t('admin.productGrowthIntro')}
        columnsClass="grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
        tiles={[
          { key: 'new', label: t('admin.productStatNew'), value: stats?.new_this_month ?? 0, tone: 'bg-sky-50' },
          { key: 'published', label: t('admin.productStatPublished'), value: stats?.published ?? 0, tone: 'bg-emerald-50', valueClass: 'text-emerald-700' },
          { key: 'pending', label: t('admin.productStatPending'), value: stats?.pending ?? 0, tone: 'bg-amber-50', valueClass: 'text-amber-700' },
          { key: 'draft', label: t('admin.productStatDraft'), value: stats?.draft ?? 0, tone: 'bg-slate-50' },
          { key: 'rejected', label: t('admin.productStatRejected'), value: stats?.rejected ?? 0, tone: 'bg-rose-50', valueClass: 'text-rose-700' },
          { key: 'archived', label: t('admin.productStatArchived'), value: stats?.archived ?? 0, tone: 'bg-slate-50' },
          { key: 'out', label: t('admin.productStatOutOfStock'), value: stats?.out_of_stock ?? 0, tone: 'bg-orange-50', valueClass: 'text-orange-700' },
          { key: 'low', label: t('admin.productStatLowStock'), value: stats?.low_stock ?? 0, tone: 'bg-rose-50', valueClass: 'text-rose-700' },
        ]}
      />

      <AdminFilterCard
        title={t('admin.productFilterTitle')}
        onSubmit={() => applyDraft({ ...draft, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        search={{
          value: draft.search ?? '',
          onChange: (value) => setDraft((current) => ({ ...current, search: value })),
          placeholder: t('admin.productSearchPlaceholder'),
        }}
      >
        <AdminField label={t('admin.productStatus')}>
          <AdminSelect value={draft.status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, status: value as ProductStatus | '' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            {(Object.keys(statusLabel) as ProductStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.productType')}>
          <AdminSelect value={draft.type ?? ''} onChange={(value) => setDraft((current) => ({ ...current, type: value as ProductType | '' }))}>
            <option value="">{t('admin.allProductTypes')}</option>
            {(Object.keys(typeLabel) as ProductType[]).map((type) => <option key={type} value={type}>{t(typeLabel[type])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.productInventory')}>
          <AdminSelect value={draft.inventory ?? ''} onChange={(value) => setDraft((current) => ({ ...current, inventory: value as ProductInventory | '' }))}>
            <option value="">{t('admin.allInventory')}</option>
            {(Object.keys(inventoryLabel) as ProductInventory[]).map((state) => <option key={state} value={state}>{t(inventoryLabel[state])}</option>)}
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
          <AdminSelect value={draft.sort ?? ''} onChange={(value) => setDraft((current) => ({ ...current, sort: value as ProductListQuery['sort'] }))}>
            <option value="newest">{t('admin.productSortNewest')}</option>
            <option value="oldest">{t('admin.productSortOldest')}</option>
            <option value="name-asc">{t('admin.sortNameAsc')}</option>
            <option value="name-desc">{t('admin.sortNameDesc')}</option>
            <option value="updated">{t('admin.productSortUpdated')}</option>
            <option value="price-high">{t('admin.productSortPriceHigh')}</option>
            <option value="price-low">{t('admin.productSortPriceLow')}</option>
            <option value="stock-low">{t('admin.productSortStockLow')}</option>
          </AdminSelect>
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.productDirectoryTitle')}
          showing={t('admin.productDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.productSelectPage')}
          selected={products.length > 0 && products.every((product) => selectedIds.includes(product.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.productSelectedCount', { count: selectedIds.length })}>
              <AdminBulkButton disabled={saving} tone="emerald" onClick={() => void applySelectedStatus('published')}>{t('admin.productPublish')}</AdminBulkButton>
              <button type="button" disabled={saving} onClick={() => void applySelectedStatus('hidden')} className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-700">{t('admin.productHide')}</button>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedStatus('archived')}>{t('admin.productArchive')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={products.length === 0 ? t('admin.noProducts') : null}
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
              <th className="px-4 py-3"><input type="checkbox" checked={products.every((product) => selectedIds.includes(product.id))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.colProduct')}</th>
              <th className="px-4 py-3">{t('admin.colProductId')}</th>
              <th className="px-4 py-3">{t('admin.colVendorStore')}</th>
              <th className="px-4 py-3">{t('admin.colCategory')}</th>
              <th className="px-4 py-3">{t('admin.productType')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colPrice')}</th>
              <th className="px-4 py-3">{t('admin.productInventory')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3">{t('admin.colUpdated')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const rowTone = product.status === 'rejected' || product.status === 'hidden' ? 'bg-rose-50/30' : product.status === 'archived' ? 'text-slate-500' : selectedIds.includes(product.id) || activeId === product.id ? 'bg-amber-50/40' : '';
              const discount = product.compare_at_price && product.price !== null && product.compare_at_price > product.price
                ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
                : null;

              return (
                <tr key={product.id} className={`${rowTone} cursor-pointer hover:bg-amber-50`} onClick={() => setActiveId(product.id)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelected(product.id)} className="rounded border-slate-300 text-amber-600" />
                  </td>
                  <th className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.store?.logo_url ? <img src={product.store.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-slate-950"><Package className="h-6 w-6" /></span>}
                      <div>
                        <p className="font-bold text-slate-950">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.tagline ?? product.brand ?? product.slug}</p>
                      </div>
                    </div>
                  </th>
                  <td className="px-4 py-4"><p className="font-mono text-xs">{productCode(product.id)}</p><p className="text-xs text-slate-500">{product.sku ?? t('admin.unavailable')}</p></td>
                  <td className="px-4 py-4"><p className="font-semibold">{product.store?.vendor_name ?? t('admin.unavailable')}</p><p className="text-xs text-slate-500">{product.store?.name ?? t('admin.unavailable')}</p></td>
                  <td className="px-4 py-4">{product.category?.name ?? t('admin.unavailable')}</td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(typeLabel[product.type])} tone={typeTone[product.type]} /></td>
                  <td className="px-4 py-4 text-right">
                    <p className="font-bold">{formatMoney(product.price, product.currency, locale)}</p>
                    {discount ? <p className="text-xs text-slate-400 line-through">{formatMoney(product.compare_at_price, product.currency, locale)}</p> : null}
                    {discount ? <span className="text-xs font-bold text-rose-600">{t('admin.productOff', { percent: discount })}</span> : null}
                  </td>
                  <td className="px-4 py-4">
                    {product.track_inventory ? <p className="font-bold">{product.stock_qty ?? 0}</p> : null}
                    <span className={`text-xs font-semibold ${inventoryTone[product.inventory]}`}>{t(inventoryLabel[product.inventory])}</span>
                  </td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(statusLabel[product.status])} tone={statusTone[product.status]} /></td>
                  <td className="px-4 py-4">{formatDate(product.updated_at, locale)}</td>
                  <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <AdminActionMenu
                      open={openAction === product.id}
                      onToggle={() => setOpenAction((current) => (current === product.id ? null : product.id))}
                      onClose={() => setOpenAction(null)}
                      label={t('admin.actions')}
                    >
                      <AdminMenuItem onClick={() => { setActiveId(product.id); setOpenAction(null); }}>{t('admin.viewProduct')}</AdminMenuItem>
                      {product.store ? <a href={`/?store=${product.store.slug}#storefront`} className="block rounded-lg p-2 hover:bg-amber-50">{t('admin.viewLiveStore')}</a> : null}
                      {product.status !== 'published' ? <AdminMenuItem tone="emerald" onClick={() => void changeStatus(product.id, 'published')}>{t('admin.productPublish')}</AdminMenuItem> : null}
                      {product.status === 'published' ? <button type="button" onClick={() => void changeStatus(product.id, 'hidden', t('admin.productBulkReason'))} className="block w-full rounded-lg p-2 text-left text-orange-700 hover:bg-orange-50">{t('admin.productHide')}</button> : null}
                      {product.status !== 'archived' ? <AdminMenuItem onClick={() => void changeStatus(product.id, 'archived', t('admin.productBulkReason'))}>{t('admin.productArchive')}</AdminMenuItem> : <AdminMenuItem tone="emerald" onClick={() => void changeStatus(product.id, 'draft')}>{t('admin.productRestore')}</AdminMenuItem>}
                    </AdminActionMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={t('admin.productOverviewTitle')}
          intro={t('admin.productOverviewSelected')}
          loading={detailLoading}
          loadingLabel={t('common.loading')}
          empty={t('admin.productOverviewEmpty')}
          isEmpty={!detail}
        >
          {detail ? (
            <>
              <div className="p-5 text-center">
                {detail.store?.logo_url ? <img src={detail.store.logo_url} alt="" className="mx-auto h-20 w-20 rounded-2xl object-cover ring-4 ring-amber-100" /> : <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 ring-4 ring-amber-100"><Package className="h-8 w-8" /></div>}
                <h3 className="mt-3 text-lg font-bold">{detail.name}</h3>
                <p className="text-xs text-slate-400">{productCode(detail.id)}{detail.sku ? ` · ${detail.sku}` : ''}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <AdminStatusBadge label={t(statusLabel[detail.status])} tone={statusTone[detail.status]} />
                  <AdminStatusBadge label={t(typeLabel[detail.type])} tone={typeTone[detail.type]} />
                </div>
              </div>
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.vendorOwner'), value: detail.store?.vendor_name ?? t('admin.unavailable') },
                  { label: t('admin.productStore'), value: detail.store?.name ?? t('admin.unavailable') },
                  { label: t('admin.productBrand'), value: detail.brand ?? t('admin.unavailable') },
                  { label: t('admin.colCategory'), value: detail.category?.name ?? t('admin.unavailable') },
                  { label: t('admin.colPrice'), value: formatMoney(detail.price, detail.currency, locale) },
                  { label: t('admin.productInventory'), value: <span className={inventoryTone[detail.inventory]}>{detail.track_inventory ? `${detail.stock_qty ?? 0} · ` : ''}{t(inventoryLabel[detail.inventory])}</span> },
                  { label: t('admin.colJoined'), value: formatDate(detail.created_at, locale) },
                  { label: t('admin.productPublishedAt'), value: formatDate(detail.published_at, locale) },
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
            <h2 className="text-lg font-bold">{t('admin.productQualityTitle')}</h2>
            <p className="mt-1 text-xs text-slate-500">{t('admin.productQualityIntro')}</p>
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
            ) : <p className="text-sm text-slate-500">{t('admin.productOverviewEmpty')}</p>}
          </div>
        </section>

        <AdminNotesCard
          title={t('admin.productNotesTitle')}
          intro={t('admin.productNotesIntro')}
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
          title={t('admin.productStatusActions')}
          intro={t('admin.productStatusActionsIntro')}
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
          <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={t('admin.productConfirmationPlaceholder')} className={inputClass} />
          <textarea rows={3} value={statusReason} onChange={(event) => setStatusReason(event.target.value)} className={inputClass} />
        </AdminStatusCard>
      </div>

      <AdminActivityCard
        title={t('admin.productActivityTitle')}
        intro={t('admin.productActivityIntro')}
        headers={[t('admin.colAction'), t('nav.products'), t('admin.navVendors'), t('admin.colAdministrator'), t('admin.colDate'), t('admin.colReason')]}
      >
        {events.length === 0 ? (
          <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">{t('admin.noProducts')}</td></tr>
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
        title={t('admin.productAdminLinks')}
        intro={t('admin.productAdminLinksIntro')}
        footnote={t('admin.productCommerceNotReady')}
        links={[
          { key: 'all', label: t('admin.productLinkAll'), onClick: () => applyStatFilter({}) },
          { key: 'published', label: t('admin.productLinkPublished'), onClick: () => applyStatFilter({ status: 'published' }) },
          { key: 'draft', label: t('admin.productLinkDraft'), onClick: () => applyStatFilter({ status: 'draft' }) },
          { key: 'pending', label: t('admin.productLinkPending'), count: stats?.pending, onClick: () => applyStatFilter({ status: 'pending' }) },
          { key: 'hidden', label: t('admin.productLinkHidden'), count: stats?.hidden, onClick: () => applyStatFilter({ status: 'hidden' }) },
          { key: 'rejected', label: t('admin.productLinkRejected'), count: stats?.rejected, onClick: () => applyStatFilter({ status: 'rejected' }) },
          { key: 'out', label: t('admin.productLinkOutOfStock'), count: stats?.out_of_stock, onClick: () => applyStatFilter({ inventory: 'out_of_stock' }) },
          { key: 'low', label: t('admin.productLinkLowStock'), count: stats?.low_stock, onClick: () => applyStatFilter({ inventory: 'low_stock' }) },
        ]}
      />
    </AdminPageShell>
  );
}

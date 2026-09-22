import { useCallback, useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  LayoutGrid,
  Plus,
  Upload,
} from 'lucide-react';

import { useTranslation } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminCategory,
  type AdminCategoryDetail,
  type AdminCategoryList,
  type AdminCategoryStats,
  type AdminCategoryTree,
  type CategoryListQuery,
} from '../../lib/admin';
import { toneClasses, toneNames } from '../../lib/tones';
import {
  AdminActionMenu,
  AdminAlertBanner,
  AdminBulkButton,
  AdminDefinitionGrid,
  AdminDetailAside,
  AdminDirectory,
  AdminEmptyState,
  AdminFeedback,
  AdminField,
  AdminFilterCard,
  AdminLinkGrid,
  AdminLoadingState,
  AdminMenuItem,
  AdminPageHeader,
  AdminPageShell,
  AdminPaginationBar,
  AdminSelect,
  AdminSelectedBar,
  AdminSplitLayout,
  AdminStatGrid,
  AdminStatusBadge,
  AdminTableHead,
  AdminTabs,
  AdminToolbarButton,
  formatDate,
  formatDateTime,
  inputClass,
  primaryButton,
} from './partials';

const emptyFilters: CategoryListQuery = {
  search: '',
  parent_id: '',
  roots: '',
  children: '',
  active: '',
  empty: '',
  kind: '',
  sort: 'position',
  per_page: 25,
  page: 1,
};

type Draft = {
  name: string;
  slug: string;
  tone: string;
  position: number;
  is_active: boolean;
  parent_id: number | '';
};

const blankDraft: Draft = {
  name: '',
  slug: '',
  tone: 'amber',
  position: 0,
  is_active: true,
  parent_id: '',
};

export function CategoriesManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<CategoryListQuery>(emptyFilters);
  const [query, setQuery] = useState<CategoryListQuery>(emptyFilters);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [tree, setTree] = useState<AdminCategoryTree[]>([]);
  const [stats, setStats] = useState<AdminCategoryStats | null>(null);
  const [parents, setParents] = useState<AdminCategoryList['parents']>([]);
  const [tones, setTones] = useState<string[]>(toneNames);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminCategoryDetail | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const loadList = useCallback(async (next: CategoryListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.categories(next);
      setCategories(data.categories);
      setTree(data.tree);
      setStats(data.stats);
      setMeta(data.meta);
      setParents(data.parents);
      setTones(data.tones);
      setSelectedIds([]);
      setExpanded((current) => (current.length > 0 ? current : data.tree.map((node) => node.id)));
      setActiveId((current) => current ?? data.categories[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.categoriesLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadList(filters);
  }, [filters, loadList]);

  useEffect(() => {
    if (creating || !activeId) {
      if (!creating) {
        setDetail(null);
      }
      return;
    }

    let cancelled = false;
    setDetailLoading(true);

    adminApi.category(activeId)
      .then((category) => {
        if (!cancelled) {
          setDetail(category);
          setDraft({
            name: category.name,
            slug: category.slug,
            tone: category.tone,
            position: category.position,
            is_active: category.is_active,
            parent_id: category.parent_id ?? '',
          });
        }
      })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });

    return () => { cancelled = true; };
  }, [activeId, creating]);

  function applyDraft(next: CategoryListQuery = { ...query, page: 1 }) {
    setQuery(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<CategoryListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = categories.map((category) => category.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  function startCreate() {
    setCreating(true);
    setDetail(null);
    setDraft(blankDraft);
    setNotice('');
  }

  function toggleExpanded(id: number) {
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function saveCategory() {
    if (!draft.name.trim()) {
      setError(t('admin.categoryNameRequired'));
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: draft.name.trim(),
      slug: draft.slug.trim() || undefined,
      tone: draft.tone,
      position: draft.position,
      is_active: draft.is_active,
      parent_id: draft.parent_id === '' ? null : Number(draft.parent_id),
    };

    try {
      const result = creating
        ? await adminApi.createCategory(payload)
        : await adminApi.updateCategory(detail!.id, payload);
      setNotice(result.message);
      setCreating(false);
      setActiveId(result.category.id);
      setDetail(result.category);
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
      setOpenAction(null);
    }
  }

  async function setActive(id: number, isActive: boolean) {
    setSaving(true);
    setError('');

    try {
      const result = await adminApi.updateCategory(id, { is_active: isActive });
      setNotice(result.message);
      if (activeId === id) {
        setDetail(result.category);
      }
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
      setOpenAction(null);
    }
  }

  async function applySelectedActive(isActive: boolean) {
    if (selectedIds.length === 0) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      for (const id of selectedIds) {
        await adminApi.updateCategory(id, { is_active: isActive });
      }
      setNotice(t('admin.categoryStatusUpdated'));
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.categoryStatTotal'), value: stats.total, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({}) },
    { key: 'active', label: t('admin.categoryStatActive'), value: stats.active, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ active: true }) },
    { key: 'hidden', label: t('admin.categoryStatHidden'), value: stats.inactive, tone: 'bg-slate-100 text-slate-700', onClick: () => applyStatFilter({ active: false }) },
    { key: 'roots', label: t('admin.categoryStatParents'), value: stats.roots, tone: 'bg-orange-100 text-orange-700', onClick: () => applyStatFilter({ roots: true }) },
    { key: 'children', label: t('admin.categoryStatChildren'), value: stats.children, tone: 'bg-blue-100 text-blue-700', onClick: () => applyStatFilter({ children: true }) },
    { key: 'empty', label: t('admin.categoryStatEmpty'), value: stats.empty, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ empty: true }) },
    { key: 'products', label: t('admin.categoryStatProducts'), value: stats.product_listings, tone: 'bg-orange-100 text-orange-800', href: '#admin-products' },
    { key: 'services', label: t('admin.categoryStatServices'), value: stats.service_listings, tone: 'bg-sky-100 text-sky-700', href: '#admin-services' },
  ] : [];

  const tabs: { label: string; query: Partial<CategoryListQuery>; count?: number }[] = [
    { label: t('admin.categoryTabAll'), query: {}, count: stats?.total },
    { label: t('admin.categoryStatActive'), query: { active: true }, count: stats?.active },
    { label: t('admin.categoryStatHidden'), query: { active: false }, count: stats?.inactive },
    { label: t('admin.categoryStatParents'), query: { roots: true }, count: stats?.roots },
    { label: t('admin.categoryStatChildren'), query: { children: true }, count: stats?.children },
    { label: t('admin.categoryTabProducts'), query: { kind: 'product' } },
    { label: t('admin.categoryTabServices'), query: { kind: 'service' } },
    { label: t('admin.categoryStatEmpty'), query: { empty: true }, count: stats?.empty },
  ];

  function tabActive(next: Partial<CategoryListQuery>): boolean {
    return (filters.kind ?? '') === (next.kind ?? '')
      && Boolean(filters.roots) === Boolean(next.roots)
      && Boolean(filters.children) === Boolean(next.children)
      && Boolean(filters.empty) === Boolean(next.empty)
      && (filters.active === undefined || filters.active === '' ? next.active === undefined || next.active === '' : filters.active === next.active);
  }

  function renderTree(nodes: AdminCategoryTree[], depth = 0) {
    return (
      <ul className={depth === 0 ? 'space-y-2' : 'ml-8 space-y-2 border-l border-slate-200 pb-1 pl-4'}>
        {nodes.map((node) => {
          const open = expanded.includes(node.id);
          const hasChildren = node.children.length > 0;

          return (
            <li key={node.id} className={depth === 0 ? 'rounded-xl border border-slate-200' : 'relative'}>
              {depth > 0 ? <span className="absolute -left-4 top-5 w-4 border-t border-slate-200" /> : null}
              <div className={`flex items-center gap-2 p-3 ${activeId === node.id ? 'bg-amber-50' : depth > 0 ? 'rounded-lg bg-slate-50' : ''}`}>
                {hasChildren ? (
                  <button type="button" onClick={() => toggleExpanded(node.id)} className="rounded p-1 hover:bg-white" aria-label={open ? t('admin.categoryCollapse') : t('admin.categoryExpand')}>
                    {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                ) : <span className="w-6" />}
                <button type="button" onClick={() => { setCreating(false); setActiveId(node.id); }} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses(node.tone).iconBox}`}><LayoutGrid className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <p className="font-bold">{node.name}</p>
                    <p className="text-xs text-slate-500">{t('admin.categoryTreeMeta', { products: node.product_listings, services: node.service_listings, stores: node.store_count })}</p>
                  </span>
                  <AdminStatusBadge label={node.is_active ? t('admin.categoryActive') : t('admin.categoryHidden')} tone={node.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} />
                </button>
              </div>
              {hasChildren && open ? renderTree(node.children, depth + 1) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.categoriesTitle')}
        intro={t('admin.categoriesIntro')}
        crumb={t('admin.navCategories')}
        badge={stats ? t('admin.categoriesTotal', { count: stats.total }) : undefined}
        icon={LayoutGrid}
        actions={(
          <>
            <AdminToolbarButton icon={Download}>{t('admin.exportCategories')}</AdminToolbarButton>
            <AdminToolbarButton icon={Upload}>{t('admin.importCategories')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} primary disabled={false} onClick={startCreate}>{t('admin.createCategory')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid
        variant="overview"
        title={t('admin.categoryOverviewTitle')}
        hint={t('admin.categoryOverviewHint')}
        icon={LayoutGrid}
        cards={statCards}
      />

      {stats && stats.empty > 0 ? (
        <AdminAlertBanner
          tone="orange"
          title={t('admin.categoryHealthTitle', { count: stats.empty })}
          intro={t('admin.categoryHealthIntro')}
          action={t('admin.categoryHealthLink')}
          onAction={() => applyStatFilter({ empty: true })}
        />
      ) : null}

      <AdminTabs
        tabs={tabs.map((tab) => ({
          key: tab.label,
          label: tab.label,
          count: tab.count,
          active: tabActive(tab.query),
          onClick: () => applyStatFilter(tab.query),
        }))}
      />

      <AdminFilterCard
        title={t('admin.categoryFilterTitle')}
        intro={t('admin.categoryFilterIntro')}
        onSubmit={() => applyDraft({ ...query, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        search={{
          value: query.search ?? '',
          onChange: (value) => setQuery((current) => ({ ...current, search: value })),
          placeholder: t('admin.categorySearchPlaceholder'),
        }}
      >
        <AdminField label={t('admin.categoryParent')}>
          <AdminSelect value={query.parent_id ?? ''} onChange={(value) => setQuery((current) => ({ ...current, parent_id: value ? Number(value) : '' }))}>
            <option value="">{t('admin.anyParent')}</option>
            {parents.map((parent) => <option key={parent.id} value={parent.id}>{parent.name}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.colStatus')}>
          <AdminSelect value={query.active === true ? '1' : query.active === false ? '0' : ''} onChange={(value) => setQuery((current) => ({ ...current, active: value === '' ? '' : value === '1' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            <option value="1">{t('admin.categoryActive')}</option>
            <option value="0">{t('admin.categoryHidden')}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.categoryAssignments')}>
          <AdminSelect
            value={query.empty === true ? 'empty' : query.kind || ''}
            onChange={(value) => {
              setQuery((current) => ({ ...current, empty: value === 'empty' || '', kind: value === 'product' || value === 'service' ? value : '' }));
            }}
          >
            <option value="">{t('admin.anyAssignment')}</option>
            <option value="product">{t('admin.categoryTabProducts')}</option>
            <option value="service">{t('admin.categoryTabServices')}</option>
            <option value="empty">{t('admin.categoryStatEmpty')}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterSort')}>
          <AdminSelect value={query.sort ?? 'position'} onChange={(value) => setQuery((current) => ({ ...current, sort: value as CategoryListQuery['sort'] }))}>
            <option value="position">{t('admin.categorySortPosition')}</option>
            <option value="name-asc">{t('admin.categorySortName')}</option>
            <option value="newest">{t('admin.categorySortNewest')}</option>
            <option value="updated">{t('admin.productSortUpdated')}</option>
          </AdminSelect>
        </AdminField>
      </AdminFilterCard>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">{t('admin.categoryHierarchyTitle')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('admin.categoryHierarchyIntro')}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setExpanded(tree.map((node) => node.id))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">{t('admin.categoryExpandAll')}</button>
            <button type="button" onClick={() => setExpanded([])} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">{t('admin.categoryCollapseAll')}</button>
          </div>
        </div>
        {loading ? (
          <AdminLoadingState label={t('common.loading')} />
        ) : tree.length === 0 ? (
          <AdminEmptyState>{t('admin.noCategories')}</AdminEmptyState>
        ) : renderTree(tree)}
      </section>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.categoryDirectoryTitle')}
          showing={t('admin.categoryDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.categorySelectPage')}
          selected={categories.length > 0 && categories.every((category) => selectedIds.includes(category.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.categorySelectedCount', { count: selectedIds.length })}>
              <AdminBulkButton tone="emerald" disabled={saving} onClick={() => void applySelectedActive(true)}>{t('admin.categoryActive')}</AdminBulkButton>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedActive(false)}>{t('admin.categoryHidden')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={categories.length === 0 ? t('admin.noCategories') : null}
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
              <th className="px-4 py-3"><input type="checkbox" checked={categories.every((category) => selectedIds.includes(category.id))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.navCategories')}</th>
              <th className="px-4 py-3">{t('admin.categoryParent')}</th>
              <th className="px-4 py-3">{t('admin.categoryLevel')}</th>
              <th className="px-4 py-3">{t('nav.products')}</th>
              <th className="px-4 py-3">{t('nav.services')}</th>
              <th className="px-4 py-3">{t('admin.navVendors')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3">{t('admin.colDate')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr key={category.id} className={`${selectedIds.includes(category.id) || activeId === category.id ? 'bg-amber-50/40' : ''} cursor-pointer hover:bg-amber-50`} onClick={() => { setCreating(false); setActiveId(category.id); }}>
                <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                  <input type="checkbox" checked={selectedIds.includes(category.id)} onChange={() => toggleSelected(category.id)} className="rounded border-slate-300 text-amber-600" />
                </td>
                <th className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses(category.tone).iconBox}`}><LayoutGrid className="h-5 w-5" /></span>
                    <div>
                      <p className="font-bold text-slate-950">{category.name}</p>
                      <p className="text-xs text-slate-500">{category.code} · /{category.slug}</p>
                    </div>
                  </div>
                </th>
                <td className="px-4 py-4">{category.parent?.name ?? t('admin.categoryNoParent')}</td>
                <td className="px-4 py-4">{category.level}</td>
                <td className="px-4 py-4">{category.product_listings}</td>
                <td className="px-4 py-4">{category.service_listings}</td>
                <td className="px-4 py-4">{category.store_count}</td>
                <td className="px-4 py-4"><AdminStatusBadge label={category.is_active ? t('admin.categoryActive') : t('admin.categoryHidden')} tone={category.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} /></td>
                <td className="px-4 py-4">{formatDate(category.updated_at, locale)}</td>
                <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                  <AdminActionMenu
                    open={openAction === category.id}
                    onToggle={() => setOpenAction((current) => (current === category.id ? null : category.id))}
                    onClose={() => setOpenAction(null)}
                    label={t('admin.actions')}
                  >
                    <AdminMenuItem onClick={() => { setCreating(false); setActiveId(category.id); setOpenAction(null); }}>{t('admin.viewCategory')}</AdminMenuItem>
                    {category.is_active
                      ? <AdminMenuItem onClick={() => void setActive(category.id, false)}>{t('admin.categoryHidden')}</AdminMenuItem>
                      : <AdminMenuItem tone="emerald" onClick={() => void setActive(category.id, true)}>{t('admin.categoryActive')}</AdminMenuItem>}
                  </AdminActionMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={creating ? t('admin.createCategory') : t('admin.categorySelectedTitle')}
          intro={creating ? t('admin.categoryCreateIntro') : t('admin.categorySelectedIntro')}
          loading={detailLoading && !creating}
          loadingLabel={t('common.loading')}
          empty={t('admin.categoryOverviewEmpty')}
          isEmpty={!creating && !detail}
        >
          <form onSubmit={(event) => { event.preventDefault(); void saveCategory(); }} className="space-y-4 p-5">
            {!creating && detail ? (
              <div className="text-center">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${toneClasses(detail.tone).iconBox}`}><LayoutGrid className="h-7 w-7" /></div>
                <h3 className="mt-3 text-lg font-bold">{detail.name}</h3>
                <p className="text-xs text-slate-400">{detail.code} · /{detail.slug}</p>
              </div>
            ) : null}
            <AdminField label={t('admin.categoryName')}>
              <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className={inputClass} />
            </AdminField>
            <AdminField label={t('admin.categorySlug')}>
              <input value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} className={inputClass} />
            </AdminField>
            <AdminField label={t('admin.categoryParent')}>
              <AdminSelect value={draft.parent_id} onChange={(value) => setDraft((current) => ({ ...current, parent_id: value ? Number(value) : '' }))}>
                <option value="">{t('admin.categoryNoParent')}</option>
                {parents.filter((parent) => parent.id !== detail?.id).map((parent) => <option key={parent.id} value={parent.id}>{parent.name}</option>)}
              </AdminSelect>
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label={t('admin.categoryTone')}>
                <AdminSelect value={draft.tone} onChange={(value) => setDraft((current) => ({ ...current, tone: value }))}>
                  {tones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
                </AdminSelect>
              </AdminField>
              <AdminField label={t('admin.categoryPosition')}>
                <input type="number" min={0} value={draft.position} onChange={(event) => setDraft((current) => ({ ...current, position: Number(event.target.value) }))} className={inputClass} />
              </AdminField>
            </div>
            <label className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
              <span>{t('admin.categoryActive')}</span>
              <input type="checkbox" checked={draft.is_active} onChange={(event) => setDraft((current) => ({ ...current, is_active: event.target.checked }))} className="rounded border-slate-300 text-amber-600" />
            </label>
            {!creating && detail ? (
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.categoryLevel'), value: detail.level },
                  { label: t('nav.products'), value: detail.product_listings },
                  { label: t('nav.services'), value: detail.service_listings },
                  { label: t('admin.navVendors'), value: detail.store_count },
                  { label: t('admin.categorySpanishName'), value: detail.spanish_name ?? t('admin.unavailable'), span: true },
                  { label: t('admin.colDate'), value: formatDateTime(detail.updated_at, locale), span: true },
                ]}
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={saving} className={primaryButton}>{creating ? t('admin.createCategory') : t('admin.saveCategory')}</button>
              {creating ? <button type="button" onClick={() => setCreating(false)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">{t('admin.clearFilters')}</button> : null}
            </div>
            {!creating ? (
              <div className="grid grid-cols-2 gap-2">
                <a href="#admin-products" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('nav.products')}</a>
                <a href="#admin-translations" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('admin.navTranslations')}</a>
              </div>
            ) : null}
          </form>
        </AdminDetailAside>
      </AdminSplitLayout>

      <AdminLinkGrid
        title={t('admin.categoryAdminLinks')}
        intro={t('admin.categoryAdminLinksIntro')}
        footnote={t('admin.categoryCommerceNotReady')}
        links={[
          { key: t('admin.categoryTabAll'), label: t('admin.categoryTabAll'), onClick: () => applyStatFilter({}) },
          { key: t('admin.categoryStatActive'), label: t('admin.categoryStatActive'), count: stats?.active, onClick: () => applyStatFilter({ active: true }) },
          { key: t('admin.categoryStatHidden'), label: t('admin.categoryStatHidden'), count: stats?.inactive, onClick: () => applyStatFilter({ active: false }) },
          { key: t('admin.categoryStatParents'), label: t('admin.categoryStatParents'), count: stats?.roots, onClick: () => applyStatFilter({ roots: true }) },
          { key: t('admin.categoryStatEmpty'), label: t('admin.categoryStatEmpty'), count: stats?.empty, onClick: () => applyStatFilter({ empty: true }) },
          { key: t('admin.categoryTabProducts'), label: t('admin.categoryTabProducts'), onClick: () => applyStatFilter({ kind: 'product' }) },
          { key: t('admin.categoryTabServices'), label: t('admin.categoryTabServices'), onClick: () => applyStatFilter({ kind: 'service' }) },
          { key: t('admin.navTranslations'), label: t('admin.navTranslations'), href: '#admin-translations' },
        ]}
      />
    </AdminPageShell>
  );
}

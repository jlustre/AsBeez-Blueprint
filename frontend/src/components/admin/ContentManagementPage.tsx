import { useCallback, useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Plus,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminContentItem,
  type AdminContentStats,
  type AdminContentTree,
  type ContentListQuery,
  type ContentType,
} from '../../lib/admin';
import {
  AdminActionMenu,
  AdminAlertBanner,
  AdminBulkButton,
  AdminDefinitionGrid,
  AdminDetailAside,
  AdminDirectory,
  AdminFeedback,
  AdminField,
  AdminFilterCard,
  AdminLinkGrid,
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
  formatDateTime,
  ghostButton,
} from './partials';

const emptyFilters: ContentListQuery = {
  search: '',
  type: '',
  active: '',
  translation: '',
  sort: 'position',
  per_page: 25,
  page: 1,
};

const typeLabel: Record<ContentType, MessageKey> = {
  'nav-links': 'admin.contentTypeNav',
  'policy-types': 'admin.contentTypePolicy',
  'setting-definitions': 'admin.contentTypeSetting',
  'social-platforms': 'admin.contentTypeSocial',
  'notification-topics': 'admin.contentTypeTopic',
  'notification-channels': 'admin.contentTypeChannel',
  categories: 'admin.contentTypeCategory',
};

const typeTone: Record<ContentType, string> = {
  'nav-links': 'bg-amber-100 text-amber-800',
  'policy-types': 'bg-slate-100 text-slate-700',
  'setting-definitions': 'bg-indigo-100 text-indigo-700',
  'social-platforms': 'bg-pink-100 text-pink-700',
  'notification-topics': 'bg-sky-100 text-sky-700',
  'notification-channels': 'bg-blue-100 text-blue-700',
  categories: 'bg-orange-100 text-orange-800',
};

function itemKey(item: Pick<AdminContentItem, 'type' | 'id'>): string {
  return `${item.type}:${item.id}`;
}

export function ContentManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<ContentListQuery>(emptyFilters);
  const [query, setQuery] = useState<ContentListQuery>(emptyFilters);
  const [items, setItems] = useState<AdminContentItem[]>([]);
  const [tree, setTree] = useState<AdminContentTree[]>([]);
  const [stats, setStats] = useState<AdminContentStats | null>(null);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminContentItem | null>(null);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [openAction, setOpenAction] = useState<string | null>(null);

  const loadList = useCallback(async (next: ContentListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.content(next);
      setItems(data.items);
      setTree(data.tree);
      setStats(data.stats);
      setMeta(data.meta);
      setSelectedKeys([]);
      setExpanded((current) => (current.length > 0 ? current : data.tree.map((node) => node.context)));
      setActiveKey((current) => current ?? (data.items[0] ? itemKey(data.items[0]) : null));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.contentLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadList(filters);
  }, [filters, loadList]);

  useEffect(() => {
    if (!activeKey) {
      setDetail(null);
      return;
    }

    const [type, id] = activeKey.split(':') as [ContentType, string];
    let cancelled = false;
    setDetailLoading(true);

    adminApi.contentItem(type, Number(id))
      .then((item) => {
        if (!cancelled) {
          setDetail(item);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeKey]);

  function applyDraft(next: ContentListQuery = { ...query, page: 1 }) {
    setQuery(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<ContentListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(key: string) {
    setSelectedKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  }

  function togglePage() {
    const keys = items.map(itemKey);
    const allSelected = keys.every((key) => selectedKeys.includes(key));
    setSelectedKeys(allSelected ? [] : keys);
  }

  async function setActive(type: ContentType, id: number, isActive: boolean) {
    setSaving(true);
    setError('');

    try {
      const result = await adminApi.updateContentVisibility(type, id, isActive);
      setNotice(result.message || t('admin.contentVisibilityUpdated'));
      setDetail(result.item);
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
      setOpenAction(null);
    }
  }

  async function applySelectedActive(isActive: boolean) {
    const selected = items.filter((item) => selectedKeys.includes(itemKey(item)) && item.can_toggle);

    if (selected.length === 0) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      for (const item of selected) {
        await adminApi.updateContentVisibility(item.type, item.id, isActive);
      }
      setNotice(t('admin.contentVisibilityUpdated'));
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  }

  function tabActive(next: Partial<ContentListQuery>): boolean {
    return (filters.type ?? '') === (next.type ?? '');
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.contentStatTotal'), value: stats.total, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({}) },
    { key: 'nav', label: t('admin.contentStatNavigation'), value: stats.navigation, tone: 'bg-orange-100 text-orange-700', onClick: () => applyStatFilter({ type: 'nav-links' }) },
    { key: 'policies', label: t('admin.contentStatPolicies'), value: stats.policies, tone: 'bg-slate-100 text-slate-700', onClick: () => applyStatFilter({ type: 'policy-types' }) },
    { key: 'settings', label: t('admin.contentStatSettings'), value: stats.settings, tone: 'bg-indigo-100 text-indigo-700', onClick: () => applyStatFilter({ type: 'setting-definitions' }) },
    { key: 'social', label: t('admin.contentStatSocial'), value: stats.social, tone: 'bg-pink-100 text-pink-700', onClick: () => applyStatFilter({ type: 'social-platforms' }) },
    { key: 'notes', label: t('admin.contentStatNotifications'), value: stats.notifications, tone: 'bg-sky-100 text-sky-700', onClick: () => applyStatFilter({ type: 'notifications' }) },
    { key: 'categories', label: t('admin.contentStatCategories'), value: stats.categories, tone: 'bg-orange-100 text-orange-800', href: '#admin-categories' },
    { key: 'missing', label: t('admin.contentStatMissing'), value: stats.missing_fields, tone: 'bg-rose-100 text-rose-700', href: '#admin-translations' },
  ] : [];

  const tabs: { label: string; query: Partial<ContentListQuery>; count?: number }[] = [
    { label: t('admin.contentTabAll'), query: {}, count: stats?.total },
    { label: t('admin.contentTabNavigation'), query: { type: 'nav-links' }, count: stats?.navigation },
    { label: t('admin.contentTabPolicies'), query: { type: 'policy-types' }, count: stats?.policies },
    { label: t('admin.contentTabSettings'), query: { type: 'setting-definitions' }, count: stats?.settings },
    { label: t('admin.contentTabSocial'), query: { type: 'social-platforms' }, count: stats?.social },
    { label: t('admin.contentTabNotifications'), query: { type: 'notifications' }, count: stats?.notifications },
    { label: t('admin.contentTabCategories'), query: { type: 'categories' }, count: stats?.categories },
  ];

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.contentTitle')}
        intro={t('admin.contentIntro')}
        crumb={t('admin.navContentCms')}
        badge={stats ? t('admin.contentTotal', { count: stats.total }) : undefined}
        icon={FileText}
        actions={(
          <>
            <a href="#marketplace" className={ghostButton}>
              {t('admin.viewWebsite')}
              <ExternalLink className="h-4 w-4" />
            </a>
            <AdminToolbarButton icon={Download}>{t('admin.exportContent')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} primary>{t('admin.createContent')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid
        variant="overview"
        title={t('admin.contentOverviewTitle')}
        hint={t('admin.contentOverviewHint')}
        icon={FileText}
        cards={statCards}
      />

      {stats && stats.missing_fields > 0 ? (
        <AdminAlertBanner
          tone="orange"
          title={t('admin.contentHealthTitle', { count: stats.missing_fields })}
          intro={t('admin.contentHealthIntro')}
          action={t('admin.contentHealthLink')}
          onAction={() => { window.location.hash = '#admin-translations'; }}
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
        title={t('admin.contentFilterTitle')}
        intro={t('admin.contentFilterIntro')}
        onSubmit={() => applyDraft({ ...query, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        search={{
          value: query.search ?? '',
          onChange: (value) => setQuery((current) => ({ ...current, search: value })),
          placeholder: t('admin.contentSearchPlaceholder'),
        }}
      >
        <AdminField label={t('admin.contentType')}>
          <AdminSelect value={query.type ?? ''} onChange={(value) => setQuery((current) => ({ ...current, type: value as ContentType | '' }))}>
            <option value="">{t('admin.allContentTypes')}</option>
            {(Object.keys(typeLabel) as ContentType[]).map((type) => <option key={type} value={type}>{t(typeLabel[type])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.colStatus')}>
          <AdminSelect value={query.active === true ? '1' : query.active === false ? '0' : ''} onChange={(value) => setQuery((current) => ({ ...current, active: value === '' ? '' : value === '1' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            <option value="1">{t('admin.categoryActive')}</option>
            <option value="0">{t('admin.categoryHidden')}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.contentTranslation')}>
          <AdminSelect value={query.translation ?? ''} onChange={(value) => setQuery((current) => ({ ...current, translation: value as ContentListQuery['translation'] }))}>
            <option value="">{t('admin.anyTranslation')}</option>
            <option value="complete">{t('admin.translationComplete')}</option>
            <option value="incomplete">{t('admin.translationIncomplete')}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterSort')}>
          <AdminSelect value={query.sort ?? 'position'} onChange={(value) => setQuery((current) => ({ ...current, sort: value as ContentListQuery['sort'] }))}>
            <option value="position">{t('admin.contentSortPosition')}</option>
            <option value="name-asc">{t('admin.categorySortName')}</option>
            <option value="newest">{t('admin.sortNewest')}</option>
            <option value="updated">{t('admin.productSortUpdated')}</option>
          </AdminSelect>
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.contentDirectoryTitle')}
          showing={t('admin.contentDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.contentSelectPage')}
          selected={items.length > 0 && items.every((item) => selectedKeys.includes(itemKey(item)))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedKeys.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.contentSelectedCount', { count: selectedKeys.length })}>
              <AdminBulkButton tone="emerald" disabled={saving} onClick={() => void applySelectedActive(true)}>{t('admin.categoryActive')}</AdminBulkButton>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedActive(false)}>{t('admin.categoryHidden')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedKeys([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={items.length === 0 ? t('admin.noContent') : null}
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
              <th className="px-4 py-3"><input type="checkbox" checked={items.length > 0 && items.every((item) => selectedKeys.includes(itemKey(item)))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.contentColContent')}</th>
              <th className="px-4 py-3">{t('admin.contentColType')}</th>
              <th className="px-4 py-3">{t('admin.contentColGroup')}</th>
              <th className="px-4 py-3">{t('admin.contentColLanguage')}</th>
              <th className="px-4 py-3">{t('admin.contentColUpdated')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const key = itemKey(item);
              const selected = selectedKeys.includes(key) || activeKey === key;

              return (
                <tr key={key} className={`${selected ? 'bg-amber-50/40' : ''} cursor-pointer hover:bg-amber-50`} onClick={() => setActiveKey(key)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selectedKeys.includes(key)} onChange={() => toggleSelected(key)} className="rounded border-slate-300 text-amber-600" />
                  </td>
                  <th className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeTone[item.type]}`}><FileText className="h-5 w-5" /></span>
                      <div>
                        <p className="font-bold text-slate-950">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.code} · {item.identifier}</p>
                      </div>
                    </div>
                  </th>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(typeLabel[item.type])} tone={typeTone[item.type]} /></td>
                  <td className="px-4 py-4">{item.group ?? t('admin.unavailable')}</td>
                  <td className="px-4 py-4">{item.translation.locale.toUpperCase()} · {item.translation.done}/{item.translation.total}</td>
                  <td className="px-4 py-4">{formatDateTime(item.updated_at, locale)}</td>
                  <td className="px-4 py-4"><AdminStatusBadge label={item.is_active ? t('admin.categoryActive') : t('admin.categoryHidden')} tone={item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} /></td>
                  <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <AdminActionMenu
                      open={openAction === key}
                      onToggle={() => setOpenAction((current) => (current === key ? null : key))}
                      onClose={() => setOpenAction(null)}
                      label={t('admin.actions')}
                    >
                      <AdminMenuItem onClick={() => { setActiveKey(key); setOpenAction(null); }}>{t('admin.viewContent')}</AdminMenuItem>
                      {item.type === 'categories' ? <AdminMenuItem onClick={() => { window.location.hash = '#admin-categories'; }}>{t('admin.contentOpenCategories')}</AdminMenuItem> : null}
                      <AdminMenuItem onClick={() => { window.location.hash = '#admin-translations'; }}>{t('admin.contentOpenTranslations')}</AdminMenuItem>
                      {item.can_toggle
                        ? item.is_active
                          ? <AdminMenuItem onClick={() => void setActive(item.type, item.id, false)}>{t('admin.hideContent')}</AdminMenuItem>
                          : <AdminMenuItem tone="emerald" onClick={() => void setActive(item.type, item.id, true)}>{t('admin.showContent')}</AdminMenuItem>
                        : null}
                    </AdminActionMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={t('admin.contentSelectedTitle')}
          intro={t('admin.contentSelectedIntro')}
          loading={detailLoading}
          loadingLabel={t('common.loading')}
          empty={t('admin.contentOverviewEmpty')}
          isEmpty={!detail}
        >
          {detail ? (
            <>
              <div className="p-5 text-center">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${typeTone[detail.type]}`}><FileText className="h-7 w-7" /></div>
                <h3 className="mt-3 text-lg font-bold">{detail.title}</h3>
                <p className="text-xs text-slate-400">{detail.code} · {detail.identifier}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <AdminStatusBadge label={t(typeLabel[detail.type])} tone={typeTone[detail.type]} />
                  <AdminStatusBadge label={detail.is_active ? t('admin.categoryActive') : t('admin.categoryHidden')} tone={detail.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} />
                </div>
              </div>
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.contentIdentifier'), value: detail.identifier },
                  { label: t('admin.contentGroup'), value: detail.group ?? t('admin.unavailable') },
                  { label: t('admin.contentContext'), value: detail.context ?? t('admin.unavailable') },
                  { label: t('admin.contentTranslationProgress'), value: `${detail.translation.done}/${detail.translation.total} (${detail.translation.percent}%)` },
                  { label: t('admin.colDate'), value: formatDateTime(detail.updated_at, locale), span: true },
                  { label: t('admin.contentHint'), value: detail.hint ?? t('admin.unavailable'), span: true },
                ]}
              />
              <div className="grid grid-cols-2 gap-2 p-5">
                <a href="#admin-translations" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('admin.navTranslations')}</a>
                {detail.type === 'categories'
                  ? <a href="#admin-categories" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('admin.navCategories')}</a>
                  : detail.can_toggle
                    ? <button type="button" disabled={saving} onClick={() => void setActive(detail.type, detail.id, !detail.is_active)} className="rounded-lg border px-3 py-2 text-xs font-bold hover:bg-amber-50">
                        {detail.is_active ? t('admin.hideContent') : t('admin.showContent')}
                      </button>
                    : <span className="rounded-lg border border-dashed px-3 py-2 text-center text-xs text-slate-500">{t('admin.contentCannotHide')}</span>}
              </div>
            </>
          ) : null}
        </AdminDetailAside>
      </AdminSplitLayout>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">{t('admin.contentTreeTitle')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('admin.contentTreeIntro')}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setExpanded(tree.map((node) => node.context))} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">{t('admin.categoryExpandAll')}</button>
            <button type="button" onClick={() => setExpanded([])} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">{t('admin.categoryCollapseAll')}</button>
          </div>
        </div>
        <ul className="space-y-3">
          {tree.map((branch) => {
            const open = expanded.includes(branch.context);

            return (
              <li key={branch.context} className="rounded-xl border border-slate-200">
                <button type="button" onClick={() => setExpanded((current) => (current.includes(branch.context) ? current.filter((item) => item !== branch.context) : [...current, branch.context]))} className="flex w-full items-center gap-2 p-3 text-left">
                  {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="font-bold capitalize">{branch.context}</span>
                  <span className="text-xs text-slate-500">{t('admin.contentTreeGroups', { count: branch.groups.length })}</span>
                </button>
                {open ? (
                  <ul className="space-y-2 border-t border-slate-100 p-3">
                    {branch.groups.map((group) => (
                      <li key={group.name} className="rounded-lg bg-slate-50 p-3">
                        <p className="text-sm font-semibold">{group.name} <span className="font-normal text-slate-500">{t('admin.contentTreeItems', { count: group.items.length })}</span></p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {group.items.slice(0, 8).map((item) => (
                            <li key={item.id} className="flex items-center justify-between gap-2">
                              <button type="button" onClick={() => setActiveKey(`nav-links:${item.id}`)} className="text-left hover:text-amber-700">{item.title}</button>
                              <AdminStatusBadge label={item.is_active ? t('admin.categoryActive') : t('admin.categoryHidden')} tone={item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} />
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <AdminLinkGrid
        title={t('admin.contentAdminLinks')}
        intro={t('admin.contentAdminLinksIntro')}
        footnote={t('admin.contentCommerceNotReady')}
        links={[
          { key: 'all', label: t('admin.contentTabAll'), onClick: () => applyStatFilter({}) },
          { key: 'nav', label: t('admin.contentTabNavigation'), count: stats?.navigation, onClick: () => applyStatFilter({ type: 'nav-links' }) },
          { key: 'missing', label: t('admin.contentStatMissing'), count: stats?.missing_fields, href: '#admin-translations' },
          { key: 'categories', label: t('admin.navCategories'), count: stats?.categories, href: '#admin-categories' },
          { key: 'translations', label: t('admin.navTranslations'), href: '#admin-translations' },
          { key: 'inactive', label: t('admin.categoryStatHidden'), count: stats?.inactive, onClick: () => applyStatFilter({ active: false }) },
        ]}
      />
    </AdminPageShell>
  );
}

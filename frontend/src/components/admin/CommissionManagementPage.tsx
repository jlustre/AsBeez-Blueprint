import { useCallback, useEffect, useState } from 'react';
import {
  Download,
  Percent,
  Plus,
  Settings,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminCommission,
  type AdminCommissionDetail,
  type AdminCommissionEvent,
  type AdminCommissionList,
  type AdminCommissionStats,
  type CommissionCalc,
  type CommissionListQuery,
  type CommissionScope,
  type CommissionSettings,
  type CommissionStatus,
  type CommissionStoredStatus,
} from '../../lib/admin';
import { categoryOptions, indentOption } from '../../lib/categories';
import {
  AdminActionMenu,
  AdminActivityCard,
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
  AdminNotesCard,
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
  formatMoney,
  inputClass,
  primaryButton,
} from './partials';

const emptyFilters: CommissionListQuery = {
  search: '',
  status: '',
  calculation_type: '',
  applies_to: '',
  category_id: '',
  store_id: '',
  attention: '',
  sort: 'priority',
  per_page: 25,
  page: 1,
};

const emptySettings: CommissionSettings = {
  global_rate: null,
  product_rate: null,
  service_rate: null,
  fixed_fee: null,
  min_commission: null,
  max_commission: null,
  tax_treatment: 'exclude',
  discount_treatment: 'after',
  reserve_days: null,
  rounding: 'half_up',
  currency: 'USD',
  include_shipping: false,
  include_taxes: false,
  auto_refund_reversal: false,
  allow_negative_balances: false,
  approve_adjustments: false,
};

type Draft = {
  name: string;
  description: string;
  status: CommissionStoredStatus;
  calculation_type: CommissionCalc;
  percentage_rate: string;
  fixed_amount: string;
  min_commission: string;
  max_commission: string;
  applies_to: CommissionScope;
  category_id: number | '';
  store_id: number | '';
  priority: number;
  starts_at: string;
  ends_at: string;
  min_order_value: string;
  max_order_value: string;
  tax_treatment: 'exclude' | 'include';
  shipping_treatment: 'exclude' | 'include';
  discount_treatment: 'after' | 'before';
  refund_treatment: 'proportional' | 'full' | 'retain' | 'manual';
  notes: string;
};

const blankDraft: Draft = {
  name: '',
  description: '',
  status: 'draft',
  calculation_type: 'percentage',
  percentage_rate: '',
  fixed_amount: '',
  min_commission: '',
  max_commission: '',
  applies_to: 'all_vendors',
  category_id: '',
  store_id: '',
  priority: 100,
  starts_at: '',
  ends_at: '',
  min_order_value: '',
  max_order_value: '',
  tax_treatment: 'exclude',
  shipping_treatment: 'exclude',
  discount_treatment: 'after',
  refund_treatment: 'proportional',
  notes: '',
};

const statusTone: Record<CommissionStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  active: 'bg-emerald-100 text-emerald-700',
  scheduled: 'bg-blue-100 text-blue-700',
  disabled: 'bg-orange-100 text-orange-700',
  expired: 'bg-rose-100 text-rose-700',
};

const statusLabel: Record<CommissionStatus, MessageKey> = {
  draft: 'admin.commissionStatusDraft',
  active: 'admin.commissionStatusActive',
  scheduled: 'admin.commissionStatusScheduled',
  disabled: 'admin.commissionStatusDisabled',
  expired: 'admin.commissionStatusExpired',
};

const calcLabel: Record<CommissionCalc, MessageKey> = {
  percentage: 'admin.commissionCalcPercent',
  fixed: 'admin.commissionCalcFixed',
  percentage_plus_fixed: 'admin.commissionCalcBoth',
};

const scopeLabel: Record<CommissionScope, MessageKey> = {
  all_vendors: 'admin.commissionScopeAll',
  selected_vendors: 'admin.commissionScopeVendor',
  products: 'admin.commissionScopeProducts',
  services: 'admin.commissionScopeServices',
  categories: 'admin.commissionScopeCategories',
};

function numberOrNull(value: string): number | null {
  return value === '' ? null : Number(value);
}

function toDraft(rule: AdminCommissionDetail): Draft {
  return {
    name: rule.name,
    description: rule.description ?? '',
    status: rule.status,
    calculation_type: rule.calculation_type,
    percentage_rate: rule.percentage_rate === null ? '' : String(rule.percentage_rate),
    fixed_amount: rule.fixed_amount === null ? '' : String(rule.fixed_amount),
    min_commission: rule.min_commission === null ? '' : String(rule.min_commission),
    max_commission: rule.max_commission === null ? '' : String(rule.max_commission),
    applies_to: rule.applies_to,
    category_id: rule.category?.id ?? '',
    store_id: rule.store?.id ?? '',
    priority: rule.priority,
    starts_at: rule.starts_at ?? '',
    ends_at: rule.ends_at ?? '',
    min_order_value: rule.min_order_value === null ? '' : String(rule.min_order_value),
    max_order_value: rule.max_order_value === null ? '' : String(rule.max_order_value),
    tax_treatment: rule.tax_treatment,
    shipping_treatment: rule.shipping_treatment,
    discount_treatment: rule.discount_treatment,
    refund_treatment: rule.refund_treatment,
    notes: rule.notes ?? '',
  };
}

function appliesLabel(rule: AdminCommission, t: (key: MessageKey) => string): string {
  if (rule.applies_to === 'categories') {
    return rule.category?.name ?? t('admin.commissionScopeCategories');
  }

  if (rule.applies_to === 'selected_vendors') {
    return rule.store?.name ?? t('admin.commissionScopeVendor');
  }

  return t(scopeLabel[rule.applies_to]);
}

export function CommissionManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<CommissionListQuery>(emptyFilters);
  const [query, setQuery] = useState<CommissionListQuery>(emptyFilters);
  const [rules, setRules] = useState<AdminCommission[]>([]);
  const [stats, setStats] = useState<AdminCommissionStats | null>(null);
  const [settings, setSettings] = useState<CommissionSettings>(emptySettings);
  const [settingsDraft, setSettingsDraft] = useState<CommissionSettings>(emptySettings);
  const [entries, setEntries] = useState<AdminCommissionList['entries']>([]);
  const [categories, setCategories] = useState<AdminCommissionList['categories']>([]);
  const [stores, setStores] = useState<AdminCommissionList['stores']>([]);
  const [events, setEvents] = useState<AdminCommissionEvent[]>([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminCommissionDetail | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const loadList = useCallback(async (next: CommissionListQuery) => {
    setError('');
    setLoading(true);

    try {
      const [data, activity] = await Promise.all([
        adminApi.commissions(next),
        adminApi.commissionEvents(8),
      ]);
      setRules(data.rules);
      setStats(data.stats);
      setSettings(data.settings);
      setSettingsDraft(data.settings);
      setEntries(data.entries);
      setCategories(data.categories);
      setStores(data.stores);
      setMeta(data.meta);
      setEvents(activity.events);
      setSelectedIds([]);
      setActiveId((current) => current ?? data.rules[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.commissionsLoadFailed'));
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

    adminApi.commissionRule(activeId)
      .then((rule) => {
        if (!cancelled) {
          setDetail(rule);
          setDraft(toDraft(rule));
        }
      })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });

    return () => { cancelled = true; };
  }, [activeId, creating]);

  function applyDraft(next: CommissionListQuery = { ...query, page: 1 }) {
    setQuery(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<CommissionListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = rules.map((rule) => rule.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter((id) => !ids.includes(id)) : [...new Set([...selectedIds, ...ids])]);
  }

  function startCreate() {
    setCreating(true);
    setActiveId(null);
    setDetail(null);
    setDraft(blankDraft);
    setNote('');
    requestAnimationFrame(() => document.getElementById('rule-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function payloadFromDraft() {
    return {
      name: draft.name.trim(),
      description: draft.description.trim() || null,
      status: draft.status,
      calculation_type: draft.calculation_type,
      percentage_rate: numberOrNull(draft.percentage_rate),
      fixed_amount: numberOrNull(draft.fixed_amount),
      min_commission: numberOrNull(draft.min_commission),
      max_commission: numberOrNull(draft.max_commission),
      applies_to: draft.applies_to,
      category_id: draft.applies_to === 'categories' && draft.category_id !== '' ? Number(draft.category_id) : null,
      store_id: draft.applies_to === 'selected_vendors' && draft.store_id !== '' ? Number(draft.store_id) : null,
      priority: draft.priority,
      starts_at: draft.starts_at || null,
      ends_at: draft.ends_at || null,
      min_order_value: numberOrNull(draft.min_order_value),
      max_order_value: numberOrNull(draft.max_order_value),
      tax_treatment: draft.tax_treatment,
      shipping_treatment: draft.shipping_treatment,
      discount_treatment: draft.discount_treatment,
      refund_treatment: draft.refund_treatment,
      notes: draft.notes.trim() || null,
    };
  }

  async function saveRule() {
    if (!draft.name.trim()) {
      setError(t('admin.commissionNameRequired'));
      return;
    }

    setSaving(true);
    setError('');

    try {
      const result = creating
        ? await adminApi.createCommissionRule(payloadFromDraft())
        : await adminApi.updateCommissionRule(activeId as number, payloadFromDraft());
      setNotice(result.message);
      setCreating(false);
      setActiveId(result.rule.id);
      setDetail(result.rule);
      setDraft(toDraft(result.rule));
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('admin.commissionsLoadFailed'));
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: number, status: CommissionStoredStatus) {
    setSaving(true);
    setError('');

    try {
      const result = await adminApi.updateCommissionStatus(id, status);
      setNotice(result.message);
      if (activeId === id) {
        setDetail(result.rule);
        setDraft(toDraft(result.rule));
      }
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('admin.commissionsLoadFailed'));
    } finally {
      setSaving(false);
      setOpenAction(null);
    }
  }

  async function applySelectedStatus(status: CommissionStoredStatus) {
    setSaving(true);
    setError('');

    try {
      await Promise.all(selectedIds.map((id) => adminApi.updateCommissionStatus(id, status)));
      setNotice(t('admin.commissionStatusUpdated'));
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('admin.commissionsLoadFailed'));
    } finally {
      setSaving(false);
    }
  }

  async function saveNote() {
    if (!activeId || !note.trim()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const result = await adminApi.addCommissionNote(activeId, note.trim());
      setNotice(result.message);
      setNote('');
      setDetail(result.rule);
      await loadList(filters);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('admin.commissionsLoadFailed'));
    } finally {
      setSaving(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    setError('');

    try {
      const result = await adminApi.updateCommissionSettings(settingsDraft);
      setNotice(result.message);
      setSettings(result.settings);
      setSettingsDraft(result.settings);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('admin.commissionsLoadFailed'));
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { label: t('admin.commissionTabAll'), query: {}, count: stats?.total },
    { label: t('admin.commissionStatusActive'), query: { status: 'active' as const }, count: stats?.active },
    { label: t('admin.commissionStatusScheduled'), query: { status: 'scheduled' as const }, count: stats?.scheduled },
    { label: t('admin.commissionStatusDraft'), query: { status: 'draft' as const }, count: stats?.draft },
    { label: t('admin.commissionStatusExpired'), query: { status: 'expired' as const }, count: stats?.expired },
  ];

  function tabActive(partial: Partial<CommissionListQuery>) {
    if (!partial.status) {
      return !filters.status && !filters.attention;
    }

    return filters.status === partial.status;
  }

  const statCards = [
    { key: 'total', label: t('admin.commissionStatTotal'), value: stats?.total ?? 0, tone: 'bg-amber-100 text-amber-800', onClick: () => applyStatFilter({}) },
    { key: 'active', label: t('admin.commissionStatActive'), value: stats?.active ?? 0, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ status: 'active' }) },
    { key: 'scheduled', label: t('admin.commissionStatScheduled'), value: stats?.scheduled ?? 0, tone: 'bg-blue-100 text-blue-700', onClick: () => applyStatFilter({ status: 'scheduled' }) },
    { key: 'draft', label: t('admin.commissionStatDraft'), value: stats?.draft ?? 0, tone: 'bg-slate-100 text-slate-700', onClick: () => applyStatFilter({ status: 'draft' }) },
    { key: 'expired', label: t('admin.commissionStatExpired'), value: stats?.expired ?? 0, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ status: 'expired' }) },
    { key: 'vendors', label: t('admin.commissionStatVendors'), value: stats?.selected_vendors ?? 0, tone: 'bg-fuchsia-100 text-fuchsia-700', onClick: () => applyStatFilter({ applies_to: 'selected_vendors' }) },
    { key: 'categories', label: t('admin.commissionStatCategories'), value: stats?.categories ?? 0, tone: 'bg-orange-100 text-orange-800', onClick: () => applyStatFilter({ applies_to: 'categories' }) },
    { key: 'rate', label: t('admin.commissionStatAverage'), value: stats?.average_rate === null || stats?.average_rate === undefined ? t('admin.unavailable') : `${stats.average_rate}%`, tone: 'bg-cyan-100 text-cyan-700', onClick: () => applyStatFilter({ status: 'active' }) },
  ];

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.commissionsTitle')}
        intro={t('admin.commissionsIntro')}
        crumb={t('admin.navCommissions')}
        badge={t('admin.commissionsTotal', { count: stats?.total ?? 0 })}
        icon={Percent}
        actions={(
          <>
            <AdminToolbarButton icon={Settings} disabled={false} onClick={() => document.getElementById('commission-settings')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('admin.commissionSettings')}
            </AdminToolbarButton>
            <AdminToolbarButton icon={Download}>{t('admin.exportCommissions')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} primary disabled={false} onClick={startCreate}>{t('admin.createCommissionRule')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid
        variant="overview"
        title={t('admin.commissionOverviewTitle')}
        hint={t('admin.commissionOverviewHint')}
        icon={Percent}
        cards={statCards}
      />

      {stats && stats.attention > 0 ? (
        <AdminAlertBanner
          tone="orange"
          title={t('admin.commissionHealthTitle', { count: stats.attention })}
          intro={t('admin.commissionHealthIntro')}
          action={t('admin.commissionHealthLink')}
          onAction={() => applyStatFilter({ status: 'expired' })}
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
        title={t('admin.commissionFilterTitle')}
        intro={t('admin.commissionFilterIntro')}
        onSubmit={() => applyDraft({ ...query, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        search={{
          value: query.search ?? '',
          onChange: (value) => setQuery((current) => ({ ...current, search: value })),
          placeholder: t('admin.commissionSearchPlaceholder'),
        }}
      >
        <AdminField label={t('admin.colStatus')}>
          <AdminSelect value={query.status ?? ''} onChange={(value) => setQuery((current) => ({ ...current, status: value as CommissionListQuery['status'] }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            {(['draft', 'active', 'scheduled', 'disabled', 'expired'] as CommissionStatus[]).map((status) => (
              <option key={status} value={status}>{t(statusLabel[status])}</option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.commissionAppliesTo')}>
          <AdminSelect value={query.applies_to ?? ''} onChange={(value) => setQuery((current) => ({ ...current, applies_to: value as CommissionListQuery['applies_to'] }))}>
            <option value="">{t('admin.allCommissionScopes')}</option>
            {(Object.keys(scopeLabel) as CommissionScope[]).map((scope) => (
              <option key={scope} value={scope}>{t(scopeLabel[scope])}</option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.commissionCalcType')}>
          <AdminSelect value={query.calculation_type ?? ''} onChange={(value) => setQuery((current) => ({ ...current, calculation_type: value as CommissionListQuery['calculation_type'] }))}>
            <option value="">{t('admin.allCommissionCalcs')}</option>
            {(Object.keys(calcLabel) as CommissionCalc[]).map((type) => (
              <option key={type} value={type}>{t(calcLabel[type])}</option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterSort')}>
          <AdminSelect value={query.sort ?? 'priority'} onChange={(value) => setQuery((current) => ({ ...current, sort: value as CommissionListQuery['sort'] }))}>
            <option value="priority">{t('admin.commissionSortPriority')}</option>
            <option value="name-asc">{t('admin.commissionSortName')}</option>
            <option value="newest">{t('admin.commissionSortNewest')}</option>
            <option value="updated">{t('admin.productSortUpdated')}</option>
            <option value="rate-high">{t('admin.commissionSortRateHigh')}</option>
            <option value="rate-low">{t('admin.commissionSortRateLow')}</option>
          </AdminSelect>
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.commissionDirectoryTitle')}
          showing={t('admin.commissionDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.commissionSelectPage')}
          selected={rules.length > 0 && rules.every((rule) => selectedIds.includes(rule.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.commissionSelectedCount', { count: selectedIds.length })}>
              <AdminBulkButton tone="emerald" disabled={saving} onClick={() => void applySelectedStatus('active')}>{t('admin.commissionStatusActive')}</AdminBulkButton>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedStatus('disabled')}>{t('admin.commissionStatusDisabled')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={rules.length === 0 ? t('admin.noCommissions') : null}
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
              <th className="px-4 py-3"><input type="checkbox" checked={rules.length > 0 && rules.every((rule) => selectedIds.includes(rule.id))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.commissionColRule')}</th>
              <th className="px-4 py-3">{t('admin.commissionAppliesTo')}</th>
              <th className="px-4 py-3">{t('admin.commissionCalcType')}</th>
              <th className="px-4 py-3">{t('admin.commissionRate')}</th>
              <th className="px-4 py-3">{t('admin.commissionPriority')}</th>
              <th className="px-4 py-3">{t('admin.commissionEffective')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3">{t('admin.colDate')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <tr key={rule.id} className={`${selectedIds.includes(rule.id) || activeId === rule.id ? 'bg-amber-50/40' : ''} cursor-pointer hover:bg-amber-50`} onClick={() => { setCreating(false); setActiveId(rule.id); }}>
                <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                  <input type="checkbox" checked={selectedIds.includes(rule.id)} onChange={() => toggleSelected(rule.id)} className="rounded border-slate-300 text-amber-600" />
                </td>
                <th className="px-4 py-4">
                  <p className="font-bold text-slate-950">{rule.name}</p>
                  <p className="text-xs text-slate-500">{rule.code}</p>
                </th>
                <td className="px-4 py-4">{appliesLabel(rule, t)}</td>
                <td className="px-4 py-4">{t(calcLabel[rule.calculation_type])}</td>
                <td className="px-4 py-4 font-bold">{rule.rate_label}</td>
                <td className="px-4 py-4">{rule.priority}</td>
                <td className="px-4 py-4">{rule.starts_at || rule.ends_at ? `${formatDate(rule.starts_at, locale)}–${rule.ends_at ? formatDate(rule.ends_at, locale) : t('admin.commissionOpenEnded')}` : t('admin.commissionOpenEnded')}</td>
                <td className="px-4 py-4"><AdminStatusBadge label={t(statusLabel[rule.effective_status])} tone={statusTone[rule.effective_status]} /></td>
                <td className="px-4 py-4">{formatDate(rule.updated_at, locale)}</td>
                <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                  <AdminActionMenu
                    open={openAction === rule.id}
                    onToggle={() => setOpenAction((current) => (current === rule.id ? null : rule.id))}
                    onClose={() => setOpenAction(null)}
                    label={t('admin.actions')}
                  >
                    <AdminMenuItem onClick={() => { setCreating(false); setActiveId(rule.id); setOpenAction(null); }}>{t('admin.viewCommission')}</AdminMenuItem>
                    {rule.status !== 'active' ? <AdminMenuItem tone="emerald" onClick={() => void setStatus(rule.id, 'active')}>{t('admin.commissionStatusActive')}</AdminMenuItem> : null}
                    {rule.status !== 'disabled' ? <AdminMenuItem onClick={() => void setStatus(rule.id, 'disabled')}>{t('admin.commissionStatusDisabled')}</AdminMenuItem> : null}
                    {rule.status !== 'draft' ? <AdminMenuItem onClick={() => void setStatus(rule.id, 'draft')}>{t('admin.commissionStatusDraft')}</AdminMenuItem> : null}
                  </AdminActionMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={creating ? t('admin.createCommissionRule') : t('admin.commissionSelectedTitle')}
          intro={creating ? t('admin.commissionCreateIntro') : t('admin.commissionSelectedIntro')}
          loading={detailLoading && !creating}
          loadingLabel={t('common.loading')}
          empty={t('admin.commissionOverviewEmpty')}
          isEmpty={!creating && !detail}
        >
          <form id="rule-editor" onSubmit={(event) => { event.preventDefault(); void saveRule(); }} className="space-y-4 p-5">
            {!creating && detail ? (
              <div>
                <h3 className="text-lg font-bold">{detail.name}</h3>
                <p className="text-xs text-slate-400">{detail.code}</p>
              </div>
            ) : null}
            <AdminField label={t('admin.commissionName')}>
              <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className={inputClass} />
            </AdminField>
            <AdminField label={t('admin.colStatus')}>
              <AdminSelect value={draft.status} onChange={(value) => setDraft((current) => ({ ...current, status: value as CommissionStoredStatus }))}>
                {(['draft', 'active', 'scheduled', 'disabled'] as CommissionStoredStatus[]).map((status) => (
                  <option key={status} value={status}>{t(statusLabel[status])}</option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label={t('admin.commissionDescription')}>
              <textarea rows={2} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className={inputClass} />
            </AdminField>
            <AdminField label={t('admin.commissionCalcType')}>
              <AdminSelect value={draft.calculation_type} onChange={(value) => setDraft((current) => ({ ...current, calculation_type: value as CommissionCalc }))}>
                {(Object.keys(calcLabel) as CommissionCalc[]).map((type) => (
                  <option key={type} value={type}>{t(calcLabel[type])}</option>
                ))}
              </AdminSelect>
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label={t('admin.commissionPercentRate')}>
                <input type="number" min={0} max={100} step="0.1" value={draft.percentage_rate} onChange={(event) => setDraft((current) => ({ ...current, percentage_rate: event.target.value }))} className={inputClass} />
              </AdminField>
              <AdminField label={t('admin.commissionFixedAmount')}>
                <input type="number" min={0} step="0.01" value={draft.fixed_amount} onChange={(event) => setDraft((current) => ({ ...current, fixed_amount: event.target.value }))} className={inputClass} />
              </AdminField>
            </div>
            <AdminField label={t('admin.commissionAppliesTo')}>
              <AdminSelect value={draft.applies_to} onChange={(value) => setDraft((current) => ({ ...current, applies_to: value as CommissionScope, category_id: '', store_id: '' }))}>
                {(Object.keys(scopeLabel) as CommissionScope[]).map((scope) => (
                  <option key={scope} value={scope}>{t(scopeLabel[scope])}</option>
                ))}
              </AdminSelect>
            </AdminField>
            {draft.applies_to === 'categories' ? (
              <AdminField label={t('admin.navCategories')}>
                <AdminSelect value={draft.category_id} onChange={(value) => setDraft((current) => ({ ...current, category_id: value ? Number(value) : '' }))}>
                  <option value="">{t('admin.commissionChooseCategory')}</option>
                  {categoryOptions(categories).map((category) => <option key={category.id} value={category.id} title={category.path}>{indentOption(category)}</option>)}
                </AdminSelect>
              </AdminField>
            ) : null}
            {draft.applies_to === 'selected_vendors' ? (
              <AdminField label={t('admin.navVendors')}>
                <AdminSelect value={draft.store_id} onChange={(value) => setDraft((current) => ({ ...current, store_id: value ? Number(value) : '' }))}>
                  <option value="">{t('admin.commissionChooseStore')}</option>
                  {stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
                </AdminSelect>
              </AdminField>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <AdminField label={t('admin.commissionPriority')}>
                <input type="number" min={0} value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: Number(event.target.value) }))} className={inputClass} />
              </AdminField>
              <AdminField label={t('admin.commissionMinOrder')}>
                <input type="number" min={0} step="0.01" value={draft.min_order_value} onChange={(event) => setDraft((current) => ({ ...current, min_order_value: event.target.value }))} className={inputClass} />
              </AdminField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label={t('admin.commissionStart')}>
                <input type="date" value={draft.starts_at} onChange={(event) => setDraft((current) => ({ ...current, starts_at: event.target.value }))} className={inputClass} />
              </AdminField>
              <AdminField label={t('admin.commissionEnd')}>
                <input type="date" value={draft.ends_at} onChange={(event) => setDraft((current) => ({ ...current, ends_at: event.target.value }))} className={inputClass} />
              </AdminField>
            </div>
            {!creating && detail ? (
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.commissionRate'), value: detail.rate_label },
                  { label: t('admin.commissionAppliesTo'), value: appliesLabel(detail, t) },
                  { label: t('admin.colStatus'), value: t(statusLabel[detail.effective_status]) },
                  { label: t('admin.colDate'), value: formatDateTime(detail.updated_at, locale), span: true },
                ]}
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={saving} className={primaryButton}>{creating ? t('admin.createCommissionRule') : t('admin.saveCommissionRule')}</button>
              {creating ? <button type="button" onClick={() => setCreating(false)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">{t('admin.clearFilters')}</button> : null}
            </div>
          </form>
          {!creating && detail ? (
            <div className="border-t border-slate-100 p-5">
              <AdminNotesCard
                title={t('admin.commissionNotesTitle')}
                intro={t('admin.commissionNotesIntro')}
                note={note}
                onChange={setNote}
                onSave={() => void saveNote()}
                saving={saving}
                events={detail.events.filter((event) => event.type === 'note').map((event) => ({
                  id: event.id,
                  body: event.body ?? undefined,
                  author: event.author,
                  created_at: event.created_at,
                }))}
                locale={locale}
              />
            </div>
          ) : null}
        </AdminDetailAside>
      </AdminSplitLayout>

      <section id="commission-settings" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold">{t('admin.commissionSettingsTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.commissionSettingsIntro')}</p>
        </div>
        <form className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" onSubmit={(event) => { event.preventDefault(); void saveSettings(); }}>
          <AdminField label={t('admin.commissionGlobalRate')}>
            <input type="number" min={0} max={100} step="0.1" value={settingsDraft.global_rate ?? ''} onChange={(event) => setSettingsDraft((current) => ({ ...current, global_rate: numberOrNull(event.target.value) }))} className={inputClass} />
          </AdminField>
          <AdminField label={t('admin.commissionProductRate')}>
            <input type="number" min={0} max={100} step="0.1" value={settingsDraft.product_rate ?? ''} onChange={(event) => setSettingsDraft((current) => ({ ...current, product_rate: numberOrNull(event.target.value) }))} className={inputClass} />
          </AdminField>
          <AdminField label={t('admin.commissionServiceRate')}>
            <input type="number" min={0} max={100} step="0.1" value={settingsDraft.service_rate ?? ''} onChange={(event) => setSettingsDraft((current) => ({ ...current, service_rate: numberOrNull(event.target.value) }))} className={inputClass} />
          </AdminField>
          <AdminField label={t('admin.commissionFixedFee')}>
            <input type="number" min={0} step="0.01" value={settingsDraft.fixed_fee ?? ''} onChange={(event) => setSettingsDraft((current) => ({ ...current, fixed_fee: numberOrNull(event.target.value) }))} className={inputClass} />
          </AdminField>
          <AdminField label={t('admin.commissionCurrency')}>
            <AdminSelect value={settingsDraft.currency} onChange={(value) => setSettingsDraft((current) => ({ ...current, currency: value as CommissionSettings['currency'] }))}>
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
            </AdminSelect>
          </AdminField>
          <AdminField label={t('admin.commissionReserveDays')}>
            <input type="number" min={0} max={365} value={settingsDraft.reserve_days ?? ''} onChange={(event) => setSettingsDraft((current) => ({ ...current, reserve_days: numberOrNull(event.target.value) }))} className={inputClass} />
          </AdminField>
          <label className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm sm:col-span-2 xl:col-span-3">
            <span>{t('admin.commissionIncludeShipping')}</span>
            <input type="checkbox" checked={settingsDraft.include_shipping} onChange={(event) => setSettingsDraft((current) => ({ ...current, include_shipping: event.target.checked }))} className="rounded border-slate-300 text-amber-600" />
          </label>
          <label className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm sm:col-span-2 xl:col-span-3">
            <span>{t('admin.commissionIncludeTaxes')}</span>
            <input type="checkbox" checked={settingsDraft.include_taxes} onChange={(event) => setSettingsDraft((current) => ({ ...current, include_taxes: event.target.checked }))} className="rounded border-slate-300 text-amber-600" />
          </label>
          <div className="flex justify-end gap-2 sm:col-span-2 xl:col-span-3">
            <button type="button" onClick={() => setSettingsDraft(settings)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">{t('admin.clearFilters')}</button>
            <button type="submit" disabled={saving} className={primaryButton}>{t('admin.saveCommissionSettings')}</button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold">{t('admin.commissionEntriesTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.commissionEntriesIntro')}</p>
        </div>
        {entries.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">{t('admin.noCommissionEntries')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">{t('admin.colEntry')}</th>
                  <th className="px-3 py-3">{t('admin.navOrdersBookings')}</th>
                  <th className="px-3 py-3">{t('admin.navVendors')}</th>
                  <th className="px-3 py-3 text-right">{t('admin.commissionAmount')}</th>
                  <th className="px-5 py-3">{t('admin.colStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-5 py-3 font-semibold">{entry.code}<p className="text-xs font-normal text-slate-500">{entry.subject}</p></td>
                    <td className="px-3 py-3">{entry.order?.code ?? t('admin.unavailable')}</td>
                    <td className="px-3 py-3">{entry.store?.name ?? t('admin.unavailable')}</td>
                    <td className="px-3 py-3 text-right font-bold">{formatMoney(entry.amount, entry.currency, locale)}</td>
                    <td className="px-5 py-3">{entry.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AdminActivityCard
        title={t('admin.commissionActivityTitle')}
        intro={t('admin.commissionActivityIntro')}
        empty={events.length === 0 ? <p className="px-5 py-4 text-sm text-slate-500">{t('admin.commissionActivityEmpty')}</p> : null}
        headers={[t('admin.colDate'), t('admin.commissionColRule'), t('admin.colStatus'), t('admin.addNote')]}
      >
        {events.map((event) => (
          <tr key={event.id}>
            <td className="px-5 py-3">{formatDateTime(event.created_at, locale)}<p className="text-xs text-slate-500">{event.author ?? t('admin.unavailable')}</p></td>
            <td className="px-5 py-3">{event.subject ?? event.rule}</td>
            <td className="px-5 py-3">{event.from_status && event.to_status ? `${event.from_status} → ${event.to_status}` : event.type}</td>
            <td className="px-5 py-3">{event.body ?? '—'}</td>
          </tr>
        ))}
      </AdminActivityCard>

      <AdminLinkGrid
        title={t('admin.commissionAdminLinks')}
        intro={t('admin.commissionAdminLinksIntro')}
        footnote={t('admin.commissionCommerceNotReady')}
        links={[
          { key: 'all', label: t('admin.commissionTabAll'), count: stats?.total, onClick: () => applyStatFilter({}) },
          { key: 'active', label: t('admin.commissionStatActive'), count: stats?.active, onClick: () => applyStatFilter({ status: 'active' }) },
          { key: 'expired', label: t('admin.commissionStatExpired'), count: stats?.expired, onClick: () => applyStatFilter({ status: 'expired' }) },
          { key: 'vendors', label: t('admin.commissionStatVendors'), count: stats?.selected_vendors, onClick: () => applyStatFilter({ applies_to: 'selected_vendors' }) },
          { key: 'categories', label: t('admin.commissionStatCategories'), count: stats?.categories, onClick: () => applyStatFilter({ applies_to: 'categories' }) },
          { key: 'financials', label: t('admin.navFinancials'), href: '#admin-financials' },
          { key: 'vendors-page', label: t('admin.navVendors'), href: '#admin-vendors' },
          { key: 'categories-page', label: t('admin.navCategories'), href: '#admin-categories' },
        ]}
      />
    </AdminPageShell>
  );
}

import { useCallback, useEffect, useState } from 'react';
import {
  Banknote,
  Download,
  Percent,
  Plus,
  Settings,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminFinancial,
  type AdminFinancialDetail,
  type AdminFinancialEvent,
  type AdminFinancialList,
  type AdminFinancialStats,
  type FinancialDirection,
  type FinancialListQuery,
  type FinancialStatus,
  type FinancialType,
} from '../../lib/admin';
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
  AdminStatusCard,
  AdminTableHead,
  AdminTabs,
  AdminToolbarButton,
  formatDate,
  formatDateTime,
  formatMoney,
  initials,
  inputClass,
} from './partials';

const emptyFilters: FinancialListQuery = {
  search: '',
  type: '',
  status: '',
  direction: '',
  store_id: '',
  attention: '',
  created_from: '',
  created_to: '',
  min_amount: '',
  max_amount: '',
  sort: 'newest',
  per_page: 25,
  page: 1,
};

const statusesNeedingReason: FinancialStatus[] = ['failed', 'on_hold', 'reversed'];

const statusTone: Record<FinancialStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  posted: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-rose-100 text-rose-700',
  on_hold: 'bg-orange-100 text-orange-700',
  reversed: 'bg-slate-200 text-slate-700',
};

const statusLabel: Record<FinancialStatus, MessageKey> = {
  pending: 'admin.financialStatusPending',
  posted: 'admin.financialStatusPosted',
  failed: 'admin.financialStatusFailed',
  on_hold: 'admin.financialStatusOnHold',
  reversed: 'admin.financialStatusReversed',
};

const typeLabel: Record<FinancialType, MessageKey> = {
  payment: 'admin.financialTypePayment',
  payout: 'admin.financialTypePayout',
  refund: 'admin.financialTypeRefund',
  commission: 'admin.financialTypeCommission',
  fee: 'admin.financialTypeFee',
  tax: 'admin.financialTypeTax',
  chargeback: 'admin.financialTypeChargeback',
  adjustment: 'admin.financialTypeAdjustment',
};

const directionLabel: Record<FinancialDirection, MessageKey> = {
  inflow: 'admin.financialDirectionIn',
  outflow: 'admin.financialDirectionOut',
};

export function FinancialsManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<FinancialListQuery>(emptyFilters);
  const [draft, setDraft] = useState<FinancialListQuery>(emptyFilters);
  const [entries, setEntries] = useState<AdminFinancial[]>([]);
  const [stats, setStats] = useState<AdminFinancialStats | null>(null);
  const [stores, setStores] = useState<AdminFinancialList['stores']>([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminFinancialDetail | null>(null);
  const [events, setEvents] = useState<AdminFinancialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [note, setNote] = useState('');
  const [statusAction, setStatusAction] = useState<FinancialStatus | ''>('');
  const [statusReason, setStatusReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const loadList = useCallback(async (query: FinancialListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.financials(query);
      setEntries(data.entries);
      setStats(data.stats);
      setMeta(data.meta);
      setStores(data.stores);
      setSelectedIds([]);
      setActiveId((current) => current ?? data.entries[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.financialsLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadEvents = useCallback(async () => {
    try {
      setEvents((await adminApi.financialEvents(8)).events);
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

    adminApi.financialEntry(activeId)
      .then((entry) => { if (!cancelled) setDetail(entry); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });

    return () => { cancelled = true; };
  }, [activeId]);

  function applyDraft(next: FinancialListQuery = { ...draft, page: 1 }) {
    setDraft(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<FinancialListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = entries.map((entry) => entry.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  async function refreshAfterChange(entry: AdminFinancialDetail) {
    setDetail(entry);
    setNotice(t('admin.financialStatusUpdated'));
    await loadList(filters);
    await loadEvents();
  }

  async function changeStatus(id: number, status: FinancialStatus, reason?: string) {
    setSaving(true);
    setError('');

    try {
      await refreshAfterChange(await adminApi.updateFinancialStatus(id, status, reason));
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

  async function applySelectedStatus(status: FinancialStatus) {
    if (selectedIds.length === 0) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const needsReason = statusesNeedingReason.includes(status);

      for (const id of selectedIds) {
        await adminApi.updateFinancialStatus(id, status, needsReason ? t('admin.financialBulkReason') : undefined);
      }

      setNotice(t('admin.financialStatusUpdated'));
      await loadList(filters);
      await loadEvents();
      if (activeId) {
        setDetail(await adminApi.financialEntry(activeId));
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
      setDetail(await adminApi.addFinancialNote(detail.id, note.trim()));
      setNote('');
      setNotice(t('admin.financialNoteAdded'));
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

    if (confirmation.trim().toUpperCase() !== detail.code) {
      setError(t('admin.financialConfirmMismatch'));
      return;
    }

    await changeStatus(detail.id, statusAction, statusReason);
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.financialStatTotal'), value: stats.total, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({}) },
    { key: 'pending', label: t('admin.financialStatusPending'), value: stats.pending, tone: 'bg-amber-100 text-amber-800', onClick: () => applyStatFilter({ status: 'pending' }) },
    { key: 'posted', label: t('admin.financialStatusPosted'), value: stats.posted, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ status: 'posted' }) },
    { key: 'failed', label: t('admin.financialStatusFailed'), value: stats.failed, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ status: 'failed' }) },
    { key: 'hold', label: t('admin.financialStatusOnHold'), value: stats.on_hold, tone: 'bg-orange-100 text-orange-700', onClick: () => applyStatFilter({ status: 'on_hold' }) },
    { key: 'reversed', label: t('admin.financialStatusReversed'), value: stats.reversed, tone: 'bg-slate-100 text-slate-700', onClick: () => applyStatFilter({ status: 'reversed' }) },
    { key: 'month', label: t('admin.financialStatNewMonth'), value: stats.new_this_month, tone: 'bg-blue-100 text-blue-700', onClick: () => applyStatFilter({}) },
    { key: 'attention', label: t('admin.financialStatAttention'), value: stats.attention, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ attention: true }) },
  ] : [];

  const typeCards: { type: FinancialType; count: number; amount: number; tone: string }[] = stats ? [
    { type: 'payment', count: stats.payment, amount: stats.payment_amount, tone: 'bg-blue-100 text-blue-700' },
    { type: 'payout', count: stats.payout, amount: stats.payout_amount, tone: 'bg-violet-100 text-violet-700' },
    { type: 'refund', count: stats.refund, amount: stats.refund_amount, tone: 'bg-rose-100 text-rose-700' },
    { type: 'chargeback', count: stats.chargeback, amount: stats.chargeback_amount, tone: 'bg-rose-100 text-rose-800' },
    { type: 'commission', count: stats.commission, amount: stats.commission_amount, tone: 'bg-amber-100 text-amber-700' },
    { type: 'fee', count: stats.fee, amount: stats.fee_amount, tone: 'bg-slate-100 text-slate-700' },
    { type: 'tax', count: stats.tax, amount: stats.tax_amount, tone: 'bg-cyan-100 text-cyan-700' },
    { type: 'adjustment', count: stats.adjustment, amount: stats.adjustment_amount, tone: 'bg-emerald-100 text-emerald-700' },
  ] : [];

  const tabs: { label: string; query: Partial<FinancialListQuery>; count?: number }[] = [
    { label: t('admin.financialTabAll'), query: {}, count: stats?.total },
    { label: t('admin.financialTypePayment'), query: { type: 'payment' }, count: stats?.payment },
    { label: t('admin.financialTypePayout'), query: { type: 'payout' }, count: stats?.payout },
    { label: t('admin.financialTypeRefund'), query: { type: 'refund' }, count: stats?.refund },
    { label: t('admin.financialTypeChargeback'), query: { type: 'chargeback' }, count: stats?.chargeback },
    { label: t('admin.financialTypeCommission'), query: { type: 'commission' }, count: stats?.commission },
    { label: t('admin.financialTypeFee'), query: { type: 'fee' }, count: stats?.fee },
    { label: t('admin.financialTypeTax'), query: { type: 'tax' }, count: stats?.tax },
    { label: t('admin.financialTypeAdjustment'), query: { type: 'adjustment' }, count: stats?.adjustment },
  ];

  function tabActive(query: Partial<FinancialListQuery>): boolean {
    return (filters.type ?? '') === (query.type ?? '')
      && (filters.status ?? '') === (query.status ?? '')
      && (filters.direction ?? '') === (query.direction ?? '')
      && Boolean(filters.attention) === Boolean(query.attention);
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.financialsTitle')}
        intro={t('admin.financialsIntro')}
        crumb={t('admin.navFinancials')}
        badge={stats ? t('admin.financialsTotal', { count: stats.total }) : undefined}
        icon={Percent}
        actions={(
          <>
            <AdminToolbarButton icon={Download}>{t('admin.exportFinancials')}</AdminToolbarButton>
            <AdminToolbarButton icon={Settings}>{t('admin.financialSettings')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} primary>{t('admin.createAdjustment')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid
        variant="overview"
        title={t('admin.financialOverviewTitle')}
        hint={t('admin.financialOverviewHint')}
        icon={Banknote}
        cards={statCards}
      />

      {stats ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-bold">{t('admin.financialCashTitle')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('admin.financialCashIntro')}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{t('admin.financialCashNet', { amount: formatMoney(stats.net_total, 'USD', locale) })}</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs font-semibold text-slate-500">{t('admin.financialCashIn')}</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">{formatMoney(stats.inflow_total, 'USD', locale)}</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-4">
                <p className="text-xs font-semibold text-slate-500">{t('admin.financialCashOut')}</p>
                <p className="mt-1 text-xl font-bold text-rose-700">{formatMoney(stats.outflow_total, 'USD', locale)}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs font-semibold text-slate-500">{t('admin.financialCashNetLabel')}</p>
                <p className="mt-1 text-xl font-bold text-amber-800">{formatMoney(stats.net_total, 'USD', locale)}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {typeCards.map((card) => (
                <button key={card.type} type="button" onClick={() => applyStatFilter({ type: card.type })} className="rounded-xl border border-slate-100 p-3 text-left hover:border-amber-300 hover:bg-amber-50">
                  <p className="text-xs font-semibold text-slate-500">{t(typeLabel[card.type])}</p>
                  <p className="mt-1 text-lg font-bold">{formatMoney(card.amount, 'USD', locale)}</p>
                  <p className="mt-1 text-xs text-slate-400">{t('admin.financialTypeCount', { count: card.count })}</p>
                </button>
              ))}
            </div>
          </section>

          {stats.attention > 0 ? (
            <AdminAlertBanner
              title={t('admin.financialAttentionTitle', { count: stats.attention })}
              intro={t('admin.financialAttentionIntro')}
              action={t('admin.financialAttentionLink')}
              onAction={() => applyStatFilter({ attention: true })}
            />
          ) : (
            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold">{t('admin.financialAlertsIdleTitle')}</h2>
              <p className="mt-2 text-sm text-slate-500">{t('admin.financialAlertsIdleIntro')}</p>
            </aside>
          )}
        </div>
      ) : null}

      <AdminTabs
        tabs={[
          ...tabs.map((tab) => ({
            key: tab.label,
            label: tab.label,
            count: tab.count,
            active: tabActive(tab.query),
            onClick: () => applyStatFilter(tab.query),
          })),
          {
            key: 'recon',
            label: t('admin.financialTabRecon'),
            active: false,
            onClick: () => undefined,
          },
          {
            key: 'reports',
            label: t('admin.financialTabReports'),
            active: false,
            onClick: () => undefined,
          },
        ]}
      />

      <AdminFilterCard
        title={t('admin.financialFilterTitle')}
        intro={t('admin.financialFilterIntro')}
        onSubmit={() => applyDraft({ ...draft, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        search={{
          value: draft.search ?? '',
          onChange: (value) => setDraft((current) => ({ ...current, search: value })),
          placeholder: t('admin.financialSearchPlaceholder'),
        }}
      >
        <AdminField label={t('admin.financialType')}>
          <AdminSelect value={draft.type ?? ''} onChange={(value) => setDraft((current) => ({ ...current, type: value as FinancialType | '' }))}>
            <option value="">{t('admin.allFinancialTypes')}</option>
            {(Object.keys(typeLabel) as FinancialType[]).map((type) => <option key={type} value={type}>{t(typeLabel[type])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.financialDirection')}>
          <AdminSelect value={draft.direction ?? ''} onChange={(value) => setDraft((current) => ({ ...current, direction: value as FinancialDirection | '' }))}>
            <option value="">{t('admin.allDirections')}</option>
            {(Object.keys(directionLabel) as FinancialDirection[]).map((direction) => <option key={direction} value={direction}>{t(directionLabel[direction])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.colStatus')}>
          <AdminSelect value={draft.status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, status: value as FinancialStatus | '' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            {(Object.keys(statusLabel) as FinancialStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.productStore')}>
          <AdminSelect value={draft.store_id ?? ''} onChange={(value) => setDraft((current) => ({ ...current, store_id: value ? Number(value) : '' }))}>
            <option value="">{t('admin.allStores')}</option>
            {stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.orderDateFrom')}>
          <input type="date" value={draft.created_from ?? ''} onChange={(event) => setDraft((current) => ({ ...current, created_from: event.target.value }))} className={inputClass} />
        </AdminField>
        <AdminField label={t('admin.filterSort')}>
          <AdminSelect value={draft.sort ?? 'newest'} onChange={(value) => setDraft((current) => ({ ...current, sort: value as FinancialListQuery['sort'] }))}>
            <option value="newest">{t('admin.financialSortNewest')}</option>
            <option value="oldest">{t('admin.financialSortOldest')}</option>
            <option value="amount-high">{t('admin.orderSortAmountHigh')}</option>
            <option value="amount-low">{t('admin.orderSortAmountLow')}</option>
            <option value="updated">{t('admin.productSortUpdated')}</option>
          </AdminSelect>
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.financialDirectoryTitle')}
          showing={t('admin.financialDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.financialSelectPage')}
          selected={entries.length > 0 && entries.every((entry) => selectedIds.includes(entry.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.financialSelectedCount', { count: selectedIds.length })}>
              <AdminBulkButton tone="emerald" disabled={saving} onClick={() => void applySelectedStatus('posted')}>{t('admin.financialStatusPosted')}</AdminBulkButton>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedStatus('on_hold')}>{t('admin.financialHold')}</AdminBulkButton>
              <AdminBulkButton tone="rose" disabled={saving} onClick={() => void applySelectedStatus('failed')}>{t('admin.financialStatusFailed')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={entries.length === 0 ? t('admin.noFinancials') : null}
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
              <th className="px-4 py-3"><input type="checkbox" checked={entries.every((entry) => selectedIds.includes(entry.id))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.colEntry')}</th>
              <th className="px-4 py-3">{t('admin.colTransaction')}</th>
              <th className="px-4 py-3">{t('admin.financialType')}</th>
              <th className="px-4 py-3">{t('admin.colCustomer')}</th>
              <th className="px-4 py-3">{t('admin.colVendorStore')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colAmount')}</th>
              <th className="px-4 py-3">{t('admin.financialDirection')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3">{t('admin.colDate')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const rowTone = entry.needs_attention ? 'bg-rose-50/50' : selectedIds.includes(entry.id) || activeId === entry.id ? 'bg-amber-50/40' : '';

              return (
                <tr key={entry.id} className={`${rowTone} cursor-pointer hover:bg-amber-50`} onClick={() => setActiveId(entry.id)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(entry.id)} onChange={() => toggleSelected(entry.id)} className="rounded border-slate-300 text-amber-600" />
                  </td>
                  <th className="px-4 py-4">
                    <p className="font-bold text-slate-950">{entry.code}</p>
                    <p className="max-w-44 truncate text-xs text-slate-500">{entry.subject}</p>
                  </th>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{entry.order?.code ?? t('admin.unavailable')}</p>
                    <p className="text-xs text-slate-500">{entry.order?.item_name ?? t('admin.unavailable')}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold">{t(typeLabel[entry.type])}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">{initials(entry.customer?.name)}</span>
                      <div>
                        <p className="font-semibold">{entry.customer?.name ?? t('admin.unavailable')}</p>
                        <p className="text-xs text-slate-500">{entry.customer?.email ?? t('admin.unavailable')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{entry.store?.vendor_name ?? t('admin.unavailable')}</p>
                    <p className="text-xs text-slate-500">{entry.store?.name ?? t('admin.unavailable')}</p>
                  </td>
                  <td className={`px-4 py-4 text-right font-bold ${entry.direction === 'outflow' ? 'text-rose-700' : 'text-emerald-700'}`}>{formatMoney(entry.signed_amount, entry.currency, locale)}</td>
                  <td className="px-4 py-4">{t(directionLabel[entry.direction])}</td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(statusLabel[entry.status])} tone={statusTone[entry.status]} /></td>
                  <td className="px-4 py-4">{formatDate(entry.created_at, locale)}</td>
                  <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <AdminActionMenu
                      open={openAction === entry.id}
                      onToggle={() => setOpenAction((current) => (current === entry.id ? null : entry.id))}
                      onClose={() => setOpenAction(null)}
                      label={t('admin.actions')}
                    >
                      <AdminMenuItem onClick={() => { setActiveId(entry.id); setOpenAction(null); }}>{t('admin.viewFinancial')}</AdminMenuItem>
                      {entry.status !== 'posted' ? <AdminMenuItem tone="emerald" onClick={() => void changeStatus(entry.id, 'posted')}>{t('admin.financialStatusPosted')}</AdminMenuItem> : null}
                      {entry.status !== 'on_hold' ? <AdminMenuItem tone="amber" onClick={() => void changeStatus(entry.id, 'on_hold', t('admin.financialBulkReason'))}>{t('admin.financialHold')}</AdminMenuItem> : null}
                      {entry.status !== 'failed' ? <AdminMenuItem tone="rose" onClick={() => void changeStatus(entry.id, 'failed', t('admin.financialBulkReason'))}>{t('admin.financialStatusFailed')}</AdminMenuItem> : null}
                    </AdminActionMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={t('admin.financialOverviewSelectedTitle')}
          intro={t('admin.financialOverviewSelected')}
          loading={detailLoading}
          loadingLabel={t('common.loading')}
          empty={t('admin.financialOverviewEmpty')}
          isEmpty={!detail}
        >
          {detail ? (
            <>
              <div className="p-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><Banknote className="h-7 w-7" /></div>
                <h3 className="mt-3 text-lg font-bold">{detail.code}</h3>
                <p className="text-xs text-slate-400">{detail.subject}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <AdminStatusBadge label={t(statusLabel[detail.status])} tone={statusTone[detail.status]} />
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{t(typeLabel[detail.type])}</span>
                </div>
              </div>
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.colTransaction'), value: detail.order?.code ?? t('admin.unavailable') },
                  { label: t('admin.colAmount'), value: formatMoney(detail.signed_amount, detail.currency, locale) },
                  { label: t('admin.colCustomer'), value: detail.customer?.name ?? t('admin.unavailable') },
                  { label: t('admin.navVendors'), value: detail.store?.vendor_name ?? t('admin.unavailable') },
                  { label: t('admin.financialDirection'), value: t(directionLabel[detail.direction]) },
                  { label: t('admin.colDate'), value: formatDateTime(detail.created_at, locale) },
                ]}
              />
              <div className="grid grid-cols-2 gap-2 p-5">
                <a href="#admin-orders" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('admin.viewOrder')}</a>
                <a href="#admin-vendors" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('admin.viewVendor')}</a>
              </div>
            </>
          ) : null}
        </AdminDetailAside>
      </AdminSplitLayout>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminNotesCard
          title={t('admin.financialNotesTitle')}
          intro={t('admin.financialNotesIntro')}
          note={note}
          onChange={setNote}
          onSave={() => void submitNote()}
          saving={!detail || saving}
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
          title={t('admin.financialStatusActions')}
          intro={t('admin.financialStatusActionsIntro')}
          onApply={() => void submitStatusForm()}
          disabled={!detail || !statusAction || saving}
        >
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-slate-500">{t('admin.currentStatus')}</dt><dd className="font-bold">{detail ? t(statusLabel[detail.status]) : t('admin.unavailable')}</dd></div>
            <div><dt className="text-xs text-slate-500">{t('admin.changedBy')}</dt><dd className="font-bold">{detail?.status_changed_by ?? t('admin.none')}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-slate-500">{t('admin.statusReason')}</dt><dd className="font-bold">{detail?.status_reason ?? t('admin.none')}</dd></div>
          </dl>
          <AdminSelect value={statusAction} onChange={(value) => setStatusAction(value as FinancialStatus | '')}>
            <option value="">{t('admin.selectAction')}</option>
            {(Object.keys(statusLabel) as FinancialStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
          <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={t('admin.financialConfirmationPlaceholder')} className={inputClass} />
          <textarea rows={3} value={statusReason} onChange={(event) => setStatusReason(event.target.value)} className={inputClass} />
        </AdminStatusCard>

        <AdminActivityCard
          title={t('admin.financialActivityTitle')}
          intro={t('admin.financialActivityIntro')}
          headers={[]}
        >
          {events.length === 0 ? (
            <tr><td className="px-5 py-8 text-center text-slate-500">{t('admin.noFinancials')}</td></tr>
          ) : events.map((event) => (
            <tr key={event.id}>
              <td className="px-5 py-4">
                <p className="font-semibold">{event.type === 'note' ? t('admin.eventNote') : t('admin.eventStatus')}</p>
                <p className="text-xs text-slate-500">{event.entry ?? t('admin.unavailable')} · {event.author ?? t('admin.unavailable')}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDateTime(event.created_at, locale)}</p>
              </td>
            </tr>
          ))}
        </AdminActivityCard>
      </div>

      <AdminLinkGrid
        title={t('admin.financialAdminLinks')}
        intro={t('admin.financialAdminLinksIntro')}
        footnote={t('admin.financialCommerceNotReady')}
        links={[
          { key: t('admin.financialTabAll'), label: t('admin.financialTabAll'), onClick: () => applyStatFilter({}) },
          { key: t('admin.financialTypePayment'), label: t('admin.financialTypePayment'), count: stats?.payment, onClick: () => applyStatFilter({ type: 'payment' }) },
          { key: t('admin.financialTypePayout'), label: t('admin.financialTypePayout'), count: stats?.payout, onClick: () => applyStatFilter({ type: 'payout' }) },
          { key: t('admin.financialTypeRefund'), label: t('admin.financialTypeRefund'), count: stats?.refund, onClick: () => applyStatFilter({ type: 'refund' }) },
          { key: t('admin.financialAttentionLink'), label: t('admin.financialAttentionLink'), count: stats?.attention, onClick: () => applyStatFilter({ attention: true }) },
          { key: t('admin.financialStatusPending'), label: t('admin.financialStatusPending'), count: stats?.pending, onClick: () => applyStatFilter({ status: 'pending' }) },
          { key: t('admin.financialStatusPosted'), label: t('admin.financialStatusPosted'), count: stats?.posted, onClick: () => applyStatFilter({ status: 'posted' }) },
          { key: t('admin.financialTypeChargeback'), label: t('admin.financialTypeChargeback'), count: stats?.chargeback, onClick: () => applyStatFilter({ type: 'chargeback' }) },
        ]}
      />
    </AdminPageShell>
  );
}

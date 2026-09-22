import { useCallback, useEffect, useState } from 'react';
import {
  Download,
  Plus,
  Settings,
  ShieldAlert,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminDispute,
  type AdminDisputeDetail,
  type AdminDisputeEvent,
  type AdminDisputeList,
  type AdminDisputeStats,
  type DisputeListQuery,
  type DisputePriority,
  type DisputeReason,
  type DisputeStatus,
  type DisputeType,
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

const emptyFilters: DisputeListQuery = {
  search: '',
  type: '',
  reason: '',
  status: '',
  priority: '',
  outcome: '',
  store_id: '',
  attention: '',
  overdue: '',
  unassigned: '',
  created_from: '',
  created_to: '',
  sort: 'newest',
  per_page: 25,
  page: 1,
};

const statusTone: Record<DisputeStatus, string> = {
  new: 'bg-amber-100 text-amber-800',
  open: 'bg-blue-100 text-blue-700',
  awaiting_customer: 'bg-violet-100 text-violet-700',
  awaiting_vendor: 'bg-orange-100 text-orange-700',
  under_review: 'bg-cyan-100 text-cyan-700',
  escalated: 'bg-rose-100 text-rose-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-200 text-slate-700',
};

const statusLabel: Record<DisputeStatus, MessageKey> = {
  new: 'admin.disputeStatusNew',
  open: 'admin.disputeStatusOpen',
  awaiting_customer: 'admin.disputeStatusAwaitingCustomer',
  awaiting_vendor: 'admin.disputeStatusAwaitingVendor',
  under_review: 'admin.disputeStatusReview',
  escalated: 'admin.disputeStatusEscalated',
  resolved: 'admin.disputeStatusResolved',
  closed: 'admin.disputeStatusClosed',
};

const typeLabel: Record<DisputeType, MessageKey> = {
  order_dispute: 'admin.disputeTypeOrder',
  booking_dispute: 'admin.disputeTypeBooking',
  payment_dispute: 'admin.disputeTypePayment',
  chargeback: 'admin.disputeTypeChargeback',
  safety: 'admin.disputeTypeSafety',
};

const reasonLabel: Record<DisputeReason, MessageKey> = {
  not_received: 'admin.disputeReasonNotReceived',
  damaged: 'admin.disputeReasonDamaged',
  unauthorized: 'admin.disputeReasonUnauthorized',
  no_show: 'admin.disputeReasonNoShow',
  unsatisfactory: 'admin.disputeReasonUnsatisfactory',
  other: 'admin.disputeReasonOther',
};

const priorityTone: Record<DisputePriority, string> = {
  low: 'bg-slate-100 text-slate-600',
  normal: 'bg-slate-100 text-slate-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-orange-100 text-orange-800',
  critical: 'bg-rose-100 text-rose-700',
};

const priorityLabel: Record<DisputePriority, MessageKey> = {
  low: 'admin.disputePriorityLow',
  normal: 'admin.disputePriorityNormal',
  high: 'admin.disputePriorityHigh',
  urgent: 'admin.disputePriorityUrgent',
  critical: 'admin.disputePriorityCritical',
};

export function DisputesManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<DisputeListQuery>(emptyFilters);
  const [draft, setDraft] = useState<DisputeListQuery>(emptyFilters);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [stats, setStats] = useState<AdminDisputeStats | null>(null);
  const [stores, setStores] = useState<AdminDisputeList['stores']>([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminDisputeDetail | null>(null);
  const [events, setEvents] = useState<AdminDisputeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [note, setNote] = useState('');
  const [statusAction, setStatusAction] = useState<DisputeStatus | ''>('');
  const [statusReason, setStatusReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const loadList = useCallback(async (query: DisputeListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.disputes(query);
      setDisputes(data.disputes);
      setStats(data.stats);
      setMeta(data.meta);
      setStores(data.stores);
      setSelectedIds([]);
      setActiveId((current) => current ?? data.disputes[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.disputesLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadEvents = useCallback(async () => {
    try {
      setEvents((await adminApi.disputeEvents(8)).events);
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

    adminApi.dispute(activeId)
      .then((dispute) => { if (!cancelled) setDetail(dispute); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });

    return () => { cancelled = true; };
  }, [activeId]);

  function applyDraft(next: DisputeListQuery = { ...draft, page: 1 }) {
    setDraft(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<DisputeListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = disputes.map((dispute) => dispute.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  async function refreshAfterChange(dispute: AdminDisputeDetail) {
    setDetail(dispute);
    setNotice(t('admin.disputeStatusUpdated'));
    await loadList(filters);
    await loadEvents();
  }

  async function changeStatus(id: number, status: DisputeStatus, reason?: string) {
    setSaving(true);
    setError('');

    try {
      await refreshAfterChange(await adminApi.updateDisputeStatus(id, status, reason));
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

  async function applySelectedStatus(status: DisputeStatus) {
    if (selectedIds.length === 0) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const needsReason = status === 'escalated' || status === 'resolved' || status === 'closed';

      for (const id of selectedIds) {
        await adminApi.updateDisputeStatus(id, status, needsReason ? t('admin.disputeBulkReason') : undefined);
      }

      setNotice(t('admin.disputeStatusUpdated'));
      await loadList(filters);
      await loadEvents();
      if (activeId) {
        setDetail(await adminApi.dispute(activeId));
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
      setDetail(await adminApi.addDisputeNote(detail.id, note.trim()));
      setNote('');
      setNotice(t('admin.disputeNoteAdded'));
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
      setError(t('admin.disputeConfirmMismatch'));
      return;
    }

    await changeStatus(detail.id, statusAction, statusReason);
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.disputeStatTotal'), value: stats.total, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({}) },
    { key: 'open', label: t('admin.disputeStatOpen'), value: stats.open, tone: 'bg-blue-100 text-blue-700', onClick: () => applyStatFilter({ status: 'open' }) },
    { key: 'customer', label: t('admin.disputeStatusAwaitingCustomer'), value: stats.awaiting_customer, tone: 'bg-violet-100 text-violet-700', onClick: () => applyStatFilter({ status: 'awaiting_customer' }) },
    { key: 'vendor', label: t('admin.disputeStatusAwaitingVendor'), value: stats.awaiting_vendor, tone: 'bg-orange-100 text-orange-700', onClick: () => applyStatFilter({ status: 'awaiting_vendor' }) },
    { key: 'review', label: t('admin.disputeStatusReview'), value: stats.under_review, tone: 'bg-cyan-100 text-cyan-700', onClick: () => applyStatFilter({ status: 'under_review' }) },
    { key: 'escalated', label: t('admin.disputeStatusEscalated'), value: stats.escalated, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ status: 'escalated' }) },
    { key: 'overdue', label: t('admin.disputeStatOverdue'), value: stats.overdue, tone: 'bg-orange-100 text-orange-800', onClick: () => applyStatFilter({ overdue: true }) },
    { key: 'resolved', label: t('admin.disputeStatResolvedMonth'), value: stats.resolved_this_month, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ status: 'resolved' }) },
  ] : [];

  const tabs: { label: string; query: Partial<DisputeListQuery>; count?: number }[] = [
    { label: t('admin.disputeTabAll'), query: {}, count: stats?.total },
    { label: t('admin.disputeStatusNew'), query: { status: 'new' }, count: stats?.new },
    { label: t('admin.disputeStatusOpen'), query: { status: 'open' }, count: stats?.open },
    { label: t('admin.disputeStatusAwaitingCustomer'), query: { status: 'awaiting_customer' }, count: stats?.awaiting_customer },
    { label: t('admin.disputeStatusAwaitingVendor'), query: { status: 'awaiting_vendor' }, count: stats?.awaiting_vendor },
    { label: t('admin.disputeStatusReview'), query: { status: 'under_review' }, count: stats?.under_review },
    { label: t('admin.disputeStatusEscalated'), query: { status: 'escalated' }, count: stats?.escalated },
    { label: t('admin.disputeStatusResolved'), query: { status: 'resolved' }, count: stats?.resolved },
    { label: t('admin.disputeStatusClosed'), query: { status: 'closed' }, count: stats?.closed },
    { label: t('admin.disputeTypeChargeback'), query: { type: 'chargeback' }, count: stats?.chargebacks },
  ];

  function tabActive(query: Partial<DisputeListQuery>): boolean {
    return (filters.type ?? '') === (query.type ?? '')
      && (filters.status ?? '') === (query.status ?? '')
      && Boolean(filters.attention) === Boolean(query.attention)
      && Boolean(filters.overdue) === Boolean(query.overdue);
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.disputesTitle')}
        intro={t('admin.disputesIntro')}
        crumb={t('admin.navDisputes')}
        badge={stats ? t('admin.disputesTotal', { count: stats.total }) : undefined}
        icon={ShieldAlert}
        actions={(
          <>
            <AdminToolbarButton icon={Download} disabled title={t('admin.notYetAvailable')}>{t('admin.exportDisputes')}</AdminToolbarButton>
            <AdminToolbarButton icon={Settings} disabled title={t('admin.notYetAvailable')}>{t('admin.disputeSettings')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} primary disabled title={t('admin.notYetAvailable')}>{t('admin.createDispute')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid
        title={t('admin.disputeOverviewTitle')}
        hint={t('admin.disputeOverviewHint')}
        variant="overview"
        icon={ShieldAlert}
        cards={statCards}
      />

      {stats && stats.attention > 0 ? (
        <AdminAlertBanner
          tone="rose"
          title={t('admin.disputeAttentionTitle', { count: stats.attention })}
          intro={t('admin.disputeAttentionIntro')}
          action={t('admin.disputeAttentionLink')}
          onAction={() => applyStatFilter({ attention: true })}
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
        title={t('admin.disputeFilterTitle')}
        intro={t('admin.disputeFilterIntro')}
        onSubmit={() => applyDraft({ ...draft, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        search={{
          value: draft.search ?? '',
          onChange: (value) => setDraft((current) => ({ ...current, search: value })),
          placeholder: t('admin.disputeSearchPlaceholder'),
        }}
      >
        <AdminField label={t('admin.disputeType')}>
          <AdminSelect value={draft.type ?? ''} onChange={(value) => setDraft((current) => ({ ...current, type: value as DisputeType | '' }))}>
            <option value="">{t('admin.allDisputeTypes')}</option>
            {(Object.keys(typeLabel) as DisputeType[]).map((type) => <option key={type} value={type}>{t(typeLabel[type])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.disputeReason')}>
          <AdminSelect value={draft.reason ?? ''} onChange={(value) => setDraft((current) => ({ ...current, reason: value as DisputeReason | '' }))}>
            <option value="">{t('admin.allDisputeReasons')}</option>
            {(Object.keys(reasonLabel) as DisputeReason[]).map((reason) => <option key={reason} value={reason}>{t(reasonLabel[reason])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.colStatus')}>
          <AdminSelect value={draft.status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, status: value as DisputeStatus | '' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            {(Object.keys(statusLabel) as DisputeStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.disputePriority')}>
          <AdminSelect value={draft.priority ?? ''} onChange={(value) => setDraft((current) => ({ ...current, priority: value as DisputePriority | '' }))}>
            <option value="">{t('admin.allPriorities')}</option>
            {(Object.keys(priorityLabel) as DisputePriority[]).map((priority) => <option key={priority} value={priority}>{t(priorityLabel[priority])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.productStore')}>
          <AdminSelect value={draft.store_id ?? ''} onChange={(value) => setDraft((current) => ({ ...current, store_id: value ? Number(value) : '' }))}>
            <option value="">{t('admin.allStores')}</option>
            {stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterSort')}>
          <AdminSelect value={draft.sort ?? 'newest'} onChange={(value) => setDraft((current) => ({ ...current, sort: value as DisputeListQuery['sort'] }))}>
            <option value="newest">{t('admin.disputeSortNewest')}</option>
            <option value="oldest">{t('admin.disputeSortOldest')}</option>
            <option value="deadline">{t('admin.disputeSortDeadline')}</option>
            <option value="amount-high">{t('admin.orderSortAmountHigh')}</option>
            <option value="updated">{t('admin.productSortUpdated')}</option>
          </AdminSelect>
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.disputeDirectoryTitle')}
          showing={t('admin.disputeDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.disputeSelectPage')}
          selected={disputes.length > 0 && disputes.every((dispute) => selectedIds.includes(dispute.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.disputeSelectedCount', { count: selectedIds.length })}>
              <button type="button" disabled={saving} onClick={() => void applySelectedStatus('under_review')} className="rounded-lg border border-cyan-200 bg-white px-3 py-2 text-xs font-bold text-cyan-700">{t('admin.disputeStatusReview')}</button>
              <AdminBulkButton disabled={saving} tone="rose" onClick={() => void applySelectedStatus('escalated')}>{t('admin.disputeEscalate')}</AdminBulkButton>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedStatus('closed')}>{t('admin.disputeClose')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={disputes.length === 0 ? t('admin.noDisputes') : null}
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
              <th className="px-4 py-3"><input type="checkbox" checked={disputes.every((dispute) => selectedIds.includes(dispute.id))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.colDispute')}</th>
              <th className="px-4 py-3">{t('admin.colTransaction')}</th>
              <th className="px-4 py-3">{t('admin.colCustomer')}</th>
              <th className="px-4 py-3">{t('admin.colVendorStore')}</th>
              <th className="px-4 py-3">{t('admin.disputeReason')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colAmount')}</th>
              <th className="px-4 py-3">{t('admin.colAssigned')}</th>
              <th className="px-4 py-3">{t('admin.colDeadline')}</th>
              <th className="px-4 py-3">{t('admin.disputePriority')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {disputes.map((dispute) => {
              const rowTone = dispute.needs_attention ? 'bg-rose-50/50' : selectedIds.includes(dispute.id) || activeId === dispute.id ? 'bg-amber-50/40' : '';

              return (
                <tr key={dispute.id} className={`${rowTone} cursor-pointer hover:bg-amber-50`} onClick={() => setActiveId(dispute.id)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(dispute.id)} onChange={() => toggleSelected(dispute.id)} className="rounded border-slate-300 text-amber-600" />
                  </td>
                  <th className="px-4 py-4">
                    <p className="font-bold text-slate-950">{dispute.code}</p>
                    <p className="text-xs text-slate-500">{formatDate(dispute.created_at, locale)}</p>
                  </th>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{dispute.order?.code ?? t('admin.unavailable')}</p>
                    <p className="text-xs text-slate-500">{t(typeLabel[dispute.type])}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">{initials(dispute.customer?.name)}</span>
                      <div>
                        <p className="font-semibold">{dispute.customer?.name ?? t('admin.unavailable')}</p>
                        <p className="text-xs text-slate-500">{dispute.customer?.email ?? t('admin.unavailable')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><p className="font-semibold">{dispute.store?.vendor_name ?? t('admin.unavailable')}</p><p className="text-xs text-slate-500">{dispute.store?.name ?? t('admin.unavailable')}</p></td>
                  <td className="px-4 py-4"><p className="font-semibold">{t(reasonLabel[dispute.reason])}</p><p className="max-w-44 truncate text-xs text-slate-500">{dispute.subject}</p></td>
                  <td className="px-4 py-4 text-right font-bold">{formatMoney(dispute.amount, dispute.currency, locale)}</td>
                  <td className="px-4 py-4">{dispute.assignee?.name ?? t('admin.unassigned')}</td>
                  <td className="px-4 py-4">
                    <p className={dispute.is_overdue ? 'font-bold text-rose-700' : 'font-semibold'}>{dispute.is_overdue ? t('admin.disputeOverdue') : formatDateTime(dispute.due_at, locale)}</p>
                    {dispute.due_at ? <p className="text-xs text-slate-500">{formatDateTime(dispute.due_at, locale)}</p> : null}
                  </td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(priorityLabel[dispute.priority])} tone={priorityTone[dispute.priority]} /></td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(statusLabel[dispute.status])} tone={statusTone[dispute.status]} /></td>
                  <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <AdminActionMenu
                      open={openAction === dispute.id}
                      onToggle={() => setOpenAction((current) => (current === dispute.id ? null : dispute.id))}
                      onClose={() => setOpenAction(null)}
                      label={t('admin.actions')}
                    >
                      <AdminMenuItem onClick={() => { setActiveId(dispute.id); setOpenAction(null); }}>{t('admin.viewDispute')}</AdminMenuItem>
                      {dispute.status !== 'under_review' ? <AdminMenuItem onClick={() => void changeStatus(dispute.id, 'under_review')}>{t('admin.disputeStatusReview')}</AdminMenuItem> : null}
                      {dispute.status !== 'escalated' ? <AdminMenuItem tone="rose" onClick={() => void changeStatus(dispute.id, 'escalated', t('admin.disputeBulkReason'))}>{t('admin.disputeEscalate')}</AdminMenuItem> : null}
                      {dispute.status !== 'closed' ? <AdminMenuItem onClick={() => void changeStatus(dispute.id, 'closed', t('admin.disputeBulkReason'))}>{t('admin.disputeClose')}</AdminMenuItem> : null}
                    </AdminActionMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={t('admin.disputeOverviewSelectedTitle')}
          intro={t('admin.disputeOverviewSelected')}
          loading={detailLoading}
          loadingLabel={t('common.loading')}
          empty={t('admin.disputeOverviewEmpty')}
          isEmpty={!detail}
        >
          {detail ? (
            <>
              <div className="p-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-700"><ShieldAlert className="h-7 w-7" /></div>
                <h3 className="mt-3 text-lg font-bold">{detail.code}</h3>
                <p className="text-xs text-slate-400">{detail.subject}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <AdminStatusBadge label={t(statusLabel[detail.status])} tone={statusTone[detail.status]} />
                  <AdminStatusBadge label={t(priorityLabel[detail.priority])} tone={priorityTone[detail.priority]} />
                </div>
              </div>
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.colTransaction'), value: detail.order?.code ?? t('admin.unavailable') },
                  { label: t('admin.colAmount'), value: formatMoney(detail.amount, detail.currency, locale) },
                  { label: t('admin.colCustomer'), value: detail.customer?.name ?? t('admin.unavailable') },
                  { label: t('admin.navVendors'), value: detail.store?.vendor_name ?? t('admin.unavailable') },
                  { label: t('admin.colAssigned'), value: detail.assignee?.name ?? t('admin.unassigned') },
                  { label: t('admin.colDeadline'), value: detail.is_overdue ? t('admin.disputeOverdue') : formatDateTime(detail.due_at, locale) },
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
          title={t('admin.disputeNotesTitle')}
          intro={t('admin.disputeNotesIntro')}
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
          title={t('admin.disputeStatusActions')}
          intro={t('admin.disputeStatusActionsIntro')}
          onApply={() => void submitStatusForm()}
          disabled={!detail || !statusAction || saving}
        >
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-slate-500">{t('admin.currentStatus')}</dt><dd className="font-bold">{detail ? t(statusLabel[detail.status]) : t('admin.unavailable')}</dd></div>
            <div><dt className="text-xs text-slate-500">{t('admin.changedBy')}</dt><dd className="font-bold">{detail?.status_changed_by ?? t('admin.none')}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-slate-500">{t('admin.statusReason')}</dt><dd className="font-bold">{detail?.status_reason ?? t('admin.none')}</dd></div>
          </dl>
          <AdminSelect value={statusAction} onChange={(value) => setStatusAction(value as DisputeStatus | '')}>
            <option value="">{t('admin.selectAction')}</option>
            {(Object.keys(statusLabel) as DisputeStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
          <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={t('admin.disputeConfirmationPlaceholder')} className={inputClass} />
          <textarea rows={3} value={statusReason} onChange={(event) => setStatusReason(event.target.value)} className={inputClass} />
        </AdminStatusCard>

        <AdminActivityCard
          title={t('admin.disputeActivityTitle')}
          intro={t('admin.disputeActivityIntro')}
          headers={[]}
        >
          {events.length === 0 ? (
            <tr><td className="px-5 py-8 text-center text-slate-500">{t('admin.noDisputes')}</td></tr>
          ) : events.map((event) => (
            <tr key={event.id}>
              <td className="px-5 py-4">
                <p className="font-semibold">{event.type === 'note' ? t('admin.eventNote') : t('admin.eventStatus')}</p>
                <p className="text-xs text-slate-500">{event.dispute ?? t('admin.unavailable')} · {event.author ?? t('admin.unavailable')}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDateTime(event.created_at, locale)}</p>
              </td>
            </tr>
          ))}
        </AdminActivityCard>
      </div>

      <AdminLinkGrid
        title={t('admin.disputeAdminLinks')}
        intro={t('admin.disputeAdminLinksIntro')}
        footnote={t('admin.disputeCommerceNotReady')}
        links={[
          { key: t('admin.disputeTabAll'), label: t('admin.disputeTabAll'), onClick: () => applyStatFilter({}) },
          { key: t('admin.disputeStatusOpen'), label: t('admin.disputeStatusOpen'), count: stats?.open, onClick: () => applyStatFilter({ status: 'open' }) },
          { key: t('admin.disputeStatusEscalated'), label: t('admin.disputeStatusEscalated'), count: stats?.escalated, onClick: () => applyStatFilter({ status: 'escalated' }) },
          { key: t('admin.disputeStatOverdue'), label: t('admin.disputeStatOverdue'), count: stats?.overdue, onClick: () => applyStatFilter({ overdue: true }) },
          { key: t('admin.disputeAttentionLink'), label: t('admin.disputeAttentionLink'), count: stats?.attention, onClick: () => applyStatFilter({ attention: true }) },
          { key: t('admin.disputeTypeChargeback'), label: t('admin.disputeTypeChargeback'), count: stats?.chargebacks, onClick: () => applyStatFilter({ type: 'chargeback' }) },
          { key: t('admin.disputeStatusResolved'), label: t('admin.disputeStatusResolved'), count: stats?.resolved, onClick: () => applyStatFilter({ status: 'resolved' }) },
          { key: t('admin.unassigned'), label: t('admin.unassigned'), onClick: () => applyStatFilter({ unassigned: true }) },
        ]}
      />
    </AdminPageShell>
  );
}

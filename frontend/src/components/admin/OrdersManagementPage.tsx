import { useCallback, useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  CalendarClock,
  Download,
  Package,
  Plus,
  ShoppingBag,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminOrder,
  type AdminOrderDetail,
  type AdminOrderEvent,
  type AdminOrderList,
  type AdminOrderStats,
  type OrderAppointment,
  type OrderFulfillment,
  type OrderListQuery,
  type OrderPayment,
  type OrderStatus,
  type OrderType,
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
  formatDateTime,
  formatMoney,
  initials,
  inputClass,
} from './partials';

const emptyFilters: OrderListQuery = {
  search: '',
  type: '',
  status: '',
  payment_status: '',
  fulfillment_status: '',
  appointment_status: '',
  store_id: '',
  category_id: '',
  attention: '',
  created_from: '',
  created_to: '',
  min_amount: '',
  max_amount: '',
  sort: 'newest',
  per_page: 25,
  page: 1,
};

const statusTone: Record<OrderStatus, string> = {
  new: 'bg-slate-100 text-slate-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-200 text-slate-700',
  on_hold: 'bg-rose-100 text-rose-700',
};

const statusLabel: Record<OrderStatus, MessageKey> = {
  new: 'admin.orderStatusNew',
  confirmed: 'admin.orderStatusConfirmed',
  in_progress: 'admin.orderStatusInProgress',
  completed: 'admin.orderStatusCompleted',
  cancelled: 'admin.orderStatusCancelled',
  on_hold: 'admin.orderStatusOnHold',
};

const typeTone: Record<OrderType, string> = {
  product_order: 'bg-amber-100 text-amber-800',
  service_booking: 'bg-blue-100 text-blue-800',
};

const typeLabel: Record<OrderType, MessageKey> = {
  product_order: 'admin.orderTypeProduct',
  service_booking: 'admin.orderTypeBooking',
};

const paymentTone: Record<OrderPayment, string> = {
  none: 'bg-slate-100 text-slate-600',
  pending: 'bg-amber-100 text-amber-700',
  authorized: 'bg-sky-100 text-sky-700',
  paid: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-rose-100 text-rose-700',
  refunded: 'bg-violet-100 text-violet-700',
};

const paymentLabel: Record<OrderPayment, MessageKey> = {
  none: 'admin.paymentNone',
  pending: 'admin.paymentPending',
  authorized: 'admin.paymentAuthorized',
  paid: 'admin.paymentPaid',
  failed: 'admin.paymentFailed',
  refunded: 'admin.paymentRefunded',
};

const fulfillmentLabel: Record<OrderFulfillment, MessageKey> = {
  unfulfilled: 'admin.fulfillmentUnfulfilled',
  processing: 'admin.fulfillmentProcessing',
  shipped: 'admin.fulfillmentShipped',
  delivered: 'admin.fulfillmentDelivered',
  ready_for_pickup: 'admin.fulfillmentReady',
  not_applicable: 'admin.notApplicable',
};

const appointmentLabel: Record<OrderAppointment, MessageKey> = {
  scheduled: 'admin.appointmentScheduled',
  assigned: 'admin.appointmentAssigned',
  in_progress: 'admin.appointmentInProgress',
  completed: 'admin.appointmentCompleted',
  no_show: 'admin.appointmentNoShow',
  not_applicable: 'admin.notApplicable',
};

export function OrdersManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<OrderListQuery>(emptyFilters);
  const [draft, setDraft] = useState<OrderListQuery>(emptyFilters);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<AdminOrderStats | null>(null);
  const [categories, setCategories] = useState<AdminOrderList['categories']>([]);
  const [stores, setStores] = useState<AdminOrderList['stores']>([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [events, setEvents] = useState<AdminOrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [note, setNote] = useState('');
  const [statusAction, setStatusAction] = useState<OrderStatus | ''>('');
  const [statusReason, setStatusReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const loadList = useCallback(async (query: OrderListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.orders(query);
      setOrders(data.orders);
      setStats(data.stats);
      setMeta(data.meta);
      setCategories(data.categories);
      setStores(data.stores);
      setSelectedIds([]);
      setActiveId((current) => current ?? data.orders[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.ordersLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadEvents = useCallback(async () => {
    try {
      setEvents((await adminApi.orderEvents(8)).events);
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

    adminApi.order(activeId)
      .then((order) => { if (!cancelled) setDetail(order); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });

    return () => { cancelled = true; };
  }, [activeId]);

  function applyDraft(next: OrderListQuery = { ...draft, page: 1 }) {
    setDraft(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<OrderListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = orders.map((order) => order.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  async function refreshAfterChange(order: AdminOrderDetail) {
    setDetail(order);
    setNotice(t('admin.orderStatusUpdated'));
    await loadList(filters);
    await loadEvents();
  }

  async function changeStatus(id: number, status: OrderStatus, reason?: string) {
    setSaving(true);
    setError('');

    try {
      await refreshAfterChange(await adminApi.updateOrderStatus(id, status, reason));
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

  async function applySelectedStatus(status: OrderStatus) {
    if (selectedIds.length === 0) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      for (const id of selectedIds) {
        await adminApi.updateOrderStatus(id, status, status === 'cancelled' || status === 'on_hold' ? t('admin.orderBulkReason') : undefined);
      }

      setNotice(t('admin.orderStatusUpdated'));
      await loadList(filters);
      await loadEvents();
      if (activeId) {
        setDetail(await adminApi.order(activeId));
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
      setDetail(await adminApi.addOrderNote(detail.id, note.trim()));
      setNote('');
      setNotice(t('admin.orderNoteAdded'));
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
      setError(t('admin.orderConfirmMismatch'));
      return;
    }

    await changeStatus(detail.id, statusAction, statusReason);
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.orderStatTotal'), value: stats.total, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({}) },
    { key: 'products', label: t('admin.orderStatProducts'), value: stats.product_orders, tone: 'bg-orange-100 text-orange-700', onClick: () => applyStatFilter({ type: 'product_order' }) },
    { key: 'bookings', label: t('admin.orderStatBookings'), value: stats.service_bookings, tone: 'bg-blue-100 text-blue-700', onClick: () => applyStatFilter({ type: 'service_booking' }) },
    { key: 'new', label: t('admin.orderStatNewMonth'), value: stats.new_this_month, tone: 'bg-sky-100 text-sky-700', onClick: () => applyStatFilter({}) },
    { key: 'pending', label: t('admin.orderStatusNew'), value: stats.new, tone: 'bg-amber-100 text-amber-800', onClick: () => applyStatFilter({ status: 'new' }) },
    { key: 'progress', label: t('admin.orderStatusInProgress'), value: stats.in_progress, tone: 'bg-indigo-100 text-indigo-700', onClick: () => applyStatFilter({ status: 'in_progress' }) },
    { key: 'hold', label: t('admin.orderStatAttention'), value: stats.attention, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ attention: true }) },
    { key: 'upcoming', label: t('admin.orderStatUpcoming'), value: stats.upcoming, tone: 'bg-cyan-100 text-cyan-700', onClick: () => applyStatFilter({ type: 'service_booking', appointment_status: 'scheduled' }) },
  ] : [];

  const tabs: { label: string; query: Partial<OrderListQuery>; count?: number }[] = [
    { label: t('admin.orderTabAll'), query: {}, count: stats?.total },
    { label: t('admin.orderTabProducts'), query: { type: 'product_order' }, count: stats?.product_orders },
    { label: t('admin.orderTabBookings'), query: { type: 'service_booking' }, count: stats?.service_bookings },
    { label: t('admin.orderStatusNew'), query: { status: 'new' }, count: stats?.new },
    { label: t('admin.orderStatusInProgress'), query: { status: 'in_progress' }, count: stats?.in_progress },
    { label: t('admin.orderStatusCompleted'), query: { status: 'completed' }, count: stats?.completed },
    { label: t('admin.orderStatusCancelled'), query: { status: 'cancelled' }, count: stats?.cancelled },
    { label: t('admin.orderTabAttention'), query: { attention: true }, count: stats?.attention },
  ];

  function tabActive(query: Partial<OrderListQuery>): boolean {
    return (filters.type ?? '') === (query.type ?? '')
      && (filters.status ?? '') === (query.status ?? '')
      && Boolean(filters.attention) === Boolean(query.attention);
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.ordersTitle')}
        intro={t('admin.ordersIntro')}
        crumb={t('admin.navOrdersBookings')}
        badge={stats ? t('admin.ordersTotal', { count: stats.total }) : undefined}
        icon={ShoppingBag}
        actions={(
          <>
            <AdminToolbarButton icon={Download} disabled title={t('admin.notYetAvailable')}>{t('admin.exportOrders')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} disabled title={t('admin.notYetAvailable')}>{t('admin.createOrder')}</AdminToolbarButton>
            <AdminToolbarButton icon={CalendarClock} primary disabled title={t('admin.notYetAvailable')}>{t('admin.createBooking')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid
        title={t('admin.orderOverviewTitle')}
        hint={t('admin.orderOverviewHint')}
        variant="overview"
        icon={ShoppingBag}
        cards={statCards}
      />

      {stats && stats.attention > 0 ? (
        <AdminAlertBanner
          tone="rose"
          title={t('admin.orderAttentionTitle', { count: stats.attention })}
          intro={t('admin.orderAttentionIntro')}
          action={t('admin.orderAttentionLink')}
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
        title={t('admin.orderFilterTitle')}
        intro={t('admin.orderFilterIntro')}
        onSubmit={() => applyDraft({ ...draft, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        search={{
          value: draft.search ?? '',
          onChange: (value) => setDraft((current) => ({ ...current, search: value })),
          placeholder: t('admin.orderSearchPlaceholder'),
        }}
      >
        <AdminField label={t('admin.orderType')}>
          <AdminSelect value={draft.type ?? ''} onChange={(value) => setDraft((current) => ({ ...current, type: value as OrderType | '' }))}>
            <option value="">{t('admin.allOrderTypes')}</option>
            {(Object.keys(typeLabel) as OrderType[]).map((type) => <option key={type} value={type}>{t(typeLabel[type])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.orderStatus')}>
          <AdminSelect value={draft.status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, status: value as OrderStatus | '' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            {(Object.keys(statusLabel) as OrderStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.orderPayment')}>
          <AdminSelect value={draft.payment_status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, payment_status: value as OrderPayment | '' }))}>
            <option value="">{t('admin.allPayments')}</option>
            {(Object.keys(paymentLabel) as OrderPayment[]).map((status) => <option key={status} value={status}>{t(paymentLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.orderFulfillment')}>
          <AdminSelect value={draft.fulfillment_status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, fulfillment_status: value as OrderFulfillment | '' }))}>
            <option value="">{t('admin.allFulfillment')}</option>
            {(Object.keys(fulfillmentLabel) as OrderFulfillment[]).map((status) => <option key={status} value={status}>{t(fulfillmentLabel[status])}</option>)}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.orderAppointment')}>
          <AdminSelect value={draft.appointment_status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, appointment_status: value as OrderAppointment | '' }))}>
            <option value="">{t('admin.allAppointments')}</option>
            {(Object.keys(appointmentLabel) as OrderAppointment[]).map((status) => <option key={status} value={status}>{t(appointmentLabel[status])}</option>)}
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
        <AdminField label={t('admin.orderDateFrom')}>
          <input type="date" value={draft.created_from ?? ''} onChange={(event) => setDraft((current) => ({ ...current, created_from: event.target.value }))} className={inputClass} />
        </AdminField>
        <AdminField label={t('admin.orderDateTo')}>
          <input type="date" value={draft.created_to ?? ''} onChange={(event) => setDraft((current) => ({ ...current, created_to: event.target.value }))} className={inputClass} />
        </AdminField>
        <AdminField label={t('admin.filterSort')}>
          <AdminSelect value={draft.sort ?? 'newest'} onChange={(value) => setDraft((current) => ({ ...current, sort: value as OrderListQuery['sort'] }))}>
            <option value="newest">{t('admin.orderSortNewest')}</option>
            <option value="oldest">{t('admin.orderSortOldest')}</option>
            <option value="updated">{t('admin.productSortUpdated')}</option>
            <option value="amount-high">{t('admin.orderSortAmountHigh')}</option>
            <option value="amount-low">{t('admin.orderSortAmountLow')}</option>
          </AdminSelect>
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.orderDirectoryTitle')}
          showing={t('admin.orderDirectoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.orderSelectPage')}
          selected={orders.length > 0 && orders.every((order) => selectedIds.includes(order.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.orderSelectedCount', { count: selectedIds.length })}>
              <AdminBulkButton disabled={saving} tone="blue" onClick={() => void applySelectedStatus('confirmed')}>{t('admin.orderConfirm')}</AdminBulkButton>
              <AdminBulkButton disabled={saving} tone="rose" onClick={() => void applySelectedStatus('on_hold')}>{t('admin.orderHold')}</AdminBulkButton>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedStatus('cancelled')}>{t('admin.orderCancel')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={orders.length === 0 ? t('admin.noOrders') : null}
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
              <th className="px-4 py-3"><input type="checkbox" checked={orders.every((order) => selectedIds.includes(order.id))} onChange={togglePage} className="rounded border-slate-300 text-amber-600" /></th>
              <th className="px-4 py-3">{t('admin.colTransaction')}</th>
              <th className="px-4 py-3">{t('admin.orderType')}</th>
              <th className="px-4 py-3">{t('admin.colCustomer')}</th>
              <th className="px-4 py-3">{t('admin.colVendorStore')}</th>
              <th className="px-4 py-3">{t('admin.colItem')}</th>
              <th className="px-4 py-3">{t('admin.colDate')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colTotal')}</th>
              <th className="px-4 py-3">{t('admin.orderPayment')}</th>
              <th className="px-4 py-3">{t('admin.colProgress')}</th>
              <th className="px-4 py-3">{t('admin.colStatus')}</th>
              <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const progress = order.type === 'service_booking'
                ? (order.appointment_status && order.appointment_status !== 'not_applicable' ? t(appointmentLabel[order.appointment_status]) : t('admin.unavailable'))
                : (order.fulfillment_status && order.fulfillment_status !== 'not_applicable' ? t(fulfillmentLabel[order.fulfillment_status]) : t('admin.unavailable'));
              const rowTone = order.needs_attention ? 'bg-rose-50/40' : selectedIds.includes(order.id) || activeId === order.id ? 'bg-amber-50/40' : '';

              return (
                <tr key={order.id} className={`${rowTone} cursor-pointer hover:bg-amber-50`} onClick={() => setActiveId(order.id)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => toggleSelected(order.id)} className="rounded border-slate-300 text-amber-600" />
                  </td>
                  <th className="px-4 py-4">
                    <p className="font-bold text-slate-950">{order.code}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(order.created_at, locale)}</p>
                  </th>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(typeLabel[order.type])} tone={typeTone[order.type]} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">{initials(order.customer?.name)}</span>
                      <div>
                        <p className="font-semibold">{order.customer?.name ?? t('admin.unavailable')}</p>
                        <p className="text-xs text-slate-500">{order.customer?.email ?? t('admin.unavailable')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><p className="font-semibold">{order.store?.vendor_name ?? t('admin.unavailable')}</p><p className="text-xs text-slate-500">{order.store?.name ?? t('admin.unavailable')}</p></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${order.type === 'service_booking' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.type === 'service_booking' ? <BriefcaseBusiness className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                      </span>
                      <div>
                        <p className="max-w-44 truncate font-medium">{order.item_name}</p>
                        <p className="text-xs text-slate-500">{t('admin.orderItemCount', { count: order.item_count })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{formatDateTime(order.type === 'service_booking' ? order.scheduled_at ?? order.created_at : order.created_at, locale)}</td>
                  <td className="px-4 py-4 text-right font-bold">{formatMoney(order.total, order.currency, locale)}</td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(paymentLabel[order.payment_status])} tone={paymentTone[order.payment_status]} /></td>
                  <td className="px-4 py-4 text-xs font-semibold text-slate-600">{progress}</td>
                  <td className="px-4 py-4"><AdminStatusBadge label={t(statusLabel[order.status])} tone={statusTone[order.status]} /></td>
                  <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <AdminActionMenu
                      open={openAction === order.id}
                      onToggle={() => setOpenAction((current) => (current === order.id ? null : order.id))}
                      onClose={() => setOpenAction(null)}
                      label={t('admin.actions')}
                    >
                      <AdminMenuItem onClick={() => { setActiveId(order.id); setOpenAction(null); }}>{t('admin.viewOrder')}</AdminMenuItem>
                      {order.status !== 'confirmed' && order.status !== 'completed' ? <AdminMenuItem tone="blue" onClick={() => void changeStatus(order.id, 'confirmed')}>{t('admin.orderConfirm')}</AdminMenuItem> : null}
                      {order.status !== 'on_hold' ? <AdminMenuItem tone="rose" onClick={() => void changeStatus(order.id, 'on_hold', t('admin.orderBulkReason'))}>{t('admin.orderHold')}</AdminMenuItem> : null}
                      {order.status !== 'cancelled' ? <AdminMenuItem onClick={() => void changeStatus(order.id, 'cancelled', t('admin.orderBulkReason'))}>{t('admin.orderCancel')}</AdminMenuItem> : null}
                    </AdminActionMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={t('admin.orderOverviewSelectedTitle')}
          intro={t('admin.orderOverviewSelected')}
          loading={detailLoading}
          loadingLabel={t('common.loading')}
          empty={t('admin.orderOverviewEmpty')}
          isEmpty={!detail}
        >
          {detail ? (
            <>
              <div className="p-5 text-center">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${detail.type === 'service_booking' ? 'bg-blue-100 text-blue-800' : 'bg-amber-400 text-slate-950'}`}>
                  {detail.type === 'service_booking' ? <BriefcaseBusiness className="h-7 w-7" /> : <Package className="h-7 w-7" />}
                </div>
                <h3 className="mt-3 text-lg font-bold">{detail.code}</h3>
                <p className="text-xs text-slate-400">{detail.item_name}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <AdminStatusBadge label={t(typeLabel[detail.type])} tone={typeTone[detail.type]} />
                  <AdminStatusBadge label={t(statusLabel[detail.status])} tone={statusTone[detail.status]} />
                  <AdminStatusBadge label={t(paymentLabel[detail.payment_status])} tone={paymentTone[detail.payment_status]} />
                </div>
              </div>
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.colCustomer'), value: detail.customer?.name ?? t('admin.unavailable') },
                  { label: t('admin.navVendors'), value: detail.store?.vendor_name ?? t('admin.unavailable') },
                  { label: t('admin.productStore'), value: detail.store?.name ?? t('admin.unavailable') },
                  { label: t('admin.colTotal'), value: formatMoney(detail.total, detail.currency, locale) },
                  { label: t('admin.colDate'), value: formatDateTime(detail.created_at, locale) },
                  { label: detail.type === 'service_booking' ? t('admin.orderAppointment') : t('admin.orderFulfillment'), value: detail.type === 'service_booking' ? (detail.appointment_status ? t(appointmentLabel[detail.appointment_status]) : t('admin.unavailable')) : (detail.fulfillment_status ? t(fulfillmentLabel[detail.fulfillment_status]) : t('admin.unavailable')) },
                ]}
              />
              <div className="grid grid-cols-2 gap-2 p-5">
                <a href="#admin-members" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('admin.viewCustomer')}</a>
                <a href="#admin-vendors" className="rounded-lg border px-3 py-2 text-center text-xs font-bold hover:bg-amber-50">{t('admin.viewVendor')}</a>
              </div>
            </>
          ) : null}
        </AdminDetailAside>
      </AdminSplitLayout>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminNotesCard
          title={t('admin.orderNotesTitle')}
          intro={t('admin.orderNotesIntro')}
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
          title={t('admin.orderStatusActions')}
          intro={t('admin.orderStatusActionsIntro')}
          onApply={() => void submitStatusForm()}
          disabled={!detail || !statusAction || saving}
        >
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-slate-500">{t('admin.currentStatus')}</dt><dd className="font-bold">{detail ? t(statusLabel[detail.status]) : t('admin.unavailable')}</dd></div>
            <div><dt className="text-xs text-slate-500">{t('admin.changedBy')}</dt><dd className="font-bold">{detail?.status_changed_by ?? t('admin.none')}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-slate-500">{t('admin.statusReason')}</dt><dd className="font-bold">{detail?.status_reason ?? t('admin.none')}</dd></div>
          </dl>
          <AdminSelect value={statusAction} onChange={(value) => setStatusAction(value as OrderStatus | '')}>
            <option value="">{t('admin.selectAction')}</option>
            {(Object.keys(statusLabel) as OrderStatus[]).map((status) => <option key={status} value={status}>{t(statusLabel[status])}</option>)}
          </AdminSelect>
          <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={t('admin.orderConfirmationPlaceholder')} className={inputClass} />
          <textarea rows={3} value={statusReason} onChange={(event) => setStatusReason(event.target.value)} className={inputClass} />
        </AdminStatusCard>

        <AdminActivityCard
          title={t('admin.orderActivityTitle')}
          intro={t('admin.orderActivityIntro')}
          headers={[]}
        >
          {events.length === 0 ? (
            <tr><td className="px-5 py-8 text-center text-slate-500">{t('admin.noOrders')}</td></tr>
          ) : events.map((event) => (
            <tr key={event.id}>
              <td className="px-5 py-4">
                <p className="font-semibold">{event.type === 'note' ? t('admin.eventNote') : t('admin.eventStatus')}</p>
                <p className="text-xs text-slate-500">{event.order ?? t('admin.unavailable')} · {event.author ?? t('admin.unavailable')}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDateTime(event.created_at, locale)}</p>
              </td>
            </tr>
          ))}
        </AdminActivityCard>
      </div>

      <AdminLinkGrid
        title={t('admin.orderAdminLinks')}
        intro={t('admin.orderAdminLinksIntro')}
        footnote={t('admin.orderCommerceNotReady')}
        links={[
          { key: t('admin.orderTabAll'), label: t('admin.orderTabAll'), onClick: () => applyStatFilter({}) },
          { key: t('admin.orderTabProducts'), label: t('admin.orderTabProducts'), onClick: () => applyStatFilter({ type: 'product_order' }) },
          { key: t('admin.orderTabBookings'), label: t('admin.orderTabBookings'), onClick: () => applyStatFilter({ type: 'service_booking' }) },
          { key: t('admin.orderStatusNew'), label: t('admin.orderStatusNew'), count: stats?.new, onClick: () => applyStatFilter({ status: 'new' }) },
          { key: t('admin.orderStatusOnHold'), label: t('admin.orderStatusOnHold'), count: stats?.on_hold, onClick: () => applyStatFilter({ status: 'on_hold' }) },
          { key: t('admin.orderTabAttention'), label: t('admin.orderTabAttention'), count: stats?.attention, onClick: () => applyStatFilter({ attention: true }) },
          { key: t('admin.paymentFailed'), label: t('admin.paymentFailed'), count: stats?.payment_failed, onClick: () => applyStatFilter({ payment_status: 'failed' }) },
          { key: t('admin.orderStatUpcoming'), label: t('admin.orderStatUpcoming'), count: stats?.upcoming, onClick: () => applyStatFilter({ type: 'service_booking', appointment_status: 'scheduled' }) },
        ]}
      />
    </AdminPageShell>
  );
}

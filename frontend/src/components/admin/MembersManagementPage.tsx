import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Download,
  Plus,
  Upload,
  Users,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminMember,
  type AdminMemberDetail,
  type AdminMemberEvent,
  type AdminMemberStats,
  type MemberListQuery,
  type MemberStatus,
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
  AdminPersonCell,
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

const emptyFilters: MemberListQuery = {
  search: '',
  status: '',
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
  restricted: 'bg-amber-100 text-amber-800',
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

function memberCode(id: number): string {
  return `MBR-${String(id).padStart(6, '0')}`;
}

export function MembersManagementPage() {
  const { t, locale } = useTranslation();
  const [filters, setFilters] = useState<MemberListQuery>(emptyFilters);
  const [draft, setDraft] = useState<MemberListQuery>(emptyFilters);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [stats, setStats] = useState<AdminMemberStats | null>(null);
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, last_page: 1, from: null as number | null, to: null as number | null });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminMemberDetail | null>(null);
  const [events, setEvents] = useState<AdminMemberEvent[]>([]);
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

  const loadList = useCallback(async (query: MemberListQuery) => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.members(query);
      setMembers(data.members);
      setStats(data.stats);
      setMeta(data.meta);
      setSelectedIds([]);
      setActiveId((current) => current ?? data.members[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.membersLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadEvents = useCallback(async () => {
    try {
      const data = await adminApi.memberEvents(8);
      setEvents(data.events);
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

    adminApi.member(activeId)
      .then((member) => {
        if (!cancelled) {
          setDetail(member);
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
  }, [activeId]);

  const verificationRate = useMemo(() => {
    if (!stats || stats.total === 0) {
      return '0%';
    }

    return `${Math.round((stats.verified / stats.total) * 1000) / 10}%`;
  }, [stats]);

  const activeFilters = [
    draft.status ? { key: 'status', label: t(statusLabel[draft.status]) } : null,
    draft.verification ? { key: 'verification', label: t(draft.verification === 'verified' ? 'admin.filterVerified' : 'admin.filterUnverified') } : null,
  ].filter(Boolean) as { key: string; label: string }[];

  function applyDraft(next: MemberListQuery = { ...draft, page: 1 }) {
    setDraft(next);
    setFilters(next);
  }

  function applyStatFilter(partial: Partial<MemberListQuery>) {
    applyDraft({ ...emptyFilters, ...partial, page: 1 });
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePage() {
    const ids = members.map((member) => member.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  async function refreshAfterChange(member: AdminMemberDetail) {
    setDetail(member);
    setNotice(t('admin.statusUpdated'));
    await loadList(filters);
    await loadEvents();
  }

  async function changeStatus(id: number, status: MemberStatus, reason?: string) {
    setSaving(true);
    setError('');

    try {
      const member = await adminApi.updateMemberStatus(id, status, reason);
      await refreshAfterChange(member);
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
        await adminApi.updateMemberStatus(id, status, status === 'active' ? undefined : t('admin.bulkReason'));
      }

      setNotice(t('admin.statusUpdated'));
      await loadList(filters);
      await loadEvents();

      if (activeId) {
        setDetail(await adminApi.member(activeId));
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
      const member = await adminApi.addMemberNote(detail.id, note.trim());
      setDetail(member);
      setNote('');
      setNotice(t('admin.noteAdded'));
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

    if (confirmation.trim().toUpperCase() !== memberCode(detail.id)) {
      setError(t('admin.confirmMismatch'));
      return;
    }

    await changeStatus(detail.id, statusAction, statusReason);
  }

  const statCards = stats ? [
    { key: 'total', label: t('admin.statTotal'), value: stats.total, tone: 'bg-slate-100 text-slate-700', onClick: () => applyStatFilter({}) },
    { key: 'active', label: t('admin.statActive'), value: stats.active, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ status: 'active' }) },
    { key: 'new', label: t('admin.statNewMonth'), value: stats.new_this_month, tone: 'bg-sky-100 text-sky-700', onClick: () => applyStatFilter({ registered_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10) }) },
    { key: 'verified', label: t('admin.statVerified'), value: stats.verified, tone: 'bg-emerald-100 text-emerald-700', onClick: () => applyStatFilter({ verification: 'verified' }) },
    { key: 'unverified', label: t('admin.statUnverified'), value: stats.unverified, tone: 'bg-amber-100 text-amber-700', onClick: () => applyStatFilter({ verification: 'unverified' }) },
    { key: 'restricted', label: t('admin.statRestricted'), value: stats.restricted, tone: 'bg-amber-100 text-amber-800', onClick: () => applyStatFilter({ status: 'restricted' }) },
    { key: 'suspended', label: t('admin.statSuspended'), value: stats.suspended, tone: 'bg-rose-100 text-rose-700', onClick: () => applyStatFilter({ status: 'suspended' }) },
    { key: 'deactivated', label: t('admin.statDeactivated'), value: stats.deactivated, tone: 'bg-slate-100 text-slate-600', onClick: () => applyStatFilter({ status: 'deactivated' }) },
  ] : [];

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.membersTitle')}
        intro={t('admin.membersIntro')}
        crumb={t('admin.navMembers')}
        badge={stats ? t('admin.membersTotal', { count: stats.total }) : undefined}
        actions={(
          <>
            <AdminToolbarButton icon={Download} disabled>{t('admin.exportMembers')}</AdminToolbarButton>
            <AdminToolbarButton icon={Upload} disabled>{t('admin.importMembers')}</AdminToolbarButton>
            <AdminToolbarButton icon={Plus} disabled primary>{t('admin.addMember')}</AdminToolbarButton>
          </>
        )}
      />

      <AdminFeedback error={error} notice={notice} />

      <AdminStatGrid variant="kpi" icon={Users} cards={statCards} />

      <AdminMetricTiles
        title={t('admin.growthTitle')}
        intro={t('admin.growthIntro')}
        columnsClass="grid-cols-2 sm:grid-cols-5"
        tiles={[
          { key: 'registrations', label: t('admin.growthRegistrations'), value: stats?.new_this_month ?? 0, tone: 'bg-slate-50' },
          { key: 'activated', label: t('admin.growthActivated'), value: stats?.active ?? 0, tone: 'bg-emerald-50', valueClass: 'text-emerald-700' },
          { key: 'deactivated', label: t('admin.growthDeactivated'), value: stats?.deactivated ?? 0, tone: 'bg-rose-50', valueClass: 'text-rose-700' },
          { key: 'verification', label: t('admin.growthVerification'), value: verificationRate, tone: 'bg-amber-50', valueClass: 'text-amber-700' },
          { key: 'unverified', label: t('admin.statUnverified'), value: stats?.unverified ?? 0, tone: 'bg-sky-50', valueClass: 'text-sky-700' },
        ]}
      />

      <AdminFilterCard
        title={t('admin.filterTitle')}
        search={{
          value: draft.search ?? '',
          onChange: (value) => setDraft((current) => ({ ...current, search: value })),
          placeholder: t('admin.filterSearchPlaceholder'),
          id: 'member-search',
          label: t('admin.filterSearch'),
        }}
        onSubmit={() => applyDraft({ ...draft, page: 1 })}
        onClear={() => applyDraft({ ...emptyFilters })}
        chips={activeFilters.map((chip) => (
          <span key={chip.key} className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-900">
            {chip.label}
          </span>
        ))}
      >
        <AdminField label={t('admin.filterStatus')} htmlFor="account-status">
          <AdminSelect id="account-status" value={draft.status ?? ''} onChange={(value) => setDraft((current) => ({ ...current, status: value as MemberStatus | '' }))}>
            <option value="">{t('admin.filterAllStatuses')}</option>
            {(['active', 'pending', 'restricted', 'suspended', 'deactivated'] as MemberStatus[]).map((status) => (
              <option key={status} value={status}>{t(statusLabel[status])}</option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterVerification')} htmlFor="verification">
          <AdminSelect id="verification" value={draft.verification ?? ''} onChange={(value) => setDraft((current) => ({ ...current, verification: value as 'verified' | 'unverified' | '' }))}>
            <option value="">{t('admin.filterAllVerification')}</option>
            <option value="verified">{t('admin.filterVerified')}</option>
            <option value="unverified">{t('admin.filterUnverified')}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterSort')} htmlFor="sort">
          <AdminSelect id="sort" value={draft.sort ?? ''} onChange={(value) => setDraft((current) => ({ ...current, sort: value as MemberListQuery['sort'] }))}>
            <option value="newest">{t('admin.sortNewest')}</option>
            <option value="oldest">{t('admin.sortOldest')}</option>
            <option value="name-asc">{t('admin.sortNameAsc')}</option>
            <option value="name-desc">{t('admin.sortNameDesc')}</option>
            <option value="recently-active">{t('admin.sortActive')}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={t('admin.filterFrom')} htmlFor="registered-from">
          <input id="registered-from" type="date" value={draft.registered_from ?? ''} onChange={(event) => setDraft((current) => ({ ...current, registered_from: event.target.value }))} className={inputClass} />
        </AdminField>
        <AdminField label={t('admin.filterTo')} htmlFor="registered-to">
          <input id="registered-to" type="date" value={draft.registered_to ?? ''} onChange={(event) => setDraft((current) => ({ ...current, registered_to: event.target.value }))} className={inputClass} />
        </AdminField>
      </AdminFilterCard>

      <AdminSplitLayout>
        <AdminDirectory
          title={t('admin.directoryTitle')}
          showing={t('admin.directoryShowing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total })}
          selectLabel={t('admin.selectPage')}
          selected={members.length > 0 && members.every((member) => selectedIds.includes(member.id))}
          onToggleSelectPage={togglePage}
          selectedCount={selectedIds.length}
          selectedBar={(
            <AdminSelectedBar countLabel={t('admin.selectedCount', { count: selectedIds.length })}>
              <AdminBulkButton disabled={saving} onClick={() => void applySelectedStatus('restricted')}>{t('admin.bulkRestrict')}</AdminBulkButton>
              <AdminBulkButton tone="rose" disabled={saving} onClick={() => void applySelectedStatus('suspended')}>{t('admin.bulkSuspend')}</AdminBulkButton>
              <AdminBulkButton tone="emerald" disabled={saving} onClick={() => void applySelectedStatus('active')}>{t('admin.bulkReactivate')}</AdminBulkButton>
              <button type="button" onClick={() => setSelectedIds([])} className="px-2 py-2 text-xs font-bold text-slate-500 hover:text-slate-900">{t('admin.clearSelection')}</button>
            </AdminSelectedBar>
          )}
          loading={loading}
          loadingLabel={t('common.loading')}
          empty={members.length === 0 ? t('admin.noMembers') : null}
          pagination={(
            <AdminPaginationBar
              meta={meta}
              perPage={filters.per_page ?? 25}
              onPerPage={(size) => applyDraft({ ...filters, per_page: size, page: 1 })}
              onPage={(page) => applyDraft({ ...filters, page })}
            />
          )}
        >
          <caption className="sr-only">{t('admin.directoryTitle')}</caption>
          <AdminTableHead>
            <tr>
              <th scope="col" className="px-4 py-3"><input type="checkbox" checked={members.every((member) => selectedIds.includes(member.id))} onChange={togglePage} aria-label={t('admin.selectPage')} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" /></th>
              <th scope="col" className="px-4 py-3">{t('admin.colMember')}</th>
              <th scope="col" className="px-4 py-3">{t('admin.colId')}</th>
              <th scope="col" className="px-4 py-3">{t('admin.colContact')}</th>
              <th scope="col" className="px-4 py-3">{t('admin.colVerification')}</th>
              <th scope="col" className="px-4 py-3">{t('admin.colJoined')}</th>
              <th scope="col" className="px-4 py-3">{t('admin.colLastActive')}</th>
              <th scope="col" className="px-4 py-3">{t('admin.colStatus')}</th>
              <th scope="col" className="px-4 py-3 text-right">{t('admin.colActions')}</th>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => {
              const selected = selectedIds.includes(member.id) || activeId === member.id;
              const rowTone = member.status === 'suspended' ? 'bg-rose-50/30' : member.status === 'restricted' ? 'bg-amber-50/30' : member.status === 'deactivated' ? 'text-slate-500' : selected ? 'bg-amber-50/40' : '';

              return (
                <tr key={member.id} className={`${rowTone} cursor-pointer hover:bg-amber-50`} onClick={() => setActiveId(member.id)}>
                  <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(member.id)} onChange={() => toggleSelected(member.id)} aria-label={member.name} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                  </td>
                  <th scope="row" className="px-4 py-4">
                    <AdminPersonCell
                      name={member.name}
                      sub={member.username ? `@${member.username}` : t('admin.unavailable')}
                      avatarUrl={member.avatar_url}
                      initials={member.initials}
                    />
                  </th>
                  <td className="px-4 py-4 font-mono text-xs">{memberCode(member.id)}</td>
                  <td className="px-4 py-4">
                    <p>{member.email}</p>
                    <p className="text-xs text-slate-500">{member.phone ?? t('admin.unavailable')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className={`font-semibold ${member.email_verified_at ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {member.email_verified_at ? t('admin.filterVerified') : t('admin.filterUnverified')}
                    </p>
                  </td>
                  <td className="px-4 py-4">{formatDate(member.joined_at, locale)}</td>
                  <td className="px-4 py-4">{formatDateTime(member.last_active_at, locale)}</td>
                  <td className="px-4 py-4">
                    <AdminStatusBadge label={t(statusLabel[member.status])} tone={statusTone[member.status]} />
                  </td>
                  <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                    <AdminActionMenu
                      open={openAction === member.id}
                      onToggle={() => setOpenAction((current) => (current === member.id ? null : member.id))}
                      onClose={() => setOpenAction(null)}
                      label={t('admin.actions')}
                    >
                      <AdminMenuItem onClick={() => { setActiveId(member.id); setOpenAction(null); }}>{t('admin.viewMember')}</AdminMenuItem>
                      {member.status !== 'active' ? <AdminMenuItem tone="emerald" onClick={() => void changeStatus(member.id, 'active')}>{t('admin.bulkReactivate')}</AdminMenuItem> : null}
                      {member.status === 'active' ? <AdminMenuItem tone="amber" onClick={() => void changeStatus(member.id, 'restricted', t('admin.bulkReason'))}>{t('admin.bulkRestrict')}</AdminMenuItem> : null}
                      {member.status !== 'suspended' ? <AdminMenuItem tone="rose" onClick={() => void changeStatus(member.id, 'suspended', t('admin.bulkReason'))}>{t('admin.bulkSuspend')}</AdminMenuItem> : null}
                    </AdminActionMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </AdminDirectory>

        <AdminDetailAside
          title={t('admin.overviewTitle')}
          intro={t('admin.overviewSelected')}
          loading={detailLoading}
          loadingLabel={t('common.loading')}
          empty={t('admin.overviewEmpty')}
          isEmpty={!detail}
        >
          {detail ? (
            <>
              <div className="p-5 text-center">
                {detail.avatar_url ? (
                  <img src={detail.avatar_url} alt="" className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-amber-100" />
                ) : (
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-2xl font-black text-slate-950 ring-4 ring-amber-100">{detail.initials}</div>
                )}
                <h3 className="mt-3 text-lg font-bold">{detail.display_name || detail.name}</h3>
                <p className="text-sm text-slate-500">{detail.username ? `@${detail.username}` : t('admin.unavailable')} · {memberCode(detail.id)}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <AdminStatusBadge label={t(statusLabel[detail.status])} tone={statusTone[detail.status]} />
                  <AdminStatusBadge
                    label={detail.email_verified_at ? t('admin.filterVerified') : t('admin.filterUnverified')}
                    tone={detail.email_verified_at ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}
                  />
                </div>
              </div>
              <AdminDefinitionGrid
                items={[
                  { label: t('admin.memberSince'), value: formatDate(detail.joined_at, locale) },
                  { label: t('admin.lastActive'), value: formatDateTime(detail.last_active_at, locale) },
                  { label: t('admin.location'), value: detail.location ? [detail.location.city, detail.location.state, detail.location.country].filter(Boolean).join(', ') : t('admin.unavailable') },
                  { label: t('admin.language'), value: detail.language?.toUpperCase() ?? t('admin.unavailable') },
                  { label: t('admin.timezone'), value: detail.timezone ?? t('admin.unavailable') },
                  { label: t('admin.email'), value: <span className="truncate">{detail.email}</span> },
                  { label: t('admin.phone'), value: detail.phone ?? t('admin.unavailable') },
                  { label: t('admin.addresses'), value: detail.address_count },
                  { label: t('admin.publicProfile'), value: detail.is_public ? t('admin.yesPublic') : t('admin.noPublic'), span: true },
                ]}
              />
            </>
          ) : null}
        </AdminDetailAside>
      </AdminSplitLayout>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminNotesCard
          title={t('admin.notesTitle')}
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

        <AdminStatusCard
          title={t('admin.statusActions')}
          intro={t('admin.statusActionsIntro')}
          onApply={() => void submitStatusForm()}
          disabled={!detail || !statusAction || saving}
        >
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-slate-500">{t('admin.currentStatus')}</dt><dd className="font-bold">{detail ? t(statusLabel[detail.status]) : t('admin.unavailable')}</dd></div>
            <div><dt className="text-xs text-slate-500">{t('admin.statusChanged')}</dt><dd className="font-bold">{formatDateTime(detail?.status_changed_at ?? null, locale)}</dd></div>
            <div><dt className="text-xs text-slate-500">{t('admin.changedBy')}</dt><dd className="font-bold">{detail?.status_changed_by ?? t('admin.none')}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-slate-500">{t('admin.statusReason')}</dt><dd className="font-bold">{detail?.status_reason ?? t('admin.none')}</dd></div>
          </dl>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status-action" className="block text-sm font-semibold">{t('admin.statusAction')}</label>
              <select id="status-action" value={statusAction} onChange={(event) => setStatusAction(event.target.value as MemberStatus | '')} className={inputClass}>
                <option value="">{t('admin.selectAction')}</option>
                {(['active', 'pending', 'restricted', 'suspended', 'deactivated'] as MemberStatus[]).map((status) => (
                  <option key={status} value={status}>{t(statusLabel[status])}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="confirmation" className="block text-sm font-semibold">{t('admin.confirmation')}</label>
              <input id="confirmation" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={t('admin.confirmationPlaceholder')} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="status-reason" className="block text-sm font-semibold">{t('admin.requiredReason')}</label>
              <textarea id="status-reason" rows={3} value={statusReason} onChange={(event) => setStatusReason(event.target.value)} className={inputClass} />
            </div>
          </div>
        </AdminStatusCard>
      </div>

      <AdminActivityCard
        title={t('admin.activityTitle')}
        intro={t('admin.activityIntro')}
        headers={[t('admin.colAction'), t('admin.colMember'), t('admin.colAdministrator'), t('admin.colDate'), t('admin.colReason')]}
      >
        {events.length === 0 ? (
          <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">{t('admin.noMembers')}</td></tr>
        ) : events.map((event) => (
          <tr key={event.id}>
            <td className="px-5 py-4 font-semibold">{event.type === 'note' ? t('admin.eventNote') : t('admin.eventStatus')}</td>
            <td className="px-5 py-4">{event.member ?? detail?.name ?? t('admin.unavailable')}</td>
            <td className="px-5 py-4">{event.author ?? t('admin.unavailable')}</td>
            <td className="px-5 py-4">{formatDateTime(event.created_at, locale)}</td>
            <td className="px-5 py-4">{event.body ?? (event.from_status && event.to_status ? `${event.from_status} → ${event.to_status}` : t('admin.none'))}</td>
          </tr>
        ))}
      </AdminActivityCard>

      <AdminLinkGrid
        title={t('admin.adminLinks')}
        intro={t('admin.adminLinksIntro')}
        footnote={t('admin.commerceNotReady')}
        links={[
          { key: 'all', label: t('admin.linkAll'), onClick: () => applyStatFilter({}) },
          { key: 'active', label: t('admin.linkActive'), onClick: () => applyStatFilter({ status: 'active' }) },
          { key: 'pending', label: t('admin.linkPending'), onClick: () => applyStatFilter({ status: 'pending' }) },
          { key: 'restricted', label: t('admin.linkRestricted'), onClick: () => applyStatFilter({ status: 'restricted' }) },
          { key: 'suspended', label: t('admin.linkSuspended'), count: stats?.suspended, onClick: () => applyStatFilter({ status: 'suspended' }) },
          { key: 'deactivated', label: t('admin.linkDeactivated'), onClick: () => applyStatFilter({ status: 'deactivated' }) },
          { key: 'unverified', label: t('admin.linkUnverified'), count: stats?.unverified, onClick: () => applyStatFilter({ verification: 'unverified' }) },
          { key: 'new', label: t('admin.linkNew'), onClick: () => applyStatFilter({ registered_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10) }) },
        ]}
      />
    </AdminPageShell>
  );
}

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ExternalLink, Percent, Plus, Trash2 } from 'lucide-react';

import { useTranslation } from '../../i18n';
import { PageLoader } from '../ui/Spinner';
import { ApiError } from '../../lib/api';
import {
  adminApi,
  type AdminPpfDirectory,
  type AdminPpfStats,
  type PpfFaqPayload,
  type PpfMarketPayload,
  type PpfPlanPayload,
  type PpfTierPayload,
} from '../../lib/admin';
import type { PpfCopy, PpfFaq, PpfMarket, PpfPlan, PpfSettings, PpfTier } from '../../lib/ppf';
import {
  AdminFeedback,
  AdminField,
  AdminPageHeader,
  AdminPageShell,
  AdminSelect,
  AdminTabs,
  AdminToolbarButton,
  inputClass,
  primaryButton,
} from './partials';

const emptyCopy = {
  eyebrow: '', title: '', subtitle: '',
  primary_cta_label: '', primary_cta_href: '',
  secondary_cta_label: '', secondary_cta_href: '',
  trust_line: '', aside_title: '', aside_subtitle: '',
  distinction_title: '', distinction_body: '',
  tiers_eyebrow: '', tiers_title: '', tiers_subtitle: '',
  pricing_eyebrow: '', pricing_title: '',
  estimator_eyebrow: '', estimator_title: '', estimator_subtitle: '', estimator_disclaimer: '',
  anatomy_eyebrow: '', anatomy_title: '',
  rewards_eyebrow: '', rewards_title: '', rewards_body: '',
  rewards_company_label: '', rewards_fund_label: '', rewards_points_label: '',
  rewards_conversion_note: '',
  faq_eyebrow: '', faq_title: '',
  cta_title: '', cta_body: '',
  cta_primary_label: '', cta_primary_href: '',
  cta_secondary_label: '', cta_secondary_href: '',
} satisfies PpfCopy;

type Tab = 'page' | 'tiers' | 'markets' | 'plans' | 'faqs';

const emptyStats: AdminPpfStats = {
  published: false, tiers: 0, markets: 0, schedules: 0, plans: 0, faqs: 0, inactive: 0,
};

export function PpfManagementPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('page');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [stats, setStats] = useState<AdminPpfStats>(emptyStats);
  const [settings, setSettings] = useState<PpfSettings | null>(null);
  const [tiers, setTiers] = useState<PpfTier[]>([]);
  const [markets, setMarkets] = useState<PpfMarket[]>([]);
  const [plans, setPlans] = useState<PpfPlan[]>([]);
  const [faqs, setFaqs] = useState<PpfFaq[]>([]);
  const [copy, setCopy] = useState<PpfCopy>(emptyCopy);
  const [published, setPublished] = useState(false);
  const [processingPercent, setProcessingPercent] = useState('');
  const [processingFixed, setProcessingFixed] = useState('');
  const [companyPercent, setCompanyPercent] = useState('');
  const [compensationPercent, setCompensationPercent] = useState('');
  const [rpPerDollar, setRpPerDollar] = useState('');
  const [examplePpf, setExamplePpf] = useState('');
  const [anatomy, setAnatomy] = useState('');
  const [ctaLinks, setCtaLinks] = useState('');
  const [statementTitle, setStatementTitle] = useState('');
  const [statementReference, setStatementReference] = useState('');
  const [statementStatus, setStatementStatus] = useState('');
  const [statementNote, setStatementNote] = useState('');
  const [statementLines, setStatementLines] = useState('');
  const [movement, setMovement] = useState({
    eyebrow: '', title: '', body: '', sample_label: '', current_label: '',
    progress_label: '', remaining_label: '', current_tier: '', progress: '0',
  });

  const load = useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.ppf();
      applyDirectory(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('admin.ppfLoadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  function applyDirectory(data: AdminPpfDirectory) {
    setStats(data.stats);
    setSettings(data.settings);
    setTiers(data.tiers);
    setMarkets(data.markets);
    setPlans(data.plans);
    setFaqs(data.faqs);
    setCopy({ ...emptyCopy, ...data.settings.copy });
    setPublished(data.settings.is_published);
    setProcessingPercent(data.settings.processing_percent === null ? '' : String(data.settings.processing_percent));
    setProcessingFixed(data.settings.processing_fixed === null ? '' : String(data.settings.processing_fixed));
    setCompanyPercent(data.settings.company_percent === null ? '' : String(data.settings.company_percent));
    setCompensationPercent(data.settings.compensation_percent === null ? '' : String(data.settings.compensation_percent));
    setRpPerDollar(data.settings.rp_per_dollar === null ? '' : String(data.settings.rp_per_dollar));
    setExamplePpf(data.settings.example_ppf_amount === null ? '' : String(data.settings.example_ppf_amount));
    setAnatomy(data.settings.anatomy_items.map((item) => `${item.title}|${item.body}`).join('\n'));
    setCtaLinks(data.settings.cta_links.map((item) => `${item.label}|${item.href}`).join('\n'));
    setStatementTitle(data.settings.statement.title);
    setStatementReference(data.settings.statement.reference);
    setStatementStatus(data.settings.statement.status);
    setStatementNote(data.settings.statement.note);
    setStatementLines(data.settings.statement.lines.map((line) => `${line.label}|${line.value}|${line.tone ?? ''}`).join('\n'));
    setMovement({
      eyebrow: data.settings.movement.eyebrow ?? '',
      title: data.settings.movement.title ?? '',
      body: data.settings.movement.body ?? '',
      sample_label: data.settings.movement.sample_label ?? '',
      current_label: data.settings.movement.current_label ?? '',
      progress_label: data.settings.movement.progress_label ?? '',
      remaining_label: data.settings.movement.remaining_label ?? '',
      current_tier: data.settings.movement.current_tier ?? '',
      progress: String(data.settings.movement.progress ?? 0),
    });
  }

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    setSaving(true);
    setError('');
    setNotice('');

    try {
      const result = await adminApi.updatePpfSettings({
        is_published: published,
        copy,
        processing_percent: processingPercent === '' ? null : Number(processingPercent),
        processing_fixed: processingFixed === '' ? null : Number(processingFixed),
        company_percent: companyPercent === '' ? null : Number(companyPercent),
        compensation_percent: compensationPercent === '' ? null : Number(compensationPercent),
        rp_per_dollar: rpPerDollar === '' ? null : Number(rpPerDollar),
        example_ppf_amount: examplePpf === '' ? null : Number(examplePpf),
        anatomy_items: parsePairs(anatomy).map(([title, body]) => ({ title, body })),
        cta_links: parsePairs(ctaLinks).map(([label, href]) => ({ label, href })),
        statement: {
          title: statementTitle,
          reference: statementReference,
          status: statementStatus,
          note: statementNote,
          lines: parsePairs(statementLines, 3).map(([label, value, tone]) => ({ label, value, tone: tone || undefined })),
        },
        movement: {
          ...movement,
          progress: Number(movement.progress || 0),
        },
      });
      setSettings(result.settings);
      setNotice(result.message);
      await load();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : t('admin.ppfSaveFailed'));
    } finally {
      setSaving(false);
    }
  }

  const parentMarkets = useMemo(() => markets.filter((market) => market.parent_id === null), [markets]);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title={t('admin.ppfTitle')}
        intro={t('admin.ppfIntro')}
        crumb={t('admin.navPpf')}
        icon={Percent}
        badge={stats.published ? t('admin.ppfPublished') : t('admin.ppfUnpublished')}
        actions={
          <>
            <AdminToolbarButton icon={ExternalLink} disabled={false} onClick={() => { window.location.hash = '#platform-fees'; }}>
              {t('admin.ppfViewPage')}
            </AdminToolbarButton>
            {tab === 'page' ? (
              <button type="button" disabled={saving} onClick={() => void saveSettings()} className={primaryButton}>
                {saving ? t('common.saving') : t('admin.ppfSavePage')}
              </button>
            ) : null}
          </>
        }
      />
      <AdminFeedback error={error} notice={notice} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [t('admin.ppfStatMarkets'), stats.markets],
          [t('admin.ppfStatTiers'), stats.tiers],
          [t('admin.ppfStatPlans'), stats.plans],
          [t('admin.ppfStatFaqs'), stats.faqs],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-black text-slate-950">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <AdminTabs tabs={[
        { key: 'page', label: t('admin.ppfTabPage'), active: tab === 'page', onClick: () => setTab('page') },
        { key: 'tiers', label: t('admin.ppfTabTiers'), count: tiers.length, active: tab === 'tiers', onClick: () => setTab('tiers') },
        { key: 'markets', label: t('admin.ppfTabMarkets'), count: markets.length, active: tab === 'markets', onClick: () => setTab('markets') },
        { key: 'plans', label: t('admin.ppfTabPlans'), count: plans.length, active: tab === 'plans', onClick: () => setTab('plans') },
        { key: 'faqs', label: t('admin.ppfTabFaqs'), count: faqs.length, active: tab === 'faqs', onClick: () => setTab('faqs') },
      ]} />
      {loading ? <PageLoader label={t('common.loading')} /> : null}
      {tab === 'page' && settings ? (
        <PageEditor
          copy={copy}
          published={published}
          processingPercent={processingPercent}
          processingFixed={processingFixed}
          companyPercent={companyPercent}
          compensationPercent={compensationPercent}
          rpPerDollar={rpPerDollar}
          examplePpf={examplePpf}
          anatomy={anatomy}
          ctaLinks={ctaLinks}
          statementTitle={statementTitle}
          statementReference={statementReference}
          statementStatus={statementStatus}
          statementNote={statementNote}
          statementLines={statementLines}
          movement={movement}
          onCopy={(key, value) => setCopy((current) => ({ ...current, [key]: value }))}
          onPublished={setPublished}
          onProcessingPercent={setProcessingPercent}
          onProcessingFixed={setProcessingFixed}
          onCompanyPercent={setCompanyPercent}
          onCompensationPercent={setCompensationPercent}
          onRpPerDollar={setRpPerDollar}
          onExamplePpf={setExamplePpf}
          onAnatomy={setAnatomy}
          onCtaLinks={setCtaLinks}
          onStatementTitle={setStatementTitle}
          onStatementReference={setStatementReference}
          onStatementStatus={setStatementStatus}
          onStatementNote={setStatementNote}
          onStatementLines={setStatementLines}
          onMovement={(key, value) => setMovement((current) => ({ ...current, [key]: value }))}
        />
      ) : null}
      {tab === 'tiers' ? <TierEditor tiers={tiers} onChange={load} onNotice={setNotice} onError={setError} /> : null}
      {tab === 'markets' ? <MarketEditor markets={markets} parents={parentMarkets} onChange={load} onNotice={setNotice} onError={setError} /> : null}
      {tab === 'plans' ? <PlanEditor plans={plans} markets={markets} tiers={tiers} onChange={load} onNotice={setNotice} onError={setError} /> : null}
      {tab === 'faqs' ? <FaqEditor faqs={faqs} onChange={load} onNotice={setNotice} onError={setError} /> : null}
    </AdminPageShell>
  );
}

function PageEditor({
  copy, published, processingPercent, processingFixed, companyPercent, compensationPercent, rpPerDollar, examplePpf, anatomy, ctaLinks,
  statementTitle, statementReference, statementStatus, statementNote, statementLines, movement,
  onCopy, onPublished, onProcessingPercent, onProcessingFixed, onCompanyPercent, onCompensationPercent, onRpPerDollar, onExamplePpf, onAnatomy, onCtaLinks,
  onStatementTitle, onStatementReference, onStatementStatus, onStatementNote, onStatementLines, onMovement,
}: {
  copy: PpfCopy;
  published: boolean;
  processingPercent: string;
  processingFixed: string;
  companyPercent: string;
  compensationPercent: string;
  rpPerDollar: string;
  examplePpf: string;
  anatomy: string;
  ctaLinks: string;
  statementTitle: string;
  statementReference: string;
  statementStatus: string;
  statementNote: string;
  statementLines: string;
  movement: Record<string, string>;
  onCopy: (key: keyof PpfCopy, value: string) => void;
  onPublished: (value: boolean) => void;
  onProcessingPercent: (value: string) => void;
  onProcessingFixed: (value: string) => void;
  onCompanyPercent: (value: string) => void;
  onCompensationPercent: (value: string) => void;
  onRpPerDollar: (value: string) => void;
  onExamplePpf: (value: string) => void;
  onAnatomy: (value: string) => void;
  onCtaLinks: (value: string) => void;
  onStatementTitle: (value: string) => void;
  onStatementReference: (value: string) => void;
  onStatementStatus: (value: string) => void;
  onStatementNote: (value: string) => void;
  onStatementLines: (value: string) => void;
  onMovement: (key: string, value: string) => void;
}) {
  const { t } = useTranslation();
  const fields: (keyof PpfCopy)[] = [
    'eyebrow', 'title', 'subtitle', 'trust_line',
    'primary_cta_label', 'primary_cta_href', 'secondary_cta_label', 'secondary_cta_href',
    'aside_title', 'aside_subtitle', 'distinction_title', 'distinction_body',
    'tiers_eyebrow', 'tiers_title', 'tiers_subtitle', 'pricing_eyebrow', 'pricing_title',
    'estimator_eyebrow', 'estimator_title', 'estimator_subtitle', 'estimator_disclaimer',
    'anatomy_eyebrow', 'anatomy_title',
    'rewards_eyebrow', 'rewards_title', 'rewards_body',
    'rewards_company_label', 'rewards_fund_label', 'rewards_points_label', 'rewards_conversion_note',
    'faq_eyebrow', 'faq_title',
    'cta_title', 'cta_body', 'cta_primary_label', 'cta_primary_href', 'cta_secondary_label', 'cta_secondary_href',
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={published} onChange={(event) => onPublished(event.target.checked)} />
        {t('admin.ppfPublish')}
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <AdminField key={field} label={t(`admin.ppfCopy.${field}` as 'admin.ppfCopy.title')} htmlFor={`ppf-${field}`}>
            {field.endsWith('body') || field.endsWith('subtitle') || field === 'trust_line' || field === 'estimator_disclaimer' || field === 'rewards_conversion_note' ? (
              <textarea id={`ppf-${field}`} className={inputClass} rows={3} value={copy[field]} onChange={(event) => onCopy(field, event.target.value)} />
            ) : (
              <input id={`ppf-${field}`} className={inputClass} value={copy[field]} onChange={(event) => onCopy(field, event.target.value)} />
            )}
          </AdminField>
        ))}
        <AdminField label={t('admin.ppfProcessingPercent')}>
          <input className={inputClass} value={processingPercent} onChange={(event) => onProcessingPercent(event.target.value)} />
        </AdminField>
        <AdminField label={t('admin.ppfProcessingFixed')}>
          <input className={inputClass} value={processingFixed} onChange={(event) => onProcessingFixed(event.target.value)} />
        </AdminField>
        <AdminField label={t('admin.ppfCompanyPercent')}>
          <input className={inputClass} value={companyPercent} onChange={(event) => onCompanyPercent(event.target.value)} />
        </AdminField>
        <AdminField label={t('admin.ppfCompensationPercent')}>
          <input className={inputClass} value={compensationPercent} onChange={(event) => onCompensationPercent(event.target.value)} />
        </AdminField>
        <AdminField label={t('admin.ppfRpPerDollar')}>
          <input className={inputClass} value={rpPerDollar} onChange={(event) => onRpPerDollar(event.target.value)} />
        </AdminField>
        <AdminField label={t('admin.ppfExamplePpf')}>
          <input className={inputClass} value={examplePpf} onChange={(event) => onExamplePpf(event.target.value)} />
        </AdminField>
      </div>
      <AdminField label={t('admin.ppfAnatomyHint')}>
        <textarea className={inputClass} rows={6} value={anatomy} onChange={(event) => onAnatomy(event.target.value)} />
      </AdminField>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label={t('admin.ppfStatementTitle')}><input className={inputClass} value={statementTitle} onChange={(event) => onStatementTitle(event.target.value)} /></AdminField>
        <AdminField label={t('admin.ppfStatementReference')}><input className={inputClass} value={statementReference} onChange={(event) => onStatementReference(event.target.value)} /></AdminField>
        <AdminField label={t('admin.ppfStatementStatus')}><input className={inputClass} value={statementStatus} onChange={(event) => onStatementStatus(event.target.value)} /></AdminField>
        <AdminField label={t('admin.ppfStatementNote')}><input className={inputClass} value={statementNote} onChange={(event) => onStatementNote(event.target.value)} /></AdminField>
      </div>
      <AdminField label={t('admin.ppfStatementLines')}><textarea className={inputClass} rows={6} value={statementLines} onChange={(event) => onStatementLines(event.target.value)} /></AdminField>
      <div className="grid gap-4 md:grid-cols-2">
        {(['eyebrow', 'title', 'body', 'sample_label', 'current_label', 'progress_label', 'remaining_label', 'current_tier', 'progress'] as const).map((key) => (
          <AdminField key={key} label={t(`admin.ppfMovement.${key}` as 'admin.ppfMovement.title')}>
            {key === 'body' ? (
              <textarea className={inputClass} rows={3} value={movement[key]} onChange={(event) => onMovement(key, event.target.value)} />
            ) : (
              <input className={inputClass} value={movement[key]} onChange={(event) => onMovement(key, event.target.value)} />
            )}
          </AdminField>
        ))}
      </div>
      <AdminField label={t('admin.ppfCtaLinksHint')}>
        <textarea className={inputClass} rows={4} value={ctaLinks} onChange={(event) => onCtaLinks(event.target.value)} />
      </AdminField>
    </div>
  );
}

function TierEditor({ tiers, onChange, onNotice, onError }: { tiers: PpfTier[]; onChange: () => Promise<void>; onNotice: (value: string) => void; onError: (value: string) => void }) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<PpfTierPayload>({ name: '', badge: '', summary: '', emphasis: 'default', position: 0, is_active: true });
  const [editing, setEditing] = useState<number | null>(null);

  async function save() {
    try {
      const result = editing
        ? await adminApi.updatePpfTier(editing, draft)
        : await adminApi.createPpfTier(draft);
      onNotice(result.message);
      setDraft({ name: '', badge: '', summary: '', emphasis: 'default', position: 0, is_active: true });
      setEditing(null);
      await onChange();
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : t('admin.ppfSaveFailed'));
    }
  }

  return (
    <CrudPanel
      onCreate={() => { setEditing(null); setDraft({ name: '', badge: '', summary: '', emphasis: 'default', position: 0, is_active: true }); }}
      editor={
        <div className="grid gap-3 md:grid-cols-2">
          <AdminField label={t('admin.ppfName')}><input className={inputClass} value={draft.name ?? ''} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfBadge')}><input className={inputClass} value={draft.badge ?? ''} onChange={(event) => setDraft((current) => ({ ...current, badge: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfSummary')}><input className={inputClass} value={draft.summary ?? ''} onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfEmphasis')}>
            <AdminSelect value={draft.emphasis ?? 'default'} onChange={(value) => setDraft((current) => ({ ...current, emphasis: value as PpfTier['emphasis'] }))}>
              <option value="default">default</option><option value="featured">featured</option><option value="dark">dark</option><option value="custom">custom</option>
            </AdminSelect>
          </AdminField>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.is_active ?? true} onChange={(event) => setDraft((current) => ({ ...current, is_active: event.target.checked }))} />{t('admin.ppfActive')}</label>
          <button type="button" className={primaryButton} onClick={() => void save()}>{editing ? t('common.saveChanges') : t('common.add')}</button>
        </div>
      }
    >
      {tiers.map((tier) => (
        <Row key={tier.id} title={tier.name} meta={`${tier.badge} · ${tier.emphasis}`} active={tier.is_active} onEdit={() => { setEditing(tier.id); setDraft(tier); }} onDelete={() => void remove(() => adminApi.deletePpfTier(tier.id), onChange, onNotice, onError, t)} />
      ))}
    </CrudPanel>
  );
}

function MarketEditor({ markets, parents, onChange, onNotice, onError }: { markets: PpfMarket[]; parents: PpfMarket[]; onChange: () => Promise<void>; onNotice: (value: string) => void; onError: (value: string) => void }) {
  const { t } = useTranslation();
  const blank: PpfMarketPayload = { label: '', subtitle: '', description: '', slug: '', parent_id: null, has_cards: false, columns: [], example_note: '', upgrade_note: '', compliance_note: '', footnote: '', is_active: true };
  const [draft, setDraft] = useState<PpfMarketPayload>(blank);
  const [columns, setColumns] = useState('');
  const [editing, setEditing] = useState<number | null>(null);

  async function save() {
    try {
      const payload = { ...draft, columns: parsePairs(columns).map(([key, label]) => ({ key, label })) };
      const result = editing ? await adminApi.updatePpfMarket(editing, payload) : await adminApi.createPpfMarket(payload);
      onNotice(result.message);
      setDraft(blank);
      setColumns('');
      setEditing(null);
      await onChange();
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : t('admin.ppfSaveFailed'));
    }
  }

  return (
    <CrudPanel
      onCreate={() => { setEditing(null); setDraft(blank); setColumns(''); }}
      editor={
        <div className="grid gap-3 md:grid-cols-2">
          <AdminField label={t('admin.ppfLabel')}><input className={inputClass} value={draft.label ?? ''} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfSlug')}><input className={inputClass} value={draft.slug ?? ''} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfSubtitle')}><input className={inputClass} value={draft.subtitle ?? ''} onChange={(event) => setDraft((current) => ({ ...current, subtitle: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfParent')}>
            <AdminSelect value={draft.parent_id ?? ''} onChange={(value) => setDraft((current) => ({ ...current, parent_id: value === '' ? null : Number(value) }))}>
              <option value="">{t('admin.ppfNoParent')}</option>
              {parents.map((parent) => <option key={parent.id} value={parent.id}>{parent.label}</option>)}
            </AdminSelect>
          </AdminField>
          <AdminField label={t('admin.ppfDescription')}><textarea className={inputClass} rows={3} value={draft.description ?? ''} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfColumnsHint')}><textarea className={inputClass} rows={3} value={columns} onChange={(event) => setColumns(event.target.value)} /></AdminField>
          <AdminField label={t('admin.ppfExampleNote')}><textarea className={inputClass} rows={2} value={draft.example_note ?? ''} onChange={(event) => setDraft((current) => ({ ...current, example_note: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfUpgradeNote')}><textarea className={inputClass} rows={2} value={draft.upgrade_note ?? ''} onChange={(event) => setDraft((current) => ({ ...current, upgrade_note: event.target.value }))} /></AdminField>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.has_cards ?? false} onChange={(event) => setDraft((current) => ({ ...current, has_cards: event.target.checked }))} />{t('admin.ppfHasCards')}</label>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.is_active ?? true} onChange={(event) => setDraft((current) => ({ ...current, is_active: event.target.checked }))} />{t('admin.ppfActive')}</label>
          <button type="button" className={primaryButton} onClick={() => void save()}>{editing ? t('common.saveChanges') : t('common.add')}</button>
        </div>
      }
    >
      {markets.map((market) => (
        <Row
          key={market.id}
          title={market.label}
          meta={`${market.slug}${market.parent ? ` · ${market.parent.label}` : ''}`}
          active={market.is_active}
          onEdit={() => { setEditing(market.id); setDraft(market); setColumns((market.columns ?? []).map((column) => `${column.key}|${column.label}`).join('\n')); }}
          onDelete={() => void remove(() => adminApi.deletePpfMarket(market.id), onChange, onNotice, onError, t)}
        />
      ))}
    </CrudPanel>
  );
}

function PlanEditor({ plans, markets, tiers, onChange, onNotice, onError }: { plans: PpfPlan[]; markets: PpfMarket[]; tiers: PpfTier[]; onChange: () => Promise<void>; onNotice: (value: string) => void; onError: (value: string) => void }) {
  const { t } = useTranslation();
  const blank: PpfPlanPayload = { name: '', ppf_market_id: markets[0]?.id, ppf_tier_id: null, qualification: '', rate_label: '', rate_suffix: 'PPF', is_featured: false, style: 'default', cells: {}, features: [], is_active: true };
  const [draft, setDraft] = useState<PpfPlanPayload>(blank);
  const [cells, setCells] = useState('');
  const [features, setFeatures] = useState('');
  const [editing, setEditing] = useState<number | null>(null);

  async function save() {
    try {
      const payload: PpfPlanPayload = {
        ...draft,
        cells: Object.fromEntries(parsePairs(cells)),
        features: features.split('\n').map((item) => item.trim()).filter(Boolean),
        ppf_tier_id: draft.ppf_tier_id || null,
        subscription_amount: numberOrNull(draft.subscription_amount),
        percent_rate: numberOrNull(draft.percent_rate),
        percent_rate_max: numberOrNull(draft.percent_rate_max),
        fixed_amount: numberOrNull(draft.fixed_amount),
        min_fee: numberOrNull(draft.min_fee),
        cap_fee: numberOrNull(draft.cap_fee),
        listing_amount: numberOrNull(draft.listing_amount),
        lead_amount: numberOrNull(draft.lead_amount),
        volume_min: numberOrNull(draft.volume_min),
        volume_max: numberOrNull(draft.volume_max),
      };
      const result = editing ? await adminApi.updatePpfPlan(editing, payload) : await adminApi.createPpfPlan(payload);
      onNotice(result.message);
      setDraft(blank);
      setCells('');
      setFeatures('');
      setEditing(null);
      await onChange();
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : t('admin.ppfSaveFailed'));
    }
  }

  return (
    <CrudPanel
      onCreate={() => { setEditing(null); setDraft(blank); setCells(''); setFeatures(''); }}
      editor={
        <div className="grid gap-3 md:grid-cols-2">
          <AdminField label={t('admin.ppfName')}><input className={inputClass} value={draft.name ?? ''} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfMarket')}>
            <AdminSelect value={draft.ppf_market_id ?? ''} onChange={(value) => setDraft((current) => ({ ...current, ppf_market_id: Number(value) }))}>
              {markets.map((market) => <option key={market.id} value={market.id}>{market.label}</option>)}
            </AdminSelect>
          </AdminField>
          <AdminField label={t('admin.ppfTier')}>
            <AdminSelect value={draft.ppf_tier_id ?? ''} onChange={(value) => setDraft((current) => ({ ...current, ppf_tier_id: value === '' ? null : Number(value) }))}>
              <option value="">{t('admin.ppfNoTier')}</option>
              {tiers.map((tier) => <option key={tier.id} value={tier.id}>{tier.name}</option>)}
            </AdminSelect>
          </AdminField>
          <AdminField label={t('admin.ppfQualification')}><input className={inputClass} value={draft.qualification ?? ''} onChange={(event) => setDraft((current) => ({ ...current, qualification: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfRateLabel')}><input className={inputClass} value={draft.rate_label ?? ''} onChange={(event) => setDraft((current) => ({ ...current, rate_label: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfPercentRate')}><input className={inputClass} value={draft.percent_rate ?? ''} onChange={(event) => setDraft((current) => ({ ...current, percent_rate: event.target.value === '' ? null : Number(event.target.value) }))} /></AdminField>
          <AdminField label={t('admin.ppfSubscriptionAmount')}><input className={inputClass} value={draft.subscription_amount ?? ''} onChange={(event) => setDraft((current) => ({ ...current, subscription_amount: event.target.value === '' ? null : Number(event.target.value) }))} /></AdminField>
          <AdminField label={t('admin.ppfCellsHint')}><textarea className={inputClass} rows={4} value={cells} onChange={(event) => setCells(event.target.value)} /></AdminField>
          <AdminField label={t('admin.ppfFeaturesHint')}><textarea className={inputClass} rows={4} value={features} onChange={(event) => setFeatures(event.target.value)} /></AdminField>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.is_featured ?? false} onChange={(event) => setDraft((current) => ({ ...current, is_featured: event.target.checked }))} />{t('admin.ppfFeatured')}</label>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.is_active ?? true} onChange={(event) => setDraft((current) => ({ ...current, is_active: event.target.checked }))} />{t('admin.ppfActive')}</label>
          <button type="button" className={primaryButton} onClick={() => void save()}>{editing ? t('common.saveChanges') : t('common.add')}</button>
        </div>
      }
    >
      {plans.map((plan) => (
        <Row
          key={plan.id}
          title={plan.name}
          meta={`${plan.market?.label ?? ''} · ${plan.rate_label ?? ''}`}
          active={plan.is_active}
          onEdit={() => { setEditing(plan.id); setDraft(plan); setCells(Object.entries(plan.cells ?? {}).map(([key, value]) => `${key}|${value}`).join('\n')); setFeatures((plan.features ?? []).join('\n')); }}
          onDelete={() => void remove(() => adminApi.deletePpfPlan(plan.id), onChange, onNotice, onError, t)}
        />
      ))}
    </CrudPanel>
  );
}

function FaqEditor({ faqs, onChange, onNotice, onError }: { faqs: PpfFaq[]; onChange: () => Promise<void>; onNotice: (value: string) => void; onError: (value: string) => void }) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<PpfFaqPayload>({ question: '', answer: '', is_active: true });
  const [editing, setEditing] = useState<number | null>(null);

  async function save() {
    try {
      const result = editing ? await adminApi.updatePpfFaq(editing, draft) : await adminApi.createPpfFaq(draft);
      onNotice(result.message);
      setDraft({ question: '', answer: '', is_active: true });
      setEditing(null);
      await onChange();
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : t('admin.ppfSaveFailed'));
    }
  }

  return (
    <CrudPanel
      onCreate={() => { setEditing(null); setDraft({ question: '', answer: '', is_active: true }); }}
      editor={
        <div className="grid gap-3">
          <AdminField label={t('admin.ppfQuestion')}><input className={inputClass} value={draft.question ?? ''} onChange={(event) => setDraft((current) => ({ ...current, question: event.target.value }))} /></AdminField>
          <AdminField label={t('admin.ppfAnswer')}><textarea className={inputClass} rows={4} value={draft.answer ?? ''} onChange={(event) => setDraft((current) => ({ ...current, answer: event.target.value }))} /></AdminField>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.is_active ?? true} onChange={(event) => setDraft((current) => ({ ...current, is_active: event.target.checked }))} />{t('admin.ppfActive')}</label>
          <button type="button" className={primaryButton} onClick={() => void save()}>{editing ? t('common.saveChanges') : t('common.add')}</button>
        </div>
      }
    >
      {faqs.map((faq) => (
        <Row key={faq.id} title={faq.question} meta="" active={faq.is_active} onEdit={() => { setEditing(faq.id); setDraft(faq); }} onDelete={() => void remove(() => adminApi.deletePpfFaq(faq.id), onChange, onNotice, onError, t)} />
      ))}
    </CrudPanel>
  );
}

function CrudPanel({ children, editor, onCreate }: { children: ReactNode; editor: ReactNode; onCreate: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-2">{children}</div>
      <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <button type="button" onClick={onCreate} className="inline-flex items-center gap-2 text-sm font-bold text-amber-800"><Plus className="h-4 w-4" />{t('common.add')}</button>
        {editor}
      </aside>
    </div>
  );
}

function Row({ title, meta, active, onEdit, onDelete }: { title: string; meta: string; active: boolean; onEdit: () => void; onDelete: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="font-bold text-slate-950">{title}</p>
        <p className="text-xs text-slate-500">{meta}{active ? '' : ` · ${t('admin.ppfInactive')}`}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onEdit} className="rounded-lg px-3 py-1.5 text-sm font-bold hover:bg-amber-50">{t('common.edit')}</button>
        <button type="button" onClick={onDelete} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={t('common.delete')}><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

async function remove(action: () => Promise<{ message: string }>, onChange: () => Promise<void>, onNotice: (value: string) => void, onError: (value: string) => void, t: (key: 'admin.ppfSaveFailed') => string) {
  try {
    const result = await action();
    onNotice(result.message);
    await onChange();
  } catch (caught) {
    onError(caught instanceof Error ? caught.message : t('admin.ppfSaveFailed'));
  }
}

function parsePairs(value: string, parts = 2): string[][] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const bits = line.split('|');
      return Array.from({ length: parts }, (_, index) => bits[index]?.trim() ?? '');
    })
    .filter((bits) => bits[0] && bits[1]);
}

function numberOrNull(value: unknown): number | null {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

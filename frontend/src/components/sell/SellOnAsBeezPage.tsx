import { useEffect, useState } from 'react';

import { rememberReturnHash, useAuth } from '../../auth/AuthProvider';
import { useTranslation } from '../../i18n';
import { ApiError } from '../../lib/api';
import { emptyHome, homeApi, type HomeCategory } from '../../lib/home';
import { marketBySlug } from '../../lib/markets';
import { partnerApi, type PartnerApplication } from '../../lib/partner';
import { Header } from '../home/Header';
import { Footer } from '../home/partials';
import {
  SellActivity,
  SellBreadcrumb,
  SellChanges,
  SellChecklist,
  SellDecision,
  SellMobileBar,
  SellNotice,
  SellPageHeader,
  SellProgress,
  SellStepForm,
  SellSupport,
  SellWelcome,
} from './partials';
import {
  SELL_TOTAL_STEPS,
  checklistSteps,
  emptySellForm,
  formFromApplication,
  formatSellTime,
  payloadFromForm,
  type SellFormState,
} from './sellForm';

function sectionFromHash(): string {
  return window.location.hash.replace(/^#sell-on-asbeez\/?/, '');
}

function stepFromSection(section: string): number | null {
  const match = /^step-(\d+)$/.exec(section);

  if (!match) {
    return null;
  }

  const step = Number(match[1]);

  return step >= 1 && step <= SELL_TOTAL_STEPS ? step : null;
}

export function SellOnAsBeezPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [section, setSection] = useState(sectionFromHash);
  const [currentStep, setCurrentStep] = useState(() => stepFromSection(sectionFromHash()) ?? 1);
  const [form, setForm] = useState<SellFormState>(emptySellForm);
  const [application, setApplication] = useState<PartnerApplication | null>(null);
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onHashChange = () => setSection(sectionFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const hashed = stepFromSection(section);

    if (hashed) {
      setCurrentStep(hashed);
      document.getElementById('step-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (section) {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [section]);

  useEffect(() => {
    let cancelled = false;

    homeApi.show()
      .then((payload) => {
        if (!cancelled) {
          setCategories(payload.categories);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories(emptyHome.categories);
        }
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    partnerApi.show()
      .then(({ application: row }) => {
        if (cancelled) {
          return;
        }

        applyApplication(row);

        if (!stepFromSection(sectionFromHash())) {
          setCurrentStep(row.current_step || 1);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setNotice(error instanceof ApiError ? error.message : t('common.requestFailed'));
        }
      });

    return () => { cancelled = true; };
  }, [user, t]);

  function applyApplication(row: PartnerApplication) {
    setApplication(row);
    setForm(formFromApplication(row));
  }

  function patchForm(patch: Partial<SellFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function goToStep(id: number) {
    if (id < 1 || id > SELL_TOTAL_STEPS) {
      return;
    }

    window.location.hash = `#sell-on-asbeez/step-${id}`;
  }

  function requireAuth(): boolean {
    if (user) {
      return true;
    }

    // Reached only if the session expires while the form is open; the route
    // itself is gated, so there is no anonymous path into this page.
    rememberReturnHash(window.location.hash || '#sell-on-asbeez');
    window.location.hash = '#signin';
    return false;
  }

  async function persist(nextStep = currentStep): Promise<PartnerApplication | null> {
    if (!requireAuth()) {
      return null;
    }

    setSaving(true);

    try {
      const { application: saved } = await partnerApi.save(payloadFromForm(form, nextStep));
      applyApplication(saved);
      setNotice(t('sell.savedRemote'));
      return saved;
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : t('common.requestFailed'));
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function saveDraft() {
    await persist(currentStep);
  }

  async function saveAndExit() {
    const saved = await persist(currentStep);

    if (saved) {
      window.location.hash = '#marketplace';
    }
  }

  async function saveAndContinue() {
    if (currentStep === SELL_TOTAL_STEPS) {
      const saved = await persist(currentStep);

      if (!saved || !saved.can_submit) {
        setNotice(t('sell.reviewBlocked'));
        return;
      }

      setSaving(true);

      try {
        const { application: submitted } = await partnerApi.submit();
        applyApplication(submitted);
        setNotice(t('sell.submittedRemote'));
      } catch (error) {
        setNotice(error instanceof ApiError ? error.message : t('common.requestFailed'));
      } finally {
        setSaving(false);
      }

      return;
    }

    const saved = await persist(currentStep + 1);

    if (saved) {
      goToStep(currentStep + 1);
    }
  }

  async function upload(kind: string, files: FileList | null) {
    if (!files?.length || !requireAuth()) {
      return;
    }

    setSaving(true);

    try {
      let latest = application;

      for (const file of Array.from(files)) {
        latest = (await partnerApi.upload(kind, file)).application;
      }

      if (latest) {
        applyApplication(latest);
        setNotice(t('sell.savedRemote'));
      }
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : t('common.requestFailed'));
    } finally {
      setSaving(false);
    }
  }

  const savedAt = application?.updated_at ? new Date(application.updated_at) : null;
  const savedLabel = savedAt ? t('sell.lastSaved', { time: formatSellTime(locale, savedAt) }) : t('sell.notSavedYet');
  const market = marketBySlug(form.partnershipType);
  const typeLabel = market ? t(market.name) : t('sell.typeUnset');
  const completed = application?.completeness.completed ?? 0;
  const remaining = application?.completeness.remaining ?? SELL_TOTAL_STEPS;
  const percent = application?.completeness.percent ?? 0;

  return (
    <div className="min-h-screen bg-cream text-charcoal antialiased">
      <Header categories={categories} />
      <main className="bg-amber-50/50 pb-28 lg:pb-12">
        <div className="amazon-container py-6">
          <SellBreadcrumb />
          <SellPageHeader reference={application?.reference ?? null} status={application?.status ?? null} onSaveExit={saveAndExit} />
          <SellNotice />
          {notice ? <p className="mb-6 text-sm font-medium text-slate-600" role="status">{notice}</p> : null}
          <SellWelcome
            name={form.businessName || user?.name || t('sell.welcomeGuest')}
            currentStep={currentStep}
            typeLabel={typeLabel}
            completed={completed}
            remaining={remaining}
          />
          <SellProgress
            percent={percent}
            completed={completed}
            savedLabel={savedLabel}
            savedNote={t('sell.savedSafe')}
          />
          <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <SellChecklist steps={checklistSteps(currentStep, application?.completeness.steps)} onSelect={goToStep} />
            <div className="min-w-0 scroll-mt-44 space-y-6 lg:scroll-mt-28" id="step-content">
              <SellStepForm
                currentStep={currentStep}
                form={form}
                application={application}
                disabled={Boolean(application && !application.can_edit) || saving}
                busy={saving}
                onChange={patchForm}
                onUpload={upload}
                onPrevious={() => goToStep(currentStep - 1)}
                onSaveDraft={saveDraft}
                onSaveExit={saveAndExit}
                onContinue={saveAndContinue}
                draftLabel={saving ? t('common.saving') : savedLabel}
              />
              {application ? <SellChanges application={application} onGoToStep={() => goToStep(application.changes_step ?? 10)} onReply={saveDraft} /> : null}
              <div className="grid gap-6 xl:grid-cols-2">
                <SellActivity application={application} />
                <SellSupport onAction={() => setNotice(t('sell.supportNotLive'))} />
              </div>
              <SellDecision application={application} onAction={() => setNotice(t('sell.supportNotLive'))} />
            </div>
          </div>
        </div>
      </main>
      <SellMobileBar currentStep={currentStep} onSaveDraft={saveDraft} onContinue={saveAndContinue} />
      <Footer />
    </div>
  );
}

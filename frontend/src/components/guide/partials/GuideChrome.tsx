import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { useTranslation, type MessageKey } from '../../../i18n';

const toc: { href: string; key: MessageKey }[] = [
  { href: '#how-it-works/terms', key: 'guide.tocTerms' },
  { href: '#how-it-works/why', key: 'guide.tocWhy' },
  { href: '#how-it-works/what', key: 'guide.tocWhat' },
  { href: '#how-it-works/journey', key: 'guide.tocJourney' },
  { href: '#how-it-works/members', key: 'guide.tocMembers' },
  { href: '#how-it-works/vendors', key: 'guide.tocVendors' },
  { href: '#how-it-works/cells', key: 'guide.tocCells' },
  { href: '#how-it-works/rewards', key: 'guide.tocRewards' },
  { href: '#how-it-works/example', key: 'guide.tocExample' },
  { href: '#how-it-works/matrix', key: 'guide.tocMatrix' },
  { href: '#how-it-works/referrals', key: 'guide.tocReferrals' },
  { href: '#how-it-works/potential', key: 'guide.tocPotential' },
  { href: '#how-it-works/hive', key: 'guide.tocHive' },
  { href: '#how-it-works/expectations', key: 'guide.tocHonest' },
];

export function GuideHero() {
  const { t } = useTranslation();

  return (
    <header className="relative overflow-hidden bg-charcoal text-white">
      <div className="bg-honeycomb pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="amazon-container relative py-14 sm:py-20">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-honey">{t('guide.eyebrow')}</p>
        <h1 className="mb-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{t('guide.title')}</h1>
        <p className="mb-4 max-w-2xl text-base text-gray-200 sm:text-lg">{t('guide.heroLead')}</p>
        <p className="max-w-2xl text-sm text-gray-300">{t('guide.heroCopy')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#signup" className="rounded-lg bg-honey px-6 py-3 font-bold text-charcoal hover:bg-amber">{t('guide.joinFree')}</a>
          <a href="#marketplace" className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20">{t('guide.browseMarketplace')}</a>
        </div>
      </div>
    </header>
  );
}

export function GuideToc() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      aria-label={t('guide.tocLabel')}
      className="sticky top-28 z-30 self-start lg:top-24"
    >
      <div className="rounded-xl bg-white p-4 shadow-md lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-amber">{t('guide.tocLabel')}</p>
          <button
            type="button"
            className="rounded-md p-1 text-charcoal hover:bg-cream lg:hidden"
            aria-expanded={open}
            aria-controls="guide-toc-list"
            aria-label={open ? t('guide.tocHide') : t('guide.tocShow')}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        <ol
          id="guide-toc-list"
          className={`${open ? 'mt-3 block max-h-[min(24rem,calc(100vh-10rem))] overflow-y-auto' : 'hidden'} space-y-2 text-sm lg:mt-3 lg:block lg:max-h-none lg:overflow-visible`}
        >
          {toc.map((item, index) => (
            <li key={item.href}>
              <a href={item.href} className="flex gap-2 hover:text-amber" onClick={() => setOpen(false)}>
                <span className="w-5 shrink-0 font-bold text-honey">{index + 1}.</span>
                <span>{t(item.key)}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export function GuideCta() {
  const { t } = useTranslation();

  return (
    <section className="honeycomb-bg border-y border-honey/20">
      <div className="amazon-container py-12 text-center sm:py-16">
        <h2 className="mb-3 text-2xl font-extrabold">{t('guide.ctaTitle')}</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm text-mutedgray">{t('guide.ctaCopy')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#signup" className="rounded-lg bg-honey px-8 py-3.5 font-bold text-charcoal hover:bg-amber">{t('guide.joinFree')}</a>
          <a href="#marketplace" className="rounded-lg border-2 border-charcoal px-8 py-3.5 font-bold text-charcoal hover:bg-softyellow">{t('guide.browseMarketplace')}</a>
        </div>
      </div>
    </section>
  );
}

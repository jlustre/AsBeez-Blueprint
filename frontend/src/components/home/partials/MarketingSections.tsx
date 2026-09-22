import { useState, type FormEvent } from 'react';
import { CheckCircle2, HeartHandshake, LockKeyhole, Mail, Search, ShieldCheck } from 'lucide-react';

import { useTranslation, type MessageKey } from '../../../i18n';

export function SellerBanner() {
  const { t } = useTranslation();

  return (
    <section aria-label={t('home.sellOnAsBeez')} className="honeycomb-bg border-y border-honey/20">
      <div className="amazon-container py-12 sm:py-16">
        <div className="rounded-2xl bg-charcoal p-8 text-center sm:p-12">
          <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">{t('home.sellerTitle')}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-300 sm:text-lg">{t('home.sellerCopy')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#sell-on-asbeez" className="rounded-lg bg-honey px-8 py-3.5 font-bold text-charcoal shadow-lg hover:bg-amber">{t('home.createListing')}</a>
            <a href="#how-it-works" className="rounded-lg border border-white/20 bg-white/10 px-8 py-3.5 font-bold text-white hover:bg-white/20">{t('home.learnHow')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    [Search, 'home.step1', 'home.step1Copy'],
    [HeartHandshake, 'home.step2', 'home.step2Copy'],
    [CheckCircle2, 'home.step3', 'home.step3Copy'],
  ] as const;

  return (
    <section aria-label={t('home.howItWorksLabel')} className="border-y border-gray-100 bg-white">
      <div className="amazon-container py-12 sm:py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-xl font-extrabold sm:text-2xl">{t('home.howItWorks')}</h2>
          <p className="mx-auto max-w-lg text-sm text-mutedgray">{t('home.howItWorksCopy')}</p>
          <a href="#how-it-works" className="mt-4 inline-block text-sm font-semibold text-amber hover:text-charcoal">{t('home.readGuide')} →</a>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(([Icon, title, copy], index) => (
            <div key={title} className="relative text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-honey shadow-lg">
                <Icon className="h-9 w-9 text-charcoal" />
              </div>
              <span className="mb-3 inline-block rounded-full bg-honey px-3 py-1 text-xs font-bold text-charcoal">{t('home.step', { number: index + 1 })}</span>
              <h3 className="mb-2 text-lg font-bold">{t(title)}</h3>
              <p className="mx-auto max-w-xs text-sm text-mutedgray">{t(copy)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustGrid() {
  const { t } = useTranslation();
  const trust = [
    [ShieldCheck, 'home.trust1', 'home.trust1Copy'],
    [LockKeyhole, 'home.trust2', 'home.trust2Copy'],
    [HeartHandshake, 'home.trust3', 'home.trust3Copy'],
    [Mail, 'home.trust4', 'home.trust4Copy'],
  ] as const;

  return (
    <section aria-label={t('home.trustLabel')} className="amazon-container py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map(([Icon, title, copy]) => (
          <article key={title} className="rounded-xl border-t-4 border-honey bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-softyellow">
              <Icon className="h-6 w-6 text-charcoal" />
            </div>
            <h3 className="mb-2 font-bold">{t(title)}</h3>
            <p className="text-sm text-mutedgray">{t(copy)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(t('home.commerceNotReady'));
    setEmail('');
  }

  return (
    <section aria-label={t('home.newsletterLabel')} className="honeycomb-bg border-y border-honey/20">
      <div className="amazon-container py-12 text-center sm:py-16">
        <Mail className="mx-auto mb-4 h-12 w-12 text-amber" />
        <h2 className="mb-3 text-2xl font-extrabold">{t('home.newsletterTitle')}</h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-mutedgray">{t('home.newsletterCopy')}</p>
        <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">{t('home.emailAddress')}</label>
          <input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('home.emailPlaceholder')} className="min-w-0 flex-1 rounded-lg border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-honey" />
          <button className="rounded-lg bg-honey px-6 py-3 font-bold text-charcoal hover:bg-amber">{t('home.joinTheHive')}</button>
        </form>
        {message ? <p className="mt-3 text-sm font-medium text-mutedgray" role="status">{message}</p> : null}
        <p className="mt-3 text-xs text-mutedgray">{t('home.privacyNote')}</p>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-8 bg-charcoal py-12 text-white">
      <div className="amazon-container">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <FooterGroup title="home.footerGetToKnow" items={['home.linkHowItWorks', 'home.linkAboutUs', 'home.linkCareers', 'home.linkPress', 'home.linkCommunityImpact']} />
          <FooterGroup title="home.footerShop" items={['nav.products', 'home.linkLocalServices', 'member.professionals', 'home.linkJobs', 'home.linkRealEstate']} />
          <FooterGroup title="home.footerSell" items={['home.sellOnAsBeez', 'home.linkPlatformFees', 'home.linkBusinessTools', 'home.linkAdvertising', 'home.linkSellerResources']} />
          <FooterGroup title="home.footerSupport" items={['member.helpCenter', 'home.linkContactUs', 'nav.returns', 'home.linkReportIssue']} />
          <FooterGroup title="home.footerLegal" items={['vendor.privacyPolicy', 'member.termsOfService', 'member.accessibility', 'home.linkTrustSafety']} />
        </div>
        <div className="mt-10 border-t border-white/10 pt-8 text-center">
          <div className="text-xl font-extrabold"><span className="text-honey">As</span>Beez</div>
          <p className="mt-3 text-sm text-gray-400">{t('home.tagline')}</p>
          <p className="mt-6 text-xs text-gray-500">{t('home.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}

function footerHref(item: MessageKey): string {
  if (item === 'home.linkHowItWorks') {
    return '#how-it-works';
  }

  if (item === 'home.sellOnAsBeez') {
    return '#sell-on-asbeez';
  }

  if (item === 'home.linkPlatformFees') {
    return '#platform-fees';
  }

  return '#marketplace';
}

function FooterGroup({ title, items }: { title: MessageKey; items: MessageKey[] }) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-honey">{t(title)}</h3>
      <ul className="space-y-2 text-sm text-gray-300">
        {items.map((item) => (
          <li key={item}><a href={footerHref(item)} className="hover:text-honey">{t(item)}</a></li>
        ))}
      </ul>
    </div>
  );
}

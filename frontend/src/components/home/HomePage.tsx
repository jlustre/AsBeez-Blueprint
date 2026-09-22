import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useTranslation } from '../../i18n';
import { emptyHome, homeApi, type HomePayload } from '../../lib/home';
import { Header } from './Header';
import {
  CategoryGrid,
  DealsRail,
  FeaturePanels,
  FeaturedStores,
  Footer,
  HeroCarousel,
  HowItWorks,
  Newsletter,
  Recommendations,
  SellerBanner,
  ServicesGrid,
  TrustGrid,
} from './partials';

export function HomePage() {
  const { t, locale } = useTranslation();
  const [home, setHome] = useState<HomePayload>(emptyHome);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');

      try {
        const payload = await homeApi.show();

        if (!cancelled) {
          setHome(payload);
        }
      } catch (caught) {
        if (!cancelled) {
          setHome(emptyHome);
          setError(caught instanceof Error ? caught.message : t('home.loadFailed'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [locale]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream text-charcoal antialiased">
      <Header categories={home.categories} />
      <main>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-mutedgray">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">{t('common.loading')}</span>
          </div>
        ) : null}
        {!loading && error ? (
          <p className="amazon-container py-8 text-center text-sm text-red-700" role="alert">{error || t('home.loadFailed')}</p>
        ) : null}
        {!loading && !error ? (
          <>
            <HeroCarousel slides={home.slides} />
            <CategoryGrid categories={home.categories} />
            <FeaturePanels images={home.panels} />
            <DealsRail deals={home.deals} locale={locale} />
            <ServicesGrid services={home.services} locale={locale} />
            <FeaturedStores stores={home.stores} />
            <SellerBanner />
            <HowItWorks />
            <TrustGrid />
            <Recommendations products={home.products} locale={locale} />
            <Newsletter />
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

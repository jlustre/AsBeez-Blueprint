import { useTranslation } from '../../../i18n';
import { storeHref, type HomeListing, type HomeStore } from '../../../lib/home';
import { EmptyRail } from './EmptyRail';
import { ProductCard } from './ProductCard';
import { SectionHeader } from './SectionHeader';
import { ServiceCard } from './ServiceCard';

export function DealsRail({ deals, locale }: { deals: HomeListing[]; locale: string }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('home.todaysDeals')} className="amazon-container pb-10 sm:pb-14">
      <SectionHeader title={t('home.todaysDeals')} copy={t('home.todaysDealsCopy')} />
      {deals.length === 0 ? <EmptyRail>{t('home.noDeals')}</EmptyRail> : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {deals.map((listing) => <ProductCard key={listing.id} listing={listing} locale={locale} />)}
        </div>
      )}
    </section>
  );
}

export function ServicesGrid({ services, locale }: { services: HomeListing[]; locale: string }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('home.popularServices')} className="amazon-container pb-10 sm:pb-14">
      <SectionHeader title={t('home.popularServices')} copy={t('home.popularServicesCopy')} />
      {services.length === 0 ? <EmptyRail>{t('home.noServices')}</EmptyRail> : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((listing) => <ServiceCard key={listing.id} listing={listing} locale={locale} />)}
        </div>
      )}
    </section>
  );
}

export function Recommendations({ products, locale }: { products: HomeListing[]; locale: string }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('home.recommendedProducts')} className="amazon-container py-10 sm:py-14">
      <SectionHeader title={t('home.recommended')} copy={t('home.recommendedCopy')} />
      {products.length === 0 ? <EmptyRail>{t('home.noProducts')}</EmptyRail> : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((listing) => (
            <div key={listing.id} className="min-w-0 [&_article]:w-full">
              <ProductCard listing={listing} locale={locale} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function FeaturedStores({ stores }: { stores: HomeStore[] }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('home.featuredStores')} className="amazon-container pb-10 sm:pb-14">
      <SectionHeader title={t('home.featuredStores')} copy={t('home.featuredStoresCopy')} />
      {stores.length === 0 ? <EmptyRail>{t('home.noStores')}</EmptyRail> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <a key={store.id} href={storeHref(store.slug)} className="group overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl">
              {store.banner_url
                ? <img src={store.banner_url} alt="" className="h-36 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                : <div className="h-36 bg-softyellow" />}
              <div className="flex items-center gap-3 p-4">
                {store.logo_url
                  ? <img src={store.logo_url} alt="" className="h-12 w-12 rounded-lg object-cover" loading="lazy" />
                  : <div className="h-12 w-12 rounded-lg bg-softyellow" />}
                <div className="min-w-0">
                  <h3 className="truncate font-bold">{store.name}</h3>
                  {store.tagline ? <p className="truncate text-sm text-mutedgray">{store.tagline}</p> : null}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

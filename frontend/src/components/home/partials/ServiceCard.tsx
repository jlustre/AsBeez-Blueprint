import { BadgeCheck } from 'lucide-react';

import { useTranslation } from '../../../i18n';
import { formatMoney, storeHref, type HomeListing } from '../../../lib/home';

export function ServiceCard({ listing, locale }: { listing: HomeListing; locale: string }) {
  const { t } = useTranslation();
  const href = listing.store ? storeHref(listing.store.slug) : '#marketplace';

  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl">
      {listing.image_url
        ? <img src={listing.image_url} alt={listing.name} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        : <div className="h-48 bg-softyellow" />}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold">{listing.name}</h3>
          {listing.store?.verified ? (
            <span className="flex items-center gap-1 rounded-full bg-successgreen/10 px-2 py-1 text-xs font-semibold text-successgreen">
              <BadgeCheck className="h-3.5 w-3.5" /> {t('verify.verified')}
            </span>
          ) : null}
        </div>
        {listing.store ? <p className="mb-2 text-sm text-mutedgray">{t('home.byVendor', { name: listing.store.name })}</p> : null}
        <div className="mb-3">
          <span className="text-lg font-bold">{formatMoney(listing.price, listing.currency, locale)}</span>
        </div>
        <a href={href} className="block w-full rounded-lg bg-charcoal py-2.5 text-center text-sm font-bold text-white hover:bg-honey hover:text-charcoal">{t('home.viewService')}</a>
      </div>
    </article>
  );
}

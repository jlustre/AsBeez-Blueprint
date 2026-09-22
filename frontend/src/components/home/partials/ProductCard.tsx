import { Heart } from 'lucide-react';

import { useTranslation } from '../../../i18n';
import { formatMoney, storeHref, type HomeListing } from '../../../lib/home';

export function ProductCard({ listing, locale }: { listing: HomeListing; locale: string }) {
  const { t } = useTranslation();
  const href = listing.store ? storeHref(listing.store.slug) : '#marketplace';

  return (
    <article className="group relative w-52 shrink-0 overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl sm:w-56">
      {listing.discount_percent ? <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">{t('home.percentOff', { percent: listing.discount_percent })}</span> : null}
      <button type="button" disabled title={t('admin.notYetAvailable')} aria-label={t('home.addToWishlist')} className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 disabled:opacity-60">
        <Heart className="h-4 w-4 text-gray-400" />
      </button>
      {listing.image_url
        ? <img src={listing.image_url} alt={listing.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        : <div className="h-44 bg-softyellow" />}
      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold">{listing.name}</h3>
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatMoney(listing.price, listing.currency, locale)}</span>
          {listing.compare_at_price ? <span className="text-sm text-mutedgray line-through">{formatMoney(listing.compare_at_price, listing.currency, locale)}</span> : null}
        </div>
        {listing.store ? <p className="mb-2 text-xs text-mutedgray">{listing.store.name}</p> : null}
        <a href={href} className="block w-full rounded-lg bg-honey py-2 text-center text-sm font-bold text-charcoal hover:bg-amber">{t('home.viewListing')}</a>
      </div>
    </article>
  );
}

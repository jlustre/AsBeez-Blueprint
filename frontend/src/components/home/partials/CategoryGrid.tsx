import { Building2, Car, Download, Handshake, Package, Plane, ShieldCheck, ShoppingBag } from 'lucide-react';

import { useTranslation } from '../../../i18n';
import type { HomeCategory } from '../../../lib/home';
import { EmptyRail } from './EmptyRail';

/**
 * Icon per market.
 *
 * Keyed by slug and not by position: the seven roots come from the database,
 * so a reordered or renamed market keeps its icon, and an unmapped slug falls
 * back to the generic bag rather than rendering nothing.
 */
const iconBySlug: Record<string, typeof ShoppingBag> = {
  'physical-products': Package,
  'digital-products': Download,
  'professional-services': Handshake,
  'real-estate': Building2,
  automotive: Car,
  insurance: ShieldCheck,
  travel: Plane,
};

export function CategoryGrid({ categories }: { categories: HomeCategory[] }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('home.categoryShortcuts')} className="amazon-container relative z-20 -mt-12">
      {categories.length === 0 ? <EmptyRail>{t('home.noCategories')}</EmptyRail> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map((category) => {
            const Icon = iconBySlug[category.slug] ?? ShoppingBag;
            return (
              <a href="#marketplace" key={category.id} className="group rounded-xl border-2 border-transparent bg-white p-4 text-center shadow-md transition hover:-translate-y-1 hover:border-honey hover:shadow-xl">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-softyellow transition group-hover:bg-honey">
                  <Icon className="h-6 w-6 text-charcoal" />
                </div>
                <span className="block text-xs font-semibold leading-tight">{category.name}</span>
                <span className="mt-0.5 block text-[10px] text-mutedgray">{t('home.listingsCount', { count: category.listing_count })}</span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

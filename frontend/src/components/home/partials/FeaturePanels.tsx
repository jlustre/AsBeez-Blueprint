import { useTranslation, type MessageKey } from '../../../i18n';
import type { HomePayload } from '../../../lib/home';

const panels: { key: keyof HomePayload['panels']; title: MessageKey; copy: MessageKey; href: string }[] = [
  { key: 'deals', title: 'home.panelDeals', copy: 'home.panelDealsCopy', href: '#marketplace' },
  { key: 'services', title: 'home.panelServices', copy: 'home.panelServicesCopy', href: '#marketplace' },
  { key: 'stores', title: 'home.panelBusinesses', copy: 'home.panelBusinessesCopy', href: '#marketplace' },
  { key: 'selling', title: 'home.panelSelling', copy: 'home.panelSellingCopy', href: '#sell-on-asbeez' },
];

export function FeaturePanels({ images }: { images: HomePayload['panels'] }) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('home.highlights')} className="amazon-container py-10 sm:py-14">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {panels.map((panel) => {
          const thumbs = images[panel.key];
          return (
            <article key={panel.key} className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl">
              <div className="p-4 pb-2">
                <h3 className="text-lg font-bold">{t(panel.title)}</h3>
                <p className="text-xs text-mutedgray">{t(panel.copy)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 px-4">
                {(thumbs.length > 0 ? thumbs.slice(0, 4) : [null, null, null, null]).map((source, index) => (
                  source
                    ? <img key={`${panel.key}-${index}`} src={source} alt="" className="h-24 w-full rounded-lg object-cover" loading="lazy" />
                    : <div key={`${panel.key}-${index}`} className="h-24 rounded-lg bg-softyellow" />
                ))}
              </div>
              <a href={panel.href} className="block px-4 py-3 text-sm font-semibold text-amber hover:text-charcoal">{t('home.seeMore')} →</a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

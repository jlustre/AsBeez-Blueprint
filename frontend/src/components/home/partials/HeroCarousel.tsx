import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useTranslation, type MessageKey } from '../../../i18n';
import type { HomeSlide } from '../../../lib/home';

export function HeroCarousel({ slides }: { slides: HomeSlide[] }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section aria-label={t('hero.featuredPromotions')} className="relative flex h-[240px] items-center justify-center bg-charcoal sm:h-[320px]">
        <p className="text-sm text-gray-300">{t('home.noSlides')}</p>
      </section>
    );
  }

  const slide = slides[Math.min(active, slides.length - 1)];
  const titleKey = `${slide.copy_key}Title` as MessageKey;

  return (
    <section aria-label={t('hero.featuredPromotions')} className="relative h-[320px] overflow-hidden sm:h-[400px] lg:h-[480px]">
      {slide.image_url ? <img src={slide.image_url} alt={t(titleKey)} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-charcoal" />}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-transparent" />
      <div className="relative z-10 flex h-full items-center">
        <div className="amazon-container">
          <div className="max-w-lg px-3 sm:px-4 lg:px-3">
            <span className="mb-4 inline-block rounded-full bg-honey px-3 py-1 text-xs font-bold uppercase tracking-wider text-charcoal">{t(`${slide.copy_key}Eyebrow` as MessageKey)}</span>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">{t(titleKey)}</h1>
            <p className="mb-6 text-base text-gray-200 sm:text-lg">{t(`${slide.copy_key}Copy` as MessageKey)}</p>
            <a href={slide.href || '#marketplace'} className="inline-block rounded-lg bg-honey px-6 py-3 font-bold text-charcoal shadow-lg transition hover:bg-amber">{t(`${slide.copy_key}Action` as MessageKey)}</a>
          </div>
        </div>
      </div>
      {slides.length > 1 ? (
        <>
          <button aria-label={t('hero.previousSlide')} onClick={() => setActive((active - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2.5 text-white backdrop-blur-sm hover:bg-white/40"><ChevronLeft /></button>
          <button aria-label={t('hero.nextSlide')} onClick={() => setActive((active + 1) % slides.length)} className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2.5 text-white backdrop-blur-sm hover:bg-white/40"><ChevronRight /></button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((item, index) => (
              <button key={item.id} aria-label={t('hero.goToSlide', { number: index + 1 })} onClick={() => setActive(index)} className={`h-3 w-3 rounded-full ${index === active ? 'bg-honey' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

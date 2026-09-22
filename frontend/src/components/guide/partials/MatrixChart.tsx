import { useTranslation } from '../../../i18n';
import { HexBadge } from './GuideVisuals';
import {
  AHC_TO_MATRIX_PER_ANCESTOR,
  LEVELS_WITHOUT_REFERRALS,
  MATRIX_DEPTH,
  MATRIX_POOL_RP,
  MATRIX_SHARE,
  PLATFORM_REVENUE_RP,
  PLATFORM_SHARE,
  USA_RP_FOR_CELL,
  formatCount,
  matrixLevels,
  matrixTotal,
} from '../../../lib/matrix';

export function MatrixTreeChart() {
  const { t } = useTranslation();

  return (
    <figure className="overflow-x-auto rounded-xl bg-white shadow-md">
      <div className="bg-honeycomb mx-auto flex min-w-[22rem] max-w-xl flex-col items-center gap-4 p-6">
        <HexBadge tone="you">{t('guide.chartYou')}</HexBadge>
        <div className="h-6 w-px bg-honey" />
        <div className="grid w-full grid-cols-3 justify-items-center">
          <HexBadge tone="charcoal">1</HexBadge>
          <HexBadge tone="charcoal">2</HexBadge>
          <HexBadge tone="charcoal">3</HexBadge>
        </div>
        <p className="text-xs font-semibold text-amber">{t('guide.chartLevel1')}</p>
        <div className="grid w-full grid-cols-3 justify-items-center">
          {[0, 1, 2].map((branch) => (
            <div key={branch} className="flex flex-col items-center gap-2">
              <div className="h-5 w-px bg-honey/70" />
              <div className="flex gap-1">
                <HexBadge tone="honey" size="sm">·</HexBadge>
                <HexBadge tone="honey" size="sm">·</HexBadge>
                <HexBadge tone="honey" size="sm">·</HexBadge>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs font-semibold text-amber">{t('guide.chartLevel2')}</p>
      </div>
      <figcaption className="border-t border-gray-100 px-5 py-3 text-center text-sm text-mutedgray">{t('guide.chartCaption')}</figcaption>
    </figure>
  );
}

export function MatrixCapacityTable({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const rows = matrixLevels();
  const widest = rows[rows.length - 1].seats;

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-md">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <caption className="sr-only">{t('guide.capacityCaption')}</caption>
        <thead className="bg-softyellow text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 font-bold">{t('guide.capacityLevel')}</th>
            <th className="px-4 py-3 font-bold">{t('guide.capacitySeats')}</th>
            <th className="hidden px-4 py-3 font-bold sm:table-cell">{t('guide.capacityBar')}</th>
            <th className="px-4 py-3 font-bold">{t('guide.capacityAhc')}</th>
            <th className="px-4 py-3 font-bold">{t('guide.capacityRunning')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.level} className={`border-t border-gray-100 ${row.level === LEVELS_WITHOUT_REFERRALS ? 'bg-softyellow/40' : ''}`}>
              <td className="px-4 py-3 font-semibold">{t('guide.capacityFloor', { number: row.level })}</td>
              <td className="px-4 py-3">{formatCount(row.seats, locale)}</td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <div className="h-2.5 rounded-full bg-gray-100">
                  <div className="h-2.5 rounded-full bg-honey" style={{ width: `${Math.max(4, (Math.log10(row.seats) / Math.log10(widest)) * 100)}%` }} />
                </div>
              </td>
              <td className="px-4 py-3">{t('guide.ahcAmount', { count: formatCount(row.ahc, locale) })}</td>
              <td className="px-4 py-3 font-semibold">{t('guide.ahcAmount', { count: formatCount(row.runningAhc, locale) })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MatrixPotentialCards({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const nine = matrixTotal(LEVELS_WITHOUT_REFERRALS);
  const twelve = matrixTotal(MATRIX_DEPTH);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article className="rounded-xl bg-white p-5 shadow-md">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber">{t('guide.potentialNineLabel')}</p>
        <p className="text-3xl font-extrabold">{t('guide.ahcAmount', { count: formatCount(nine.runningAhc, locale) })}</p>
        <p className="mt-2 text-sm text-mutedgray">{t('guide.potentialNineCopy', { seats: formatCount(nine.runningSeats, locale), ahc: formatCount(nine.runningAhc, locale) })}</p>
      </article>
      <article className="rounded-xl bg-charcoal p-5 text-white shadow-md">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-honey">{t('guide.potentialTwelveLabel')}</p>
        <p className="text-3xl font-extrabold">{t('guide.ahcAmount', { count: formatCount(twelve.runningAhc, locale) })}</p>
        <p className="mt-2 text-sm text-gray-300">{t('guide.potentialTwelveCopy', { seats: formatCount(twelve.runningSeats, locale), ahc: formatCount(twelve.runningAhc, locale) })}</p>
      </article>
    </div>
  );
}

export function ThresholdSplitTable({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const matrixPercent = Math.round(MATRIX_SHARE * 100);
  const platformPercent = Math.round(PLATFORM_SHARE * 100);

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-md">
      <table className="w-full min-w-[24rem] text-left text-sm">
        <caption className="sr-only">{t('guide.splitCaption')}</caption>
        <thead className="bg-softyellow text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 font-bold">{t('guide.splitColWhere')}</th>
            <th className="px-4 py-3 font-bold">{t('guide.splitColShare')}</th>
            <th className="px-4 py-3 font-bold">{t('guide.splitColAmount')}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-100">
            <td className="px-4 py-3">{t('guide.splitThreshold')}</td>
            <td className="px-4 py-3">{t('guide.splitWhole')}</td>
            <td className="px-4 py-3 font-semibold">{t('guide.splitPoints', { count: formatCount(USA_RP_FOR_CELL, locale) })}</td>
          </tr>
          <tr className="border-t border-gray-100">
            <td className="px-4 py-3">{t('guide.splitMatrix')}</td>
            <td className="px-4 py-3">{t('guide.splitPercent', { percent: matrixPercent })}</td>
            <td className="px-4 py-3 font-semibold">{t('guide.splitPoints', { count: formatCount(MATRIX_POOL_RP, locale) })}</td>
          </tr>
          <tr className="border-t border-gray-100">
            <td className="px-4 py-3">{t('guide.splitPlatform')}</td>
            <td className="px-4 py-3">{t('guide.splitPercent', { percent: platformPercent })}</td>
            <td className="px-4 py-3 font-semibold">{t('guide.splitPoints', { count: formatCount(PLATFORM_REVENUE_RP, locale) })}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function MatrixMathNote({ locale }: { locale: string }) {
  const { t } = useTranslation();

  return (
    <p className="text-sm text-mutedgray">
      {t('guide.potentialMath', {
        ahc: formatCount(AHC_TO_MATRIX_PER_ANCESTOR, locale),
      })}
    </p>
  );
}

import { useTranslation, type MessageKey } from '../../../i18n';
import { formatMoney } from '../../../lib/home';
import {
  AHC_TO_MATRIX_PER_ANCESTOR,
  EXAMPLE_COMMISSION_TOTAL,
  EXAMPLE_NAME,
  EXAMPLE_POINTS_TOTAL,
  EXAMPLE_PRICE_TOTAL,
  MATRIX_POOL_RP,
  MATRIX_SHARE,
  exampleCommission,
  examplePoints,
  examplePurchases,
  formatCount,
  matrixLevels,
} from '../../../lib/matrix';

export function ExampleStory({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const firstFloors = matrixLevels(3);
  const threeFloorTotal = firstFloors[firstFloors.length - 1];
  const matrixPercent = Math.round(MATRIX_SHARE * 100);
  const receipts: { title: MessageKey; copy: MessageKey }[] = [
    { title: 'guide.exampleStep1Title', copy: 'guide.exampleStep1Copy' },
    { title: 'guide.exampleStep2Title', copy: 'guide.exampleStep2Copy' },
    { title: 'guide.exampleStep3Title', copy: 'guide.exampleStep3Copy' },
    { title: 'guide.exampleStep4Title', copy: 'guide.exampleStep4Copy' },
    { title: 'guide.exampleStep5Title', copy: 'guide.exampleStep5Copy' },
  ];
  const vars = {
    name: EXAMPLE_NAME,
    points: formatCount(EXAMPLE_POINTS_TOTAL, locale),
    spend: formatMoney(EXAMPLE_PRICE_TOTAL, 'USD', locale),
    ppe: formatMoney(EXAMPLE_COMMISSION_TOTAL, 'USD', locale),
    matrix: String(matrixPercent),
    matrixPool: formatCount(MATRIX_POOL_RP, locale),
    soFar: t('guide.ahcAmount', { count: formatCount(threeFloorTotal.runningAhc, locale) }),
    ahc: formatCount(AHC_TO_MATRIX_PER_ANCESTOR, locale),
  };

  return (
    <div className="space-y-5">
      <ol className="space-y-4">
        {receipts.map((step, index) => (
          <li key={step.title} className="rounded-xl bg-white p-5 shadow-md">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber">{t('guide.exampleBeat', { number: index + 1, name: EXAMPLE_NAME })}</p>
            <h3 className="mb-2 text-lg font-bold">{t(step.title, { name: EXAMPLE_NAME })}</h3>
            <p className="text-sm leading-relaxed text-charcoal/80">{t(step.copy, vars)}</p>
            {index === 1 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <caption className="sr-only">{t('guide.exampleBuyCaption')}</caption>
                  <thead className="text-xs uppercase tracking-wider text-mutedgray">
                    <tr>
                      <th className="py-2 pr-3 font-bold">{t('guide.exampleBuyItem')}</th>
                      <th className="py-2 pr-3 font-bold">{t('guide.exampleBuyPrice')}</th>
                      <th className="py-2 pr-3 font-bold">{t('guide.exampleBuyContract')}</th>
                      <th className="py-2 pr-3 font-bold">{t('guide.exampleBuyCommission')}</th>
                      <th className="py-2 font-bold">{t('guide.exampleBuyPoints')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examplePurchases.map((item) => (
                      <tr key={item.key} className="border-t border-gray-100">
                        <td className="py-2 pr-3">{t(item.key)}</td>
                        <td className="py-2 pr-3">{formatMoney(item.price, 'USD', locale)}</td>
                        <td className="py-2 pr-3">
                          {item.kind === 'percent'
                            ? t('guide.exampleContractPercent', { percent: item.rate })
                            : t('guide.exampleContractFixed', { amount: formatMoney(item.rate, 'USD', locale) })}
                        </td>
                        <td className="py-2 pr-3">{formatMoney(exampleCommission(item), 'USD', locale)}</td>
                        <td className="py-2 font-semibold">{formatCount(examplePoints(item), locale)}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 font-bold">
                      <td className="py-2 pr-3">{t('guide.exampleBuyTotal')}</td>
                      <td className="py-2 pr-3">{formatMoney(EXAMPLE_PRICE_TOTAL, 'USD', locale)}</td>
                      <td className="py-2 pr-3">—</td>
                      <td className="py-2 pr-3">{formatMoney(EXAMPLE_COMMISSION_TOTAL, 'USD', locale)}</td>
                      <td className="py-2">{formatCount(EXAMPLE_POINTS_TOTAL, locale)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="overflow-x-auto rounded-xl bg-white shadow-md">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <caption className="sr-only">{t('guide.exampleFloorsCaption')}</caption>
          <thead className="bg-softyellow text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-bold">{t('guide.exampleFloor')}</th>
              <th className="px-4 py-3 font-bold">{t('guide.exampleNewCells')}</th>
              <th className="px-4 py-3 font-bold">{t('guide.exampleCredits')}</th>
              <th className="px-4 py-3 font-bold">{t('guide.exampleSoFar')}</th>
            </tr>
          </thead>
          <tbody>
            {firstFloors.map((row) => (
              <tr key={row.level} className="border-t border-gray-100">
                <td className="px-4 py-3">{t('guide.capacityFloor', { number: row.level })}</td>
                <td className="px-4 py-3">{formatCount(row.seats, locale)}</td>
                <td className="px-4 py-3">{t('guide.ahcAmount', { count: formatCount(row.ahc, locale) })}</td>
                <td className="px-4 py-3 font-semibold">{t('guide.ahcAmount', { count: formatCount(row.runningAhc, locale) })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-mutedgray">
        {t('guide.exampleFloorMath', vars)}
      </p>
    </div>
  );
}

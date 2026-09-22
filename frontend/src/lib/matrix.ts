/** Default Beehive Matrix numbers from the rewards / matrix design docs. */

export const MATRIX_WIDTH = 3;
export const MATRIX_DEPTH = 12;
export const AHC_PER_NEW_CELL = 10;
/** Teaching conversion: one Hive Credit equals one US dollar. */
export const AHC_PER_USD = 1;
export const USA_RP_FOR_CELL = 120;
export const LEVELS_WITHOUT_REFERRALS = 9;
export const REFERRALS_FOR_FULL_DEPTH = 9;

/** Of each Cell threshold, this share can be distributed through the matrix. */
export const MATRIX_SHARE = 0.6;
/** The rest of the threshold stays with AsBeez as platform revenue. */
export const PLATFORM_SHARE = 0.4;

export const MATRIX_POOL_RP = USA_RP_FOR_CELL * MATRIX_SHARE;
export const PLATFORM_REVENUE_RP = USA_RP_FOR_CELL * PLATFORM_SHARE;
export const AHC_TO_MATRIX_PER_ANCESTOR = AHC_PER_NEW_CELL * MATRIX_SHARE;

export type MatrixLevel = {
  level: number;
  seats: number;
  ahc: number;
  usd: number;
  runningSeats: number;
  runningAhc: number;
  runningUsd: number;
};

function seatsAt(level: number): number {
  return MATRIX_WIDTH ** level;
}

export function matrixLevels(throughLevel = MATRIX_DEPTH): MatrixLevel[] {
  const rows: MatrixLevel[] = [];
  let runningSeats = 0;
  const ahcEach = AHC_TO_MATRIX_PER_ANCESTOR;
  const usdEach = ahcEach / AHC_PER_USD;

  for (let level = 1; level <= throughLevel; level += 1) {
    const seats = seatsAt(level);
    runningSeats += seats;
    const ahc = seats * ahcEach;
    const usd = seats * usdEach;
    rows.push({
      level,
      seats,
      ahc,
      usd,
      runningSeats,
      runningAhc: runningSeats * ahcEach,
      runningUsd: runningSeats * usdEach,
    });
  }

  return rows;
}

export function matrixTotal(throughLevel: number): MatrixLevel {
  const rows = matrixLevels(throughLevel);
  return rows[rows.length - 1];
}

export function formatCount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(value);
}

export type ExamplePurchase = {
  key: 'guide.exampleBuy1' | 'guide.exampleBuy2' | 'guide.exampleBuy3';
  price: number;
  kind: 'percent' | 'fixed';
  rate: number;
};

export const examplePurchases: ExamplePurchase[] = [
  { key: 'guide.exampleBuy1', price: 200, kind: 'percent', rate: 15 },
  { key: 'guide.exampleBuy2', price: 40, kind: 'fixed', rate: 20 },
  { key: 'guide.exampleBuy3', price: 350, kind: 'percent', rate: 20 },
];

export function exampleCommission(item: ExamplePurchase): number {
  return item.kind === 'percent' ? (item.price * item.rate) / 100 : item.rate;
}

/** Teaching only: one RP per $1 of Platform Participation Fee (PPE), never per $1 of price. */
export function examplePoints(item: ExamplePurchase): number {
  return exampleCommission(item);
}

export const EXAMPLE_NAME = 'Sam Ortega';
export const EXAMPLE_PRICE_TOTAL = examplePurchases.reduce((sum, item) => sum + item.price, 0);
export const EXAMPLE_COMMISSION_TOTAL = examplePurchases.reduce((sum, item) => sum + exampleCommission(item), 0);
export const EXAMPLE_POINTS_TOTAL = examplePurchases.reduce((sum, item) => sum + examplePoints(item), 0);

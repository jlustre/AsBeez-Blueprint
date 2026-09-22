import type { MessageKey } from '../i18n';

/**
 * The seven markets AsBeez is segmented into.
 *
 * The slugs are the root categories the seeder writes, so this list is the
 * one place the frontend names them. Two labels per market because the two
 * places that show them want different lengths: the top bar has room for a
 * word ("Shop"), while a partnership picker or a store's market wants the
 * full name ("Physical Products"). The slug is what ties either back to the
 * taxonomy.
 *
 * Order matches the homepage grid, which reads the roots by `position`.
 */
export type Market = {
    /** Root category slug. */
    slug: string;
    /** Short label, for the top bar. */
    short: MessageKey;
    /** Full name, for anywhere with room. */
    name: MessageKey;
    /** One line on what belongs in this market. */
    hint: MessageKey;
};

export const MARKETS: Market[] = [
    {
        slug: 'physical-products',
        short: 'nav.shop',
        name: 'market.physicalProducts',
        hint: 'market.physicalProductsHint',
    },
    {
        slug: 'digital-products',
        short: 'nav.digital',
        name: 'market.digitalProducts',
        hint: 'market.digitalProductsHint',
    },
    {
        slug: 'professional-services',
        short: 'nav.services',
        name: 'market.professionalServices',
        hint: 'market.professionalServicesHint',
    },
    {
        slug: 'real-estate',
        short: 'nav.realEstate',
        name: 'market.realEstate',
        hint: 'market.realEstateHint',
    },
    {
        slug: 'automotive',
        short: 'nav.automotive',
        name: 'market.automotive',
        hint: 'market.automotiveHint',
    },
    {
        slug: 'insurance',
        short: 'nav.insurance',
        name: 'market.insurance',
        hint: 'market.insuranceHint',
    },
    {
        slug: 'travel',
        short: 'nav.travel',
        name: 'market.travel',
        hint: 'market.travelHint',
    },
];

/** The market a slug names, or null when it names none. */
export function marketBySlug(slug: string): Market | null {
    return MARKETS.find((market) => market.slug === slug) ?? null;
}

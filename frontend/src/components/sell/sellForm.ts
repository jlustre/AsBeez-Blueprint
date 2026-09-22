import type { MessageKey } from '../../i18n';
import type { CompletenessStep, PartnerApplication, PartnerPayload } from '../../lib/partner';

export const SELL_TOTAL_STEPS = 12;

export type Offering = 'products' | 'services' | 'both';
export type StepStatus = 'completed' | 'current' | 'attention' | 'todo' | 'locked';

export type ApplicantStep = {
  id: number;
  title: MessageKey;
  detail: MessageKey;
  status: StepStatus;
  detailVars?: Record<string, string | number>;
};

export type SellFormState = {
  partnershipType: string;
  businessName: string;
  displayName: string;
  tagline: string;
  about: string;
  website: string;
  profileCountry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  legalName: string;
  entityType: string;
  registrationNumber: string;
  yearEstablished: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  businessCountry: string;
  offering: Offering | '';
  categories: string[];
  primaryProduct: string;
  productCount: string;
  condition: string;
  avgProductPrice: string;
  lowPrice: string;
  highPrice: string;
  inventory: string;
  relationship: string;
  origin: string;
  regulated: boolean;
  primaryService: string;
  delivery: string;
  serviceArea: string;
  duration: string;
  avgServicePrice: string;
  teamSize: string;
  licenses: string;
  insurance: string;
  storeName: string;
  storeSlug: string;
  brandStory: string;
  publicEmail: string;
  publicPhone: string;
  fulfillmentMethod: string;
  shipsFrom: string;
  handlingDays: string;
  serviceRadiusKm: string;
  operatesRemotely: boolean;
  payoutMethod: string;
  payoutAccountHolder: string;
  payoutCountry: string;
  payoutCurrency: string;
  taxRegistered: boolean | null;
  taxId: string;
  taxCountry: string;
  identityDocumentType: string;
  identityFullName: string;
  acceptedTerms: boolean;
  acceptedPpa: boolean;
  acceptedSellerStandards: boolean;
  applicantReply: string;
};

export const categoryKeys = [
  'home',
  'electronics',
  'beauty',
  'pro',
  'homeServices',
  'auto',
  'food',
  'education',
] as const;

export const categoryLabel: Record<(typeof categoryKeys)[number], MessageKey> = {
  home: 'sell.catHome',
  electronics: 'sell.catElectronics',
  beauty: 'sell.catBeauty',
  pro: 'sell.catPro',
  homeServices: 'sell.catHomeServices',
  auto: 'sell.catAuto',
  food: 'sell.catFood',
  education: 'sell.catEducation',
};

export const emptySellForm: SellFormState = {
  partnershipType: '',
  businessName: '',
  displayName: '',
  tagline: '',
  about: '',
  website: '',
  profileCountry: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactRole: '',
  legalName: '',
  entityType: '',
  registrationNumber: '',
  yearEstablished: '',
  addressLine: '',
  city: '',
  state: '',
  postalCode: '',
  businessCountry: '',
  offering: '',
  categories: [],
  primaryProduct: '',
  productCount: '',
  condition: '',
  avgProductPrice: '',
  lowPrice: '',
  highPrice: '',
  inventory: '',
  relationship: '',
  origin: '',
  regulated: false,
  primaryService: '',
  delivery: '',
  serviceArea: '',
  duration: '',
  avgServicePrice: '',
  teamSize: '',
  licenses: '',
  insurance: '',
  storeName: '',
  storeSlug: '',
  brandStory: '',
  publicEmail: '',
  publicPhone: '',
  fulfillmentMethod: '',
  shipsFrom: '',
  handlingDays: '',
  serviceRadiusKm: '',
  operatesRemotely: false,
  payoutMethod: '',
  payoutAccountHolder: '',
  payoutCountry: '',
  payoutCurrency: 'USD',
  taxRegistered: null,
  taxId: '',
  taxCountry: '',
  identityDocumentType: '',
  identityFullName: '',
  acceptedTerms: false,
  acceptedPpa: false,
  acceptedSellerStandards: false,
  applicantReply: '',
};

export const applicantSteps: ApplicantStep[] = [
  { id: 1, title: 'sell.step1', detail: 'sell.statusTodo', status: 'todo' },
  { id: 2, title: 'sell.step2', detail: 'sell.statusTodo', status: 'todo' },
  { id: 3, title: 'sell.step3', detail: 'sell.statusTodo', status: 'todo' },
  { id: 4, title: 'sell.step4', detail: 'sell.statusTodo', status: 'todo' },
  { id: 5, title: 'sell.step5', detail: 'sell.statusTodo', status: 'todo' },
  { id: 6, title: 'sell.step6', detail: 'sell.statusTodo', status: 'todo' },
  { id: 7, title: 'sell.step7', detail: 'sell.statusTodo', status: 'todo' },
  { id: 8, title: 'sell.step8', detail: 'sell.statusTodo', status: 'todo' },
  { id: 9, title: 'sell.step9', detail: 'sell.statusTodo', status: 'todo' },
  { id: 10, title: 'sell.step10', detail: 'sell.statusTodo', status: 'todo' },
  { id: 11, title: 'sell.step11', detail: 'sell.statusTodo', status: 'todo' },
  { id: 12, title: 'sell.step12', detail: 'sell.statusTodo', status: 'todo' },
];

export const reviewSteps: ApplicantStep[] = [
  { id: 13, title: 'sell.stepReview', detail: 'sell.statusLockedSubmit', status: 'locked' },
  { id: 14, title: 'sell.stepActivate', detail: 'sell.statusLockedApprove', status: 'locked' },
];

export const stepLead: Record<number, MessageKey> = {
  1: 'sell.step1Lead',
  2: 'sell.step2Lead',
  3: 'sell.step3Lead',
  4: 'sell.step4Lead',
  5: 'sell.step5Lead',
  6: 'sell.step6Lead',
  7: 'sell.step7Lead',
  8: 'sell.step8Lead',
  9: 'sell.step9Lead',
  10: 'sell.step10Lead',
  11: 'sell.step11Lead',
  12: 'sell.step12Lead',
};

export const eventLabel: Record<string, MessageKey> = {
  started: 'sell.actStarted',
  draft_saved: 'sell.eventDraftSaved',
  submitted: 'sell.eventSubmitted',
  file_uploaded: 'sell.eventFileUploaded',
  file_removed: 'sell.eventFileRemoved',
};

export const statusLabel: Record<string, MessageKey> = {
  draft: 'sell.statusDraft',
  submitted: 'sell.statusSubmitted',
  changes_requested: 'sell.statusChanges',
  under_review: 'sell.statusUnderReview',
  approved: 'sell.statusApproved',
  rejected: 'sell.statusRejected',
};

export function stepTitle(id: number): MessageKey {
  return applicantSteps.find((step) => step.id === id)?.title ?? 'sell.step1';
}

export function parsePrice(value: string): number {
  return Number.parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
}

export function formatSellTime(locale: string, date: Date): string {
  return date.toLocaleTimeString(locale === 'es' ? 'es' : 'en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatSellStamp(locale: string, date: Date): string {
  const tag = locale === 'es' ? 'es' : 'en-US';

  return `${date.toLocaleDateString(tag, { month: 'short', day: 'numeric' })}, ${formatSellTime(locale, date)}`;
}

export function blank(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return String(value);
}

export function numberOrNull(value: string): number | null {
  if (value === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

export function formFromApplication(application: PartnerApplication): SellFormState {
  return {
    ...emptySellForm,
    partnershipType: application.partnership_type ?? '',
    businessName: application.business_name ?? '',
    displayName: application.display_name ?? '',
    tagline: application.tagline ?? '',
    about: application.about ?? '',
    website: application.website ?? '',
    profileCountry: application.profile_country ?? '',
    contactName: application.contact_name ?? '',
    contactEmail: application.contact_email ?? '',
    contactPhone: application.contact_phone ?? '',
    contactRole: application.contact_role ?? '',
    legalName: application.legal_name ?? '',
    entityType: application.entity_type ?? '',
    registrationNumber: application.registration_number ?? '',
    yearEstablished: application.year_established ? String(application.year_established) : '',
    addressLine: application.address_line ?? '',
    city: application.city ?? '',
    state: application.state ?? '',
    postalCode: application.postal_code ?? '',
    businessCountry: application.business_country ?? '',
    offering: (application.offering as Offering | null) ?? '',
    categories: application.categories ?? [],
    primaryProduct: application.primary_product_category ?? '',
    productCount: application.product_count != null ? String(application.product_count) : '',
    condition: application.product_condition ?? '',
    avgProductPrice: application.avg_product_price ?? '',
    lowPrice: application.low_price ?? '',
    highPrice: application.high_price ?? '',
    inventory: application.inventory_ownership ?? '',
    relationship: application.seller_relationship ?? '',
    origin: application.product_origin ?? '',
    regulated: Boolean(application.regulated),
    primaryService: application.primary_service_category ?? '',
    delivery: application.delivery_method ?? '',
    serviceArea: application.service_area ?? '',
    duration: application.booking_duration ?? '',
    avgServicePrice: application.avg_service_price ?? '',
    teamSize: application.team_size != null ? String(application.team_size) : '',
    licenses: application.professional_licenses ?? '',
    insurance: application.insurance_coverage ?? '',
    storeName: application.store_name ?? '',
    storeSlug: application.store_slug ?? '',
    brandStory: application.brand_story ?? '',
    publicEmail: application.public_email ?? '',
    publicPhone: application.public_phone ?? '',
    fulfillmentMethod: application.fulfillment_method ?? '',
    shipsFrom: application.ships_from ?? '',
    handlingDays: application.handling_days != null ? String(application.handling_days) : '',
    serviceRadiusKm: application.service_radius_km != null ? String(application.service_radius_km) : '',
    operatesRemotely: Boolean(application.operates_remotely),
    payoutMethod: application.payout_method ?? '',
    payoutAccountHolder: application.payout_account_holder ?? '',
    payoutCountry: application.payout_country ?? '',
    payoutCurrency: application.payout_currency ?? 'USD',
    taxRegistered: application.tax_registered,
    taxId: application.tax_id ?? '',
    taxCountry: application.tax_country ?? '',
    identityDocumentType: application.identity_document_type ?? '',
    identityFullName: application.identity_full_name ?? '',
    acceptedTerms: application.accepted_terms,
    acceptedPpa: application.accepted_ppa,
    acceptedSellerStandards: application.accepted_seller_standards,
    applicantReply: application.applicant_reply ?? '',
  };
}

export function payloadFromForm(form: SellFormState, currentStep: number): PartnerPayload {
  return {
    current_step: currentStep,
    partnership_type: blank(form.partnershipType),
    business_name: blank(form.businessName),
    display_name: blank(form.displayName),
    tagline: blank(form.tagline),
    about: blank(form.about),
    website: blank(form.website),
    profile_country: blank(form.profileCountry)?.toUpperCase() ?? null,
    contact_name: blank(form.contactName),
    contact_email: blank(form.contactEmail),
    contact_phone: blank(form.contactPhone),
    contact_role: blank(form.contactRole),
    legal_name: blank(form.legalName),
    entity_type: blank(form.entityType),
    registration_number: blank(form.registrationNumber),
    year_established: numberOrNull(form.yearEstablished),
    address_line: blank(form.addressLine),
    city: blank(form.city),
    state: blank(form.state),
    postal_code: blank(form.postalCode),
    business_country: blank(form.businessCountry)?.toUpperCase() ?? null,
    offering: blank(form.offering),
    categories: form.categories,
    primary_product_category: blank(form.primaryProduct),
    product_count: numberOrNull(form.productCount),
    product_condition: blank(form.condition),
    avg_product_price: blank(form.avgProductPrice),
    low_price: blank(form.lowPrice),
    high_price: blank(form.highPrice),
    inventory_ownership: blank(form.inventory),
    seller_relationship: blank(form.relationship),
    product_origin: blank(form.origin),
    regulated: form.regulated,
    primary_service_category: blank(form.primaryService),
    delivery_method: blank(form.delivery),
    service_area: blank(form.serviceArea),
    booking_duration: blank(form.duration),
    avg_service_price: blank(form.avgServicePrice),
    team_size: numberOrNull(form.teamSize),
    professional_licenses: blank(form.licenses),
    insurance_coverage: blank(form.insurance),
    store_name: blank(form.storeName),
    store_slug: blank(form.storeSlug),
    brand_story: blank(form.brandStory),
    public_email: blank(form.publicEmail),
    public_phone: blank(form.publicPhone),
    fulfillment_method: blank(form.fulfillmentMethod),
    ships_from: blank(form.shipsFrom),
    handling_days: numberOrNull(form.handlingDays),
    service_radius_km: numberOrNull(form.serviceRadiusKm),
    operates_remotely: form.operatesRemotely,
    payout_method: blank(form.payoutMethod),
    payout_account_holder: blank(form.payoutAccountHolder),
    payout_country: blank(form.payoutCountry)?.toUpperCase() ?? null,
    payout_currency: blank(form.payoutCurrency)?.toUpperCase() ?? null,
    tax_registered: form.taxRegistered,
    tax_id: blank(form.taxId),
    tax_country: blank(form.taxCountry)?.toUpperCase() ?? null,
    identity_document_type: blank(form.identityDocumentType),
    identity_full_name: blank(form.identityFullName),
    accepted_terms: form.acceptedTerms,
    accepted_ppa: form.acceptedPpa,
    accepted_seller_standards: form.acceptedSellerStandards,
    applicant_reply: blank(form.applicantReply),
  };
}

export function checklistSteps(currentStep: number, rows: CompletenessStep[] = []): ApplicantStep[] {
  return applicantSteps.map((step) => {
    const row = rows.find((item) => item.id === step.id);
    let status: StepStatus = row?.status ?? 'todo';

    if (step.id === currentStep && !row?.done) {
      status = 'current';
    } else if (row?.done) {
      status = 'completed';
    }

    const detail: MessageKey = status === 'completed'
      ? 'sell.statusCompleted'
      : status === 'current'
        ? 'sell.statusInProgressStep'
        : status === 'attention'
          ? 'sell.statusAttention'
          : 'sell.statusTodo';

    return {
      ...step,
      status,
      detail,
      detailVars: status === 'attention' ? { count: 1 } : undefined,
    };
  });
}

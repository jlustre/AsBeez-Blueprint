import { apiRequest } from './api';

export type ApplicationStatus = 'draft' | 'submitted' | 'changes_requested' | 'under_review' | 'approved' | 'rejected';

export type CompletenessStep = {
  id: number;
  done: boolean;
  status: 'completed' | 'current' | 'attention' | 'todo';
};

export type PartnerApplication = {
  id: number;
  reference: string;
  status: ApplicationStatus;
  current_step: number;
  can_edit: boolean;
  can_submit: boolean;
  partnership_type: string | null;
  business_name: string | null;
  display_name: string | null;
  tagline: string | null;
  about: string | null;
  website: string | null;
  profile_country: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_role: string | null;
  legal_name: string | null;
  entity_type: string | null;
  registration_number: string | null;
  year_established: number | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  business_country: string | null;
  offering: string | null;
  categories: string[];
  primary_product_category: string | null;
  product_count: number | null;
  product_condition: string | null;
  avg_product_price: string | null;
  low_price: string | null;
  high_price: string | null;
  inventory_ownership: string | null;
  seller_relationship: string | null;
  product_origin: string | null;
  regulated: boolean | null;
  primary_service_category: string | null;
  delivery_method: string | null;
  service_area: string | null;
  booking_duration: string | null;
  avg_service_price: string | null;
  team_size: number | null;
  professional_licenses: string | null;
  insurance_coverage: string | null;
  store_name: string | null;
  store_slug: string | null;
  brand_story: string | null;
  public_email: string | null;
  public_phone: string | null;
  fulfillment_method: string | null;
  ships_from: string | null;
  handling_days: number | null;
  service_radius_km: number | null;
  operates_remotely: boolean | null;
  payout_method: string | null;
  payout_account_holder: string | null;
  payout_country: string | null;
  payout_currency: string | null;
  tax_registered: boolean | null;
  tax_id: string | null;
  tax_country: string | null;
  identity_document_type: string | null;
  identity_full_name: string | null;
  accepted_terms: boolean;
  accepted_ppa: boolean;
  accepted_seller_standards: boolean;
  changes_step: number | null;
  reviewer_note: string | null;
  applicant_reply: string | null;
  decision_reason: string | null;
  submitted_at: string | null;
  decision_at: string | null;
  reapply_after: string | null;
  updated_at: string | null;
  completeness: {
    percent: number;
    completed: number;
    total: number;
    remaining: number;
    steps: CompletenessStep[];
  };
  files: { id: number; kind: string; name: string; url: string | null }[];
  events: { id: number; action: string; actor: string; step: number | null; at: string | null }[];
};

export type PartnerPayload = Partial<{
  current_step: number;
  partnership_type: string | null;
  business_name: string | null;
  display_name: string | null;
  tagline: string | null;
  about: string | null;
  website: string | null;
  profile_country: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_role: string | null;
  legal_name: string | null;
  entity_type: string | null;
  registration_number: string | null;
  year_established: number | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  business_country: string | null;
  offering: string | null;
  categories: string[];
  primary_product_category: string | null;
  product_count: number | null;
  product_condition: string | null;
  avg_product_price: string | null;
  low_price: string | null;
  high_price: string | null;
  inventory_ownership: string | null;
  seller_relationship: string | null;
  product_origin: string | null;
  regulated: boolean;
  primary_service_category: string | null;
  delivery_method: string | null;
  service_area: string | null;
  booking_duration: string | null;
  avg_service_price: string | null;
  team_size: number | null;
  professional_licenses: string | null;
  insurance_coverage: string | null;
  store_name: string | null;
  store_slug: string | null;
  brand_story: string | null;
  public_email: string | null;
  public_phone: string | null;
  fulfillment_method: string | null;
  ships_from: string | null;
  handling_days: number | null;
  service_radius_km: number | null;
  operates_remotely: boolean;
  payout_method: string | null;
  payout_account_holder: string | null;
  payout_country: string | null;
  payout_currency: string | null;
  tax_registered: boolean | null;
  tax_id: string | null;
  tax_country: string | null;
  identity_document_type: string | null;
  identity_full_name: string | null;
  accepted_terms: boolean;
  accepted_ppa: boolean;
  accepted_seller_standards: boolean;
  applicant_reply: string | null;
}>;

export const partnerApi = {
  async show() {
    return apiRequest<{ application: PartnerApplication }>('/partner-application', {}, true);
  },

  async save(payload: PartnerPayload) {
    return apiRequest<{ application: PartnerApplication }>('/partner-application', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, true);
  },

  async submit() {
    return apiRequest<{ application: PartnerApplication }>('/partner-application/submit', {
      method: 'POST',
    }, true);
  },

  async upload(kind: string, file: File) {
    const body = new FormData();
    body.set('kind', kind);
    body.set('file', file);

    return apiRequest<{ application: PartnerApplication }>('/partner-application/files', {
      method: 'POST',
      body,
    }, true);
  },

  async removeFile(id: number) {
    return apiRequest<{ application: PartnerApplication }>(`/partner-application/files/${id}`, {
      method: 'DELETE',
    }, true);
  },
};

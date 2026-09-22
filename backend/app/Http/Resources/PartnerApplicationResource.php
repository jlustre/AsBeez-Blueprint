<?php

namespace App\Http\Resources;

use App\Models\PartnerApplication;
use App\Models\PartnerApplicationEvent;
use App\Models\PartnerApplicationFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PartnerApplication
 */
class PartnerApplicationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $completeness = $this->completeness()->toArray();

        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'status' => $this->status,
            'current_step' => $this->current_step,
            'can_edit' => $this->canEdit(),
            'can_submit' => $this->canEdit() && $this->completeness()->applicantStepsDone(),
            'partnership_type' => $this->partnership_type,
            'business_name' => $this->business_name,
            'display_name' => $this->display_name,
            'tagline' => $this->tagline,
            'about' => $this->about,
            'website' => $this->website,
            'profile_country' => $this->profile_country,
            'contact_name' => $this->contact_name,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'contact_role' => $this->contact_role,
            'legal_name' => $this->legal_name,
            'entity_type' => $this->entity_type,
            'registration_number' => $this->registration_number,
            'year_established' => $this->year_established,
            'address_line' => $this->address_line,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'business_country' => $this->business_country,
            'offering' => $this->offering,
            'categories' => $this->categories ?? [],
            'primary_product_category' => $this->primary_product_category,
            'product_count' => $this->product_count,
            'product_condition' => $this->product_condition,
            'avg_product_price' => $this->avg_product_price,
            'low_price' => $this->low_price,
            'high_price' => $this->high_price,
            'inventory_ownership' => $this->inventory_ownership,
            'seller_relationship' => $this->seller_relationship,
            'product_origin' => $this->product_origin,
            'regulated' => $this->regulated,
            'primary_service_category' => $this->primary_service_category,
            'delivery_method' => $this->delivery_method,
            'service_area' => $this->service_area,
            'booking_duration' => $this->booking_duration,
            'avg_service_price' => $this->avg_service_price,
            'team_size' => $this->team_size,
            'professional_licenses' => $this->professional_licenses,
            'insurance_coverage' => $this->insurance_coverage,
            'store_name' => $this->store_name,
            'store_slug' => $this->store_slug,
            'brand_story' => $this->brand_story,
            'public_email' => $this->public_email,
            'public_phone' => $this->public_phone,
            'fulfillment_method' => $this->fulfillment_method,
            'ships_from' => $this->ships_from,
            'handling_days' => $this->handling_days,
            'service_radius_km' => $this->service_radius_km,
            'operates_remotely' => $this->operates_remotely,
            'payout_method' => $this->payout_method,
            'payout_account_holder' => $this->payout_account_holder,
            'payout_country' => $this->payout_country,
            'payout_currency' => $this->payout_currency,
            'tax_registered' => $this->tax_registered,
            'tax_id' => $this->tax_id,
            'tax_country' => $this->tax_country,
            'identity_document_type' => $this->identity_document_type,
            'identity_full_name' => $this->identity_full_name,
            'accepted_terms' => $this->accepted_terms,
            'accepted_ppa' => $this->accepted_ppa,
            'accepted_seller_standards' => $this->accepted_seller_standards,
            'changes_step' => $this->changes_step,
            'reviewer_note' => $this->reviewer_note,
            'applicant_reply' => $this->applicant_reply,
            'decision_reason' => $this->decision_reason,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'decision_at' => $this->decision_at?->toIso8601String(),
            'reapply_after' => $this->reapply_after?->toDateString(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'completeness' => $completeness,
            'files' => $this->files->map(fn (PartnerApplicationFile $file) => [
                'id' => $file->id,
                'kind' => $file->kind,
                'name' => $file->original_name,
                'url' => $file->url(),
            ])->values(),
            'events' => $this->events->take(12)->map(fn (PartnerApplicationEvent $event) => [
                'id' => $event->id,
                'action' => $event->action,
                'actor' => $event->actor,
                'step' => $event->step,
                'at' => $event->created_at?->toIso8601String(),
            ])->values(),
        ];
    }
}

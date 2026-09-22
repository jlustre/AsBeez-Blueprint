<?php

namespace Database\Factories;

use App\Models\PartnerApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PartnerApplication>
 */
class PartnerApplicationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'reference' => PartnerApplication::nextReference(),
            'status' => PartnerApplication::STATUS_DRAFT,
            'current_step' => 1,
        ];
    }

    public function completeDraft(): static
    {
        return $this->state(fn (): array => [
            'current_step' => 11,
            'partnership_type' => 'physical-products',
            'business_name' => 'Cedar Trail Goods',
            'contact_name' => 'Sam Ortega',
            'contact_email' => 'sam@example.test',
            'legal_name' => 'Cedar Trail Goods LLC',
            'entity_type' => 'llc',
            'city' => 'Austin',
            'business_country' => 'US',
            'offering' => 'both',
            'categories' => ['home', 'homeServices'],
            'primary_product_category' => 'home',
            'primary_service_category' => 'homeServices',
            'store_name' => 'Cedar Trail',
            'fulfillment_method' => 'own_stock',
            'payout_method' => 'bank',
            'payout_account_holder' => 'Sam Ortega',
            'tax_registered' => false,
            'identity_document_type' => 'passport',
            'identity_full_name' => 'Sam Ortega',
            'accepted_terms' => true,
            'accepted_ppa' => true,
            'accepted_seller_standards' => true,
            'agreements_accepted_at' => now(),
        ]);
    }
}

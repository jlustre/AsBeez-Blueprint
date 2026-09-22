<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partner_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->unique();

            // draft | submitted | changes_requested | under_review | approved | rejected
            $table->string('status')->default('draft');
            $table->unsignedTinyInteger('current_step')->default(1);

            /* Step 1 — partnership type */
            $table->string('partnership_type')->nullable();

            /* Step 2 — business profile */
            $table->string('business_name')->nullable();
            $table->string('display_name')->nullable();
            $table->string('tagline', 160)->nullable();
            $table->text('about')->nullable();
            $table->string('website')->nullable();
            $table->string('profile_country', 2)->nullable();

            /* Step 3 — contact */
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_role')->nullable();

            /* Step 4 — legal business */
            $table->string('legal_name')->nullable();
            $table->string('entity_type')->nullable();
            $table->string('registration_number')->nullable();
            $table->unsignedSmallInteger('year_established')->nullable();
            $table->string('address_line')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('business_country', 2)->nullable();

            /* Step 5 — products or services */
            $table->string('offering')->nullable();
            $table->json('categories')->nullable();
            $table->string('primary_product_category')->nullable();
            $table->unsignedInteger('product_count')->nullable();
            $table->string('product_condition')->nullable();
            $table->decimal('avg_product_price', 10, 2)->nullable();
            $table->decimal('low_price', 10, 2)->nullable();
            $table->decimal('high_price', 10, 2)->nullable();
            $table->string('inventory_ownership')->nullable();
            $table->string('seller_relationship')->nullable();
            $table->string('product_origin')->nullable();
            $table->boolean('regulated')->nullable();
            $table->string('primary_service_category')->nullable();
            $table->string('delivery_method')->nullable();
            $table->string('service_area')->nullable();
            $table->string('booking_duration')->nullable();
            $table->decimal('avg_service_price', 10, 2)->nullable();
            $table->unsignedInteger('team_size')->nullable();
            $table->string('professional_licenses')->nullable();
            $table->string('insurance_coverage')->nullable();

            /* Step 6 — store and brand */
            $table->string('store_name')->nullable();
            $table->string('store_slug')->nullable();
            $table->text('brand_story')->nullable();
            $table->string('public_email')->nullable();
            $table->string('public_phone')->nullable();

            /* Step 7 — operations */
            $table->string('fulfillment_method')->nullable();
            $table->string('ships_from')->nullable();
            $table->unsignedSmallInteger('handling_days')->nullable();
            $table->unsignedInteger('service_radius_km')->nullable();
            $table->boolean('operates_remotely')->nullable();

            /* Step 8 — payouts (no full account numbers) */
            $table->string('payout_method')->nullable();
            $table->string('payout_account_holder')->nullable();
            $table->string('payout_country', 2)->nullable();
            $table->string('payout_currency', 3)->nullable();

            /* Step 9 — tax */
            $table->boolean('tax_registered')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('tax_country', 2)->nullable();

            /* Step 10 — identity */
            $table->string('identity_document_type')->nullable();
            $table->string('identity_full_name')->nullable();

            /* Step 11 — agreements */
            $table->boolean('accepted_terms')->default(false);
            $table->boolean('accepted_ppa')->default(false);
            $table->boolean('accepted_seller_standards')->default(false);
            $table->timestamp('agreements_accepted_at')->nullable();

            /* Review / decision */
            $table->unsignedTinyInteger('changes_step')->nullable();
            $table->text('reviewer_note')->nullable();
            $table->text('applicant_reply')->nullable();
            $table->text('decision_reason')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('decision_at')->nullable();
            $table->date('reapply_after')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('status');
        });

        Schema::create('partner_application_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_application_id')->constrained()->cascadeOnDelete();
            $table->string('kind');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime', 120)->nullable();
            $table->unsignedInteger('size')->default(0);
            $table->timestamps();

            $table->index(['partner_application_id', 'kind'], 'pa_files_app_kind_idx');
        });

        Schema::create('partner_application_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_application_id')->constrained()->cascadeOnDelete();
            $table->string('action');
            $table->string('actor');
            $table->unsignedTinyInteger('step')->nullable();
            $table->timestamps();

            $table->index(['partner_application_id', 'created_at'], 'pa_events_app_created_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_application_events');
        Schema::dropIfExists('partner_application_files');
        Schema::dropIfExists('partner_applications');
    }
};

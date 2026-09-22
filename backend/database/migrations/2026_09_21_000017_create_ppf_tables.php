<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Administrator-curated Platform Participation Fee schedule.
 *
 * This is the public fee-breakdown page and the records an administrator
 * edits. Transaction-level commission calculation is a separate domain.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppf_settings', function (Blueprint $table): void {
            $table->id();
            $table->boolean('is_published')->default(true);
            $table->json('copy');
            $table->json('anatomy_items');
            $table->json('statement');
            $table->json('movement');
            $table->json('cta_links');
            $table->decimal('processing_percent', 6, 3)->nullable();
            $table->decimal('processing_fixed', 12, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('ppf_tiers', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('badge');
            $table->string('name');
            $table->text('summary')->nullable();
            $table->string('emphasis', 20)->default('default');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('ppf_markets', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('ppf_markets')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('label');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->boolean('has_cards')->default(false);
            $table->json('columns');
            $table->text('example_note')->nullable();
            $table->text('upgrade_note')->nullable();
            $table->text('compliance_note')->nullable();
            $table->text('footnote')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['parent_id', 'position']);
        });

        Schema::create('ppf_plans', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('ppf_market_id')->constrained('ppf_markets')->cascadeOnDelete();
            $table->foreignId('ppf_tier_id')->nullable()->constrained('ppf_tiers')->nullOnDelete();
            $table->string('name');
            $table->string('qualification')->nullable();
            $table->string('rate_label')->nullable();
            $table->string('rate_suffix')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('style', 20)->default('default');
            $table->json('cells');
            $table->json('features');
            $table->decimal('volume_min', 14, 2)->nullable();
            $table->decimal('volume_max', 14, 2)->nullable();
            $table->decimal('subscription_amount', 12, 2)->nullable();
            $table->decimal('percent_rate', 6, 3)->nullable();
            $table->decimal('percent_rate_max', 6, 3)->nullable();
            $table->decimal('fixed_amount', 12, 2)->nullable();
            $table->decimal('min_fee', 12, 2)->nullable();
            $table->decimal('cap_fee', 12, 2)->nullable();
            $table->decimal('listing_amount', 12, 2)->nullable();
            $table->decimal('lead_amount', 12, 2)->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['ppf_market_id', 'position']);
        });

        Schema::create('ppf_faqs', function (Blueprint $table): void {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppf_faqs');
        Schema::dropIfExists('ppf_plans');
        Schema::dropIfExists('ppf_markets');
        Schema::dropIfExists('ppf_tiers');
        Schema::dropIfExists('ppf_settings');
    }
};

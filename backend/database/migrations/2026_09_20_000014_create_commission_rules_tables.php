<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Administrator-curated commission rules and marketplace defaults.
 *
 * Earnings, payouts, settlements and calculated transaction commissions are
 * not represented. A row here is only a rate the marketplace can apply later.
 * Nothing is seeded: empty is the honest starting state.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commission_rules', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status', 20)->default('draft');
            $table->string('calculation_type', 30)->default('percentage');
            $table->decimal('percentage_rate', 6, 3)->nullable();
            $table->decimal('fixed_amount', 12, 2)->nullable();
            $table->decimal('min_commission', 12, 2)->nullable();
            $table->decimal('max_commission', 12, 2)->nullable();
            $table->string('applies_to', 30)->default('all_vendors');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('store_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('priority')->default(100);
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->decimal('min_order_value', 12, 2)->nullable();
            $table->decimal('max_order_value', 12, 2)->nullable();
            $table->string('tax_treatment', 20)->default('exclude');
            $table->string('shipping_treatment', 20)->default('exclude');
            $table->string('discount_treatment', 20)->default('after');
            $table->string('refund_treatment', 20)->default('proportional');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'priority']);
            $table->index('applies_to');
            $table->index('starts_at');
            $table->index('ends_at');
        });

        Schema::create('commission_rule_admin_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('commission_rule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type', 20);
            $table->text('body')->nullable();
            $table->string('from_status', 20)->nullable();
            $table->string('to_status', 20)->nullable();
            $table->timestamps();

            $table->index(['commission_rule_id', 'created_at']);
            $table->index(['type', 'created_at']);
        });

        Schema::create('commission_settings', function (Blueprint $table): void {
            $table->id();
            $table->decimal('global_rate', 6, 3)->nullable();
            $table->decimal('product_rate', 6, 3)->nullable();
            $table->decimal('service_rate', 6, 3)->nullable();
            $table->decimal('fixed_fee', 12, 2)->nullable();
            $table->decimal('min_commission', 12, 2)->nullable();
            $table->decimal('max_commission', 12, 2)->nullable();
            $table->string('tax_treatment', 20)->default('exclude');
            $table->string('discount_treatment', 20)->default('after');
            $table->unsignedInteger('reserve_days')->nullable();
            $table->string('rounding', 20)->default('half_up');
            $table->string('currency', 3)->default('USD');
            $table->boolean('include_shipping')->default(false);
            $table->boolean('include_taxes')->default(false);
            $table->boolean('auto_refund_reversal')->default(false);
            $table->boolean('allow_negative_balances')->default(false);
            $table->boolean('approve_adjustments')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commission_rule_admin_events');
        Schema::dropIfExists('commission_rules');
        Schema::dropIfExists('commission_settings');
    }
};

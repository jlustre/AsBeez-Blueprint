<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Commercial commitments: product orders and service bookings.
 *
 * Checkout, payments, fulfillment, calendars, refunds and disputes are not
 * represented. A row here is only the listing of a commitment so administrators
 * can see what exists. Nothing is seeded: empty is the honest production state.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();

            $table->string('type', 30);
            $table->string('status', 30)->default('new');
            $table->text('status_reason')->nullable();
            $table->timestamp('status_changed_at')->nullable();
            $table->foreignId('status_changed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->string('payment_status', 30)->default('none');
            $table->string('fulfillment_status', 30)->nullable();
            $table->string('appointment_status', 30)->nullable();

            $table->string('item_name');
            $table->unsignedInteger('item_count')->default(1);
            $table->decimal('total', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->timestamp('scheduled_at')->nullable();

            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index('payment_status');
            $table->index('created_at');
            $table->index('scheduled_at');
        });

        Schema::create('order_admin_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type', 20);
            $table->text('body')->nullable();
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30)->nullable();
            $table->timestamps();

            $table->index(['order_id', 'created_at']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_admin_events');
        Schema::dropIfExists('orders');
    }
};

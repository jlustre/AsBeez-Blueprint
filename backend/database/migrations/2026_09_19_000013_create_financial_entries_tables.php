<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Posted financial entries visible to administrators.
 *
 * Payments, payouts, GL posting, processors, taxes and reconciliation are
 * not represented. A row here is only a recorded movement so this screen
 * can show what exists. Nothing is seeded: empty is the honest state.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_entries', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('store_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();

            $table->string('type', 30);
            $table->string('direction', 10);
            $table->string('status', 30)->default('pending');
            $table->string('subject');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('USD');

            $table->text('status_reason')->nullable();
            $table->timestamp('status_changed_at')->nullable();
            $table->foreignId('status_changed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index('direction');
            $table->index('created_at');
        });

        Schema::create('financial_entry_admin_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('financial_entry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type', 20);
            $table->text('body')->nullable();
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30)->nullable();
            $table->timestamps();

            $table->index(['financial_entry_id', 'created_at']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_entry_admin_events');
        Schema::dropIfExists('financial_entries');
    }
};

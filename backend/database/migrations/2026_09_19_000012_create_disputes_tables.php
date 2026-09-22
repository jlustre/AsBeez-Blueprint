<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Marketplace dispute cases.
 *
 * Chargebacks, evidence files, refunds and payout holds are not represented.
 * A row here is only the case record so administrators can see what exists.
 * Nothing is seeded: empty is the honest production state.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disputes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();

            $table->string('type', 30);
            $table->string('reason', 40);
            $table->string('status', 30)->default('new');
            $table->string('priority', 20)->default('normal');
            $table->string('outcome', 20)->default('none');
            $table->string('subject');
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->timestamp('due_at')->nullable();

            $table->text('status_reason')->nullable();
            $table->timestamp('status_changed_at')->nullable();
            $table->foreignId('status_changed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index('priority');
            $table->index('due_at');
            $table->index('created_at');
        });

        Schema::create('dispute_admin_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('dispute_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type', 20);
            $table->text('body')->nullable();
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30)->nullable();
            $table->timestamps();

            $table->index(['dispute_id', 'created_at']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispute_admin_events');
        Schema::dropIfExists('disputes');
    }
};

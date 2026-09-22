<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Account lifecycle and the audit trail behind it.
 *
 * Until now an account was implicitly active for as long as the row existed.
 * Administration needs to say more than that — an account can be awaiting
 * review, restricted, suspended, or deactivated — and every move between those
 * states has to be answerable afterwards, which is what the events table is
 * for. Deleting rows was never an option: a suspension people can no longer
 * account for is worse than no suspension at all.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('status', 20)->default('active')->after('role');
            $table->text('status_reason')->nullable()->after('status');
            $table->timestamp('status_changed_at')->nullable()->after('status_reason');

            // nullOnDelete, not cascade: losing the administrator's account
            // must not erase the fact that somebody made the change.
            $table->foreignId('status_changed_by')->nullable()->after('status_changed_at')
                ->constrained('users')->nullOnDelete();

            $table->timestamp('last_active_at')->nullable()->after('status_changed_by');

            $table->index('status');
            $table->index('last_active_at');
        });

        Schema::create('member_admin_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();

            // 'note' is an internal remark; 'status' records a lifecycle move.
            $table->string('type', 20);
            $table->text('body')->nullable();
            $table->string('from_status', 20)->nullable();
            $table->string('to_status', 20)->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_admin_events');

        Schema::table('users', function (Blueprint $table): void {
            // The foreign key holds the column, so it goes first.
            $table->dropForeign(['status_changed_by']);
            $table->dropIndex(['status']);
            $table->dropIndex(['last_active_at']);
            $table->dropColumn(['status', 'status_reason', 'status_changed_at', 'status_changed_by', 'last_active_at']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Listing fields that describe a service without starting a booking engine.
 *
 * Duration, delivery and booking model are what the vendor wrote on the
 * listing. Calendars, deposits and staff capacity are not represented yet.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->unsignedInteger('duration_minutes')->nullable()->after('low_stock_threshold');
            $table->string('delivery_method', 30)->nullable()->after('duration_minutes');
            $table->string('booking_model', 30)->nullable()->after('delivery_method');

            $table->index('delivery_method');
            $table->index('booking_model');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->dropIndex(['delivery_method']);
            $table->dropIndex(['booking_model']);
            $table->dropColumn(['duration_minutes', 'delivery_method', 'booking_model']);
        });
    }
};

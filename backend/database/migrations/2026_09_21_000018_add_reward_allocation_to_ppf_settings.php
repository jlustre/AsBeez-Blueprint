<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Member Reward Points are created from the Platform Participation Fee.
 *
 * These columns store the published allocation: company share, Compensation
 * Fund share, and how many RP one dollar of that fund creates.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ppf_settings', function (Blueprint $table): void {
            $table->decimal('company_percent', 6, 3)->nullable()->after('processing_fixed');
            $table->decimal('compensation_percent', 6, 3)->nullable()->after('company_percent');
            $table->decimal('rp_per_dollar', 8, 3)->nullable()->after('compensation_percent');
            $table->decimal('example_ppf_amount', 12, 2)->nullable()->after('rp_per_dollar');
        });
    }

    public function down(): void
    {
        Schema::table('ppf_settings', function (Blueprint $table): void {
            $table->dropColumn([
                'company_percent',
                'compensation_percent',
                'rp_per_dollar',
                'example_ppf_amount',
            ]);
        });
    }
};

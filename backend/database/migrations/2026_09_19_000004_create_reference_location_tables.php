<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Reference geography for address fields.
 *
 * Kept in the database rather than a frontend constant so an administrator can
 * restrict which countries the marketplace actually serves, and so the option
 * lists arrive through the same /structure call as every other choice on the
 * store profile.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table) {
            // ISO 3166-1 alpha-2.
            $table->string('code', 2)->primary();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            // Sorts a handful of countries to the top of the list.
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'position']);
        });

        Schema::create('country_regions', function (Blueprint $table) {
            $table->id();
            $table->string('country_code', 2);
            // ISO 3166-2 subdivision code, without the country prefix.
            $table->string('code', 10);
            $table->string('name');
            // state | province | territory | region | district | county
            $table->string('type')->default('state');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->foreign('country_code')->references('code')->on('countries')->cascadeOnDelete();
            $table->unique(['country_code', 'code']);
            $table->index(['country_code', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('country_regions');
        Schema::dropIfExists('countries');
    }
};

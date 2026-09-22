<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Homepage hero slides and catalog images.
 *
 * Ratings, review counts, distances and personalization scores are not here.
 * A slide is only curated promotional copy plus an image; a product image is
 * only the listing photograph.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->string('image_path')->nullable()->after('description');
        });

        Schema::create('home_slides', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('copy_key');
            $table->string('href')->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_slides');

        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn('image_path');
        });
    }
};

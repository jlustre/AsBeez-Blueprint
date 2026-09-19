<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();

            // A vendor may own several stores and each one is independent, so
            // this is indexed but deliberately NOT unique. Everything else in
            // the domain hangs off the store, never off the owner.
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();

            $table->string('name');
            $table->string('slug')->unique();
            $table->string('tagline', 120)->nullable();
            $table->text('description')->nullable();

            // Disk-relative paths; the disk itself is swappable (local → S3).
            $table->string('banner_path')->nullable();
            $table->string('logo_path')->nullable();

            $table->string('public_email')->nullable();
            $table->string('public_phone')->nullable();
            $table->string('website')->nullable();

            $table->string('country', 2)->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('address_line')->nullable();
            $table->boolean('hide_address')->default(false);
            $table->string('service_area')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->string('timezone')->default('America/Chicago');
            $table->string('currency', 3)->default('USD');
            $table->string('language', 5)->default('en');
            $table->decimal('min_order_amount', 10, 2)->nullable();

            // draft | active | paused | suspended
            $table->string('status')->default('draft');
            $table->timestamp('verified_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['owner_id', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};

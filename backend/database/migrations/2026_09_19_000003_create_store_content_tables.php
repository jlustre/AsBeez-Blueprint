<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Content tables: what each vendor fills in for one store. Every row is scoped
 * to a store_id — never to a user — because a vendor's stores are independent
 * of one another.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            // 0 = Sunday … 6 = Saturday, matching Carbon's dayOfWeek.
            $table->unsignedTinyInteger('weekday');
            $table->time('opens_at')->nullable();
            $table->time('closes_at')->nullable();
            $table->boolean('is_closed')->default(false);
            $table->timestamps();

            $table->unique(['store_id', 'weekday']);
        });

        Schema::create('store_socials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('social_platform_id')->constrained()->cascadeOnDelete();
            $table->string('value');
            $table->timestamps();

            $table->unique(['store_id', 'social_platform_id']);
        });

        Schema::create('store_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('policy_type_id')->constrained()->cascadeOnDelete();
            $table->longText('body')->nullable();
            // published | draft
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->unique(['store_id', 'policy_type_id']);
        });

        Schema::create('store_setting_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            // Referenced by key rather than id so a definition can be renamed
            // without rewriting every store's saved value.
            $table->string('setting_key');
            $table->string('value')->nullable();
            $table->timestamps();

            $table->unique(['store_id', 'setting_key']);
        });

        Schema::create('category_store', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);

            $table->unique(['store_id', 'category_id']);
        });

        Schema::create('store_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            // business | identity | email | phone | payment
            $table->string('kind');
            // unverified | pending | verified | rejected
            $table->string('status')->default('unverified');
            $table->string('reference')->nullable();
            $table->string('document_path')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->unique(['store_id', 'kind']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_verifications');
        Schema::dropIfExists('category_store');
        Schema::dropIfExists('store_setting_values');
        Schema::dropIfExists('store_policies');
        Schema::dropIfExists('store_socials');
        Schema::dropIfExists('store_hours');
    }
};

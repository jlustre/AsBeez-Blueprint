<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * One row per member, holding everything the profile page edits that
         * does not belong on `users`. Kept separate so the authentication table
         * stays small and a profile can be dropped without touching the account.
         */
        Schema::create('member_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('display_name')->nullable();
            // Public handle: asbeez.com/members/{username}
            $table->string('username')->nullable()->unique();

            $table->date('birth_date')->nullable();
            $table->string('gender')->nullable();
            $table->string('pronouns')->nullable();
            $table->string('occupation')->nullable();
            $table->string('company')->nullable();
            $table->string('website')->nullable();
            $table->text('bio')->nullable();

            $table->string('phone')->nullable();
            $table->string('language', 5)->default('en');
            $table->string('timezone')->default('UTC');
            $table->string('avatar_path')->nullable();

            // Public profile controls.
            $table->boolean('is_public')->default(true);
            $table->boolean('show_activity')->default(true);
            $table->boolean('show_reviews')->default(true);
            $table->boolean('allow_vendor_contact')->default(false);

            // Marketplace preferences.
            $table->string('favorite_business')->nullable();
            $table->unsignedInteger('shopping_radius_km')->nullable();

            $table->timestamps();
        });

        Schema::create('member_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('label')->default('Home');
            $table->string('recipient');
            $table->string('line1');
            $table->string('line2')->nullable();
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country', 2);
            $table->string('phone')->nullable();

            $table->boolean('is_default_shipping')->default(false);
            $table->boolean('is_default_billing')->default(false);
            $table->unsignedInteger('position')->default(0);

            $table->timestamps();

            $table->index(['user_id', 'position']);
        });

        // Interests reuse the same admin-curated category registry the stores
        // choose from, so one taxonomy serves both sides of the marketplace.
        Schema::create('category_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);

            $table->unique(['user_id', 'category_id']);
        });

        /*
         * Notification preferences follow the same structure/content split as
         * store settings: an administrator curates the topics and the channels,
         * and each member only stores the cells they have changed.
         */
        Schema::create('notification_channels', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            // A channel the member has no address for cannot be switched on.
            $table->string('requires')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('notification_topics', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->string('group')->default('general');
            // Transactional and security messages cannot be switched off.
            $table->boolean('is_mandatory')->default(false);
            $table->json('default_channels')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('member_notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('topic_key');
            $table->string('channel_key');
            $table->boolean('enabled')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'topic_key', 'channel_key'], 'member_notification_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_notification_preferences');
        Schema::dropIfExists('notification_topics');
        Schema::dropIfExists('notification_channels');
        Schema::dropIfExists('category_user');
        Schema::dropIfExists('member_addresses');
        Schema::dropIfExists('member_profiles');
    }
};

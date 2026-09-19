<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Structure tables: the admin-curated registries that decide which options a
 * store may choose from. Vendors never write to these — they only reference
 * them. Keeping them as real tables (rather than one generic key/value store)
 * means each registry can carry the fields its own admin screen needs.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('tone')->default('amber');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['parent_id', 'position']);
        });

        Schema::create('social_platforms', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            // Brand marks lucide does not ship are drawn from a stored SVG path.
            $table->string('icon')->nullable();
            $table->text('icon_path')->nullable();
            $table->string('input_type')->default('url');
            $table->string('placeholder')->nullable();
            $table->string('tone')->default('bg-slate-100 text-slate-700');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('policy_types', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->string('hint')->nullable();
            $table->string('icon')->default('FileText');
            $table->string('tone')->default('bg-slate-50 text-slate-700');
            $table->boolean('is_required')->default(false);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('setting_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('group')->default('general');
            $table->string('label');
            $table->string('hint')->nullable();
            // bool | select | number | text
            $table->string('type')->default('bool');
            $table->json('options')->nullable();
            $table->string('default_value')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index(['group', 'position']);
        });

        Schema::create('nav_links', function (Blueprint $table) {
            $table->id();
            $table->string('group');
            $table->string('label');
            $table->string('hint')->nullable();
            $table->string('icon')->default('LayoutGrid');
            $table->string('tone')->default('bg-slate-50 text-slate-700');
            $table->string('route')->default('#');
            // Names a counter the API fills in (e.g. "products.active"), so the
            // badge stays live instead of being frozen into the label.
            $table->string('badge_source')->nullable();
            $table->json('roles')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['group', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nav_links');
        Schema::dropIfExists('setting_definitions');
        Schema::dropIfExists('policy_types');
        Schema::dropIfExists('social_platforms');
        Schema::dropIfExists('categories');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Catalog listings that belong to a store.
 *
 * This is the start of the product catalog, not the commerce engine. A row
 * here is a listing: name, type, price, a simple stock count. Orders, GMV,
 * ratings, warehouses and fulfillment are not represented, because those
 * domains do not exist yet.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku', 64)->nullable()->unique();
            $table->string('type', 20);
            $table->string('status', 20)->default('draft');
            $table->text('status_reason')->nullable();
            $table->timestamp('status_changed_at')->nullable();
            $table->foreignId('status_changed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->string('brand')->nullable();
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('country', 2)->nullable();

            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');

            $table->boolean('track_inventory')->default(true);
            $table->unsignedInteger('stock_qty')->nullable();
            $table->unsignedInteger('low_stock_threshold')->nullable();

            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'status']);
            $table->index('status');
            $table->index('type');
            $table->index('created_at');
        });

        Schema::create('product_admin_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type', 20);
            $table->text('body')->nullable();
            $table->string('from_status', 20)->nullable();
            $table->string('to_status', 20)->nullable();
            $table->timestamps();

            $table->index(['product_id', 'created_at']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_admin_events');
        Schema::dropIfExists('products');
    }
};

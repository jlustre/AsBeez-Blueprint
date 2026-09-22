<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Per-locale overrides for admin-curated content.
 *
 * One polymorphic table rather than a `_translations` table per model, or JSON
 * columns on each: the seven registries that need translating share exactly the
 * same shape, and a single table keeps the admin screens uniform. Rows are
 * sparse — only a field actually translated occupies one, and anything missing
 * falls back to the value on the model itself.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->morphs('translatable');
            $table->string('locale', 10);
            $table->string('field', 50);
            $table->text('value');
            $table->timestamps();

            $table->unique(
                ['translatable_type', 'translatable_id', 'locale', 'field'],
                'translations_unique',
            );
            $table->index(['locale', 'translatable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};

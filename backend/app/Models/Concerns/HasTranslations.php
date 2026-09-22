<?php

namespace App\Models\Concerns;

use App\Models\Translation;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\App;

/**
 * Per-locale overrides for a model's text fields.
 *
 * A model lists its translatable fields in $translatable; reading one through
 * `tr()` returns the active locale's value, falling back to the column so a
 * missing translation degrades to the original language rather than to a blank
 * label.
 */
trait HasTranslations
{
    public function translations(): MorphMany
    {
        return $this->morphMany(Translation::class, 'translatable');
    }

    /**
     * @return list<string>
     */
    public function translatableFields(): array
    {
        return $this->translatable ?? [];
    }

    /**
     * The value of a field in the given locale, or the model's own value.
     */
    public function tr(string $field, ?string $locale = null): mixed
    {
        $locale = $locale ?: App::getLocale();

        if ($locale === config('app.fallback_locale') || ! in_array($field, $this->translatableFields(), true)) {
            return $this->{$field};
        }

        $value = $this->translations
            ->first(fn (Translation $t) => $t->locale === $locale && $t->field === $field)
            ?->value;

        return filled($value) ? $value : $this->{$field};
    }

    /**
     * Writes (or clears) one field in one locale.
     *
     * A blank value deletes the row instead of storing an empty string, so an
     * emptied field falls back to the original rather than rendering nothing.
     */
    public function setTranslation(string $locale, string $field, ?string $value): void
    {
        abort_unless(in_array($field, $this->translatableFields(), true), 422, "{$field} is not translatable.");

        if (blank($value)) {
            $this->translations()->where('locale', $locale)->where('field', $field)->delete();
        } else {
            $this->translations()->updateOrCreate(
                ['locale' => $locale, 'field' => $field],
                ['value' => $value],
            );
        }

        $this->load('translations');
    }

    /**
     * Every translated field for one locale, keyed by field.
     *
     * @return array<string, string>
     */
    public function translationsFor(string $locale): array
    {
        return $this->translations
            ->where('locale', $locale)
            ->mapWithKeys(fn (Translation $t) => [$t->field => $t->value])
            ->all();
    }

    /** Eager-loads translations by default; every read path needs them. */
    public function initializeHasTranslations(): void
    {
        $this->with = array_unique([...$this->with, 'translations']);
    }
}

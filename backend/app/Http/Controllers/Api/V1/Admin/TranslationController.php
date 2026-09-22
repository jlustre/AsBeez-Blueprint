<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\NavLink;
use App\Models\NotificationChannel;
use App\Models\NotificationTopic;
use App\Models\PolicyType;
use App\Models\SettingDefinition;
use App\Models\SocialPlatform;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Lets an administrator translate the curated registries.
 *
 * The registries are addressed by a URL-safe slug rather than a class name:
 * accepting a model class from the client would let a caller reach any model
 * in the application.
 */
class TranslationController extends Controller
{
    /**
     * slug => [model, label, the column that identifies a row to a human]
     *
     * @var array<string, array{0: class-string<Model>, 1: string, 2: string}>
     */
    private const REGISTRIES = [
        'categories' => [Category::class, 'Categories', 'slug'],
        'social-platforms' => [SocialPlatform::class, 'Social platforms', 'key'],
        'policy-types' => [PolicyType::class, 'Policy types', 'key'],
        'setting-definitions' => [SettingDefinition::class, 'Store settings', 'key'],
        'nav-links' => [NavLink::class, 'Navigation links', 'label'],
        'notification-topics' => [NotificationTopic::class, 'Notification topics', 'key'],
        'notification-channels' => [NotificationChannel::class, 'Notification channels', 'key'],
    ];

    /** What can be translated, and how much of it already is. */
    public function registries(): JsonResponse
    {
        $locales = array_keys(config('locales.supported'));
        $fallback = config('app.fallback_locale');
        $targets = array_values(array_diff($locales, [$fallback]));

        $registries = [];

        foreach (self::REGISTRIES as $slug => [$model, $label]) {
            $rows = $model::all();
            $fields = $rows->first()?->translatableFields() ?? [];

            // Only fields that actually hold text on a given row count toward
            // the total, so an empty optional hint cannot make a registry look
            // permanently unfinished.
            $translatable = 0;
            $done = array_fill_keys($targets, 0);

            foreach ($rows as $row) {
                foreach ($fields as $field) {
                    if (blank($row->{$field})) {
                        continue;
                    }

                    $translatable++;

                    foreach ($targets as $locale) {
                        if (filled($row->translationsFor($locale)[$field] ?? null)) {
                            $done[$locale]++;
                        }
                    }
                }
            }

            $registries[] = [
                'slug' => $slug,
                'label' => $label,
                'rows' => $rows->count(),
                'fields' => $fields,
                'translatable' => $translatable,
                'progress' => collect($targets)->mapWithKeys(fn (string $locale) => [$locale => [
                    'done' => $done[$locale],
                    'percent' => $translatable > 0 ? (int) round($done[$locale] / $translatable * 100) : 100,
                ]])->all(),
            ];
        }

        return response()->json([
            'fallback' => $fallback,
            'locales' => $targets,
            'registries' => $registries,
        ]);
    }

    /** Every row of one registry, with source text and current translations. */
    public function index(Request $request, string $registry): JsonResponse
    {
        [$model, $label, $identifier] = $this->registry($registry);

        $validated = $request->validate([
            'locale' => ['required', Rule::in(array_keys(config('locales.supported')))],
        ]);

        $locale = $validated['locale'];

        abort_if($locale === config('app.fallback_locale'), 422, 'The source language cannot be translated into itself.');

        $rows = $model::all()->map(function (Model $row) use ($identifier, $locale) {
            $existing = $row->translationsFor($locale);
            $fields = [];

            foreach ($row->translatableFields() as $field) {
                // A blank source field has nothing to translate.
                if (blank($row->{$field})) {
                    continue;
                }

                $fields[] = [
                    'field' => $field,
                    'source' => (string) $row->{$field},
                    'value' => $existing[$field] ?? '',
                ];
            }

            return [
                'id' => $row->getKey(),
                'identifier' => (string) $row->{$identifier},
                'fields' => $fields,
            ];
        })->filter(fn (array $row) => $row['fields'] !== [])->values();

        return response()->json([
            'registry' => ['slug' => $registry, 'label' => $label],
            'locale' => $locale,
            'rows' => $rows,
        ]);
    }

    /** Writes one row's translations for one locale. */
    public function update(Request $request, string $registry, int $id): JsonResponse
    {
        [$model] = $this->registry($registry);

        $validated = $request->validate([
            'locale' => ['required', Rule::in(array_keys(config('locales.supported')))],
            'values' => ['present', 'array'],
            'values.*' => ['nullable', 'string', 'max:2000'],
        ]);

        abort_if(
            $validated['locale'] === config('app.fallback_locale'),
            422,
            'The source language cannot be translated into itself.',
        );

        $row = $model::findOrFail($id);
        $allowed = $row->translatableFields();

        $unknown = array_diff(array_keys($validated['values']), $allowed);

        if ($unknown !== []) {
            return response()->json([
                'message' => 'Not translatable: '.implode(', ', $unknown),
                'errors' => ['values' => ['Not translatable: '.implode(', ', $unknown)]],
            ], 422);
        }

        foreach ($validated['values'] as $field => $value) {
            // A blank value clears the row, so the label falls back to the
            // source language rather than rendering as nothing.
            $row->setTranslation($validated['locale'], $field, $value);
        }

        return response()->json([
            'message' => __('app.admin.translations_saved'),
            'row' => [
                'id' => $row->getKey(),
                'values' => $row->translationsFor($validated['locale']),
            ],
        ]);
    }

    /**
     * @return array{0: class-string<Model>, 1: string, 2: string}
     */
    private function registry(string $slug): array
    {
        abort_unless(isset(self::REGISTRIES[$slug]), 404, 'Unknown registry.');

        return self::REGISTRIES[$slug];
    }
}

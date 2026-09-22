<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\SettingDefinition;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * Bulk-replace endpoints for the repeating sections of the profile.
 *
 * Each one replaces the whole collection in a transaction rather than diffing,
 * because the page edits these as a single form and a partial write would leave
 * a store with, say, three days of opening hours.
 */
class StoreContentController extends Controller
{
    private const PROFILE_RELATIONS = [
        'categories', 'hours', 'socials.platform', 'policies.type', 'verifications',
    ];

    public function hours(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $validated = $request->validate([
            'hours' => ['required', 'array', 'max:7'],
            'hours.*.weekday' => ['required', 'integer', 'between:0,6'],
            'hours.*.is_closed' => ['required', 'boolean'],
            'hours.*.opens_at' => ['nullable', 'date_format:H:i'],
            'hours.*.closes_at' => ['nullable', 'date_format:H:i'],
        ]);

        $seen = array_column($validated['hours'], 'weekday');

        if (count($seen) !== count(array_unique($seen))) {
            return response()->json(['message' => __('app.store.weekday_once')], 422);
        }

        DB::transaction(function () use ($store, $validated) {
            $store->hours()->delete();

            foreach ($validated['hours'] as $row) {
                $store->hours()->create([
                    'weekday' => $row['weekday'],
                    'is_closed' => $row['is_closed'],
                    'opens_at' => $row['opens_at'] ?? null,
                    'closes_at' => $row['closes_at'] ?? null,
                ]);
            }
        });

        return $this->profile($store);
    }

    public function socials(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $validated = $request->validate([
            'socials' => ['present', 'array'],
            'socials.*.platform_id' => ['required', 'integer', Rule::exists('social_platforms', 'id')->where('is_active', true)],
            'socials.*.value' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($store, $validated) {
            $store->socials()->delete();

            foreach ($validated['socials'] as $row) {
                // A blank field means "not set", not an empty row.
                if (blank($row['value'] ?? null)) {
                    continue;
                }

                $store->socials()->create([
                    'social_platform_id' => $row['platform_id'],
                    'value' => $row['value'],
                ]);
            }
        });

        return $this->profile($store);
    }

    public function categories(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $validated = $request->validate([
            'category_ids' => ['present', 'array', 'max:10'],
            'category_ids.*' => ['integer', Rule::exists('categories', 'id')->where('is_active', true)],
        ]);

        $store->categories()->sync(
            collect($validated['category_ids'])
                ->unique()
                ->values()
                ->mapWithKeys(fn (int $id, int $index) => [$id => ['position' => $index]])
                ->all(),
        );

        return $this->profile($store);
    }

    public function settings(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $definitions = SettingDefinition::all()->keyBy('key');

        $validated = $request->validate([
            'settings' => ['present', 'array'],
            'settings.*' => ['nullable'],
        ]);

        $unknown = array_diff(array_keys($validated['settings']), $definitions->keys()->all());

        if ($unknown !== []) {
            $message = __('app.store.unknown_setting', ['keys' => implode(', ', $unknown)]);

            return response()->json([
                'message' => $message,
                'errors' => ['settings' => [$message]],
            ], 422);
        }

        DB::transaction(function () use ($store, $validated, $definitions) {
            foreach ($validated['settings'] as $key => $value) {
                $store->settingValues()->updateOrCreate(
                    ['setting_key' => $key],
                    ['value' => $this->normalise($definitions[$key], $value)],
                );
            }
        });

        return $this->profile($store);
    }

    /** Store every value as a string; the definition says how to read it back. */
    private function normalise(SettingDefinition $definition, mixed $value): ?string
    {
        if ($definition->type === SettingDefinition::TYPE_BOOL) {
            return filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
        }

        return $value === null ? null : (string) $value;
    }

    private function profile(Store $store): JsonResponse
    {
        return response()->json([
            'store' => new StoreResource($store->fresh(self::PROFILE_RELATIONS)),
        ]);
    }
}

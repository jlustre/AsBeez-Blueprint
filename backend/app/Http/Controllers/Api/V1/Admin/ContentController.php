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
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Content & CMS administration.
 *
 * This is the directory of admin-curated site copy that already exists:
 * navigation, policy types, setting labels, social platforms, notification
 * copy, and categories. Public pages, articles, a media library, SEO scores,
 * views, and an editorial calendar are not modelled yet, so they are not
 * invented here.
 */
class ContentController extends Controller
{
    /**
     * @var array<string, array{0: class-string<Model>, 1: string, 2: string, 3: string, 4: bool}>
     */
    private const TYPES = [
        'nav-links' => [NavLink::class, 'NAV', 'label', 'label', true],
        'policy-types' => [PolicyType::class, 'POL', 'label', 'key', false],
        'setting-definitions' => [SettingDefinition::class, 'SET', 'label', 'key', false],
        'social-platforms' => [SocialPlatform::class, 'SOC', 'label', 'key', true],
        'notification-topics' => [NotificationTopic::class, 'TPC', 'label', 'key', true],
        'notification-channels' => [NotificationChannel::class, 'CHN', 'label', 'key', true],
        'categories' => [Category::class, 'CAT', 'name', 'slug', true],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'type' => ['nullable', Rule::in([...array_keys(self::TYPES), 'notifications'])],
            'active' => ['nullable', 'boolean'],
            'translation' => ['nullable', Rule::in(['complete', 'incomplete'])],
            'sort' => ['nullable', Rule::in(['position', 'name-asc', 'name-desc', 'newest', 'updated'])],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $items = $this->collect();
        $stats = $this->stats($items);
        $filtered = $this->filtered($items, $filters);
        $sorted = $this->sorted($filtered, $filters['sort'] ?? 'position');

        $page = $filters['page'] ?? 1;
        $perPage = $filters['per_page'] ?? 25;
        $slice = $sorted->forPage($page, $perPage)->values();

        $paginator = new LengthAwarePaginator($slice, $sorted->count(), $perPage, $page);

        return response()->json([
            'items' => $slice->all(),
            'tree' => $this->navigationTree(),
            'meta' => [
                'page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'stats' => $stats,
            'types' => array_keys(self::TYPES),
        ]);
    }

    public function show(string $type, int $id): JsonResponse
    {
        $item = $this->collect()->first(fn (array $row) => $row['type'] === $type && $row['id'] === $id);

        abort_if($item === null, 404);

        return response()->json(['item' => $item]);
    }

    public function update(Request $request, string $type, int $id): JsonResponse
    {
        [$model, , , , $canToggle] = $this->type($type);

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        if (! $canToggle) {
            throw ValidationException::withMessages([
                'is_active' => __('app.content.cannot_hide'),
            ]);
        }

        $record = $model::query()->findOrFail($id);
        $record->forceFill(['is_active' => $validated['is_active']])->save();

        $item = $this->collect()->first(fn (array $row) => $row['type'] === $type && $row['id'] === $id);

        return response()->json([
            'item' => $item,
            'message' => __('app.content.visibility_updated'),
        ]);
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function collect(): Collection
    {
        $locale = $this->targetLocale();
        $items = collect();

        foreach (self::TYPES as $type => [$model, $prefix, $title, $identifier, $canToggle]) {
            foreach ($model::query()->with('translations')->orderBy('id')->get() as $row) {
                $items->push($this->summarise($row, $type, $prefix, $title, $identifier, $canToggle, $locale));
            }
        }

        return $items;
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $items
     * @param  array<string, mixed>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function filtered(Collection $items, array $filters): Collection
    {
        return $items
            ->when($filters['type'] ?? null, function (Collection $rows, string $type) {
                if ($type === 'notifications') {
                    return $rows->whereIn('type', ['notification-topics', 'notification-channels'])->values();
                }

                return $rows->where('type', $type)->values();
            })
            ->when(array_key_exists('active', $filters) && $filters['active'] !== null, function (Collection $rows) use ($filters) {
                return $rows->where('is_active', (bool) $filters['active'])->values();
            })
            ->when(($filters['translation'] ?? null) === 'complete', fn (Collection $rows) => $rows->where('translation.incomplete', 0)->values())
            ->when(($filters['translation'] ?? null) === 'incomplete', fn (Collection $rows) => $rows->where('translation.incomplete', '>', 0)->values())
            ->when($filters['search'] ?? null, function (Collection $rows, string $search) {
                $needle = mb_strtolower($search);

                return $rows->filter(function (array $row) use ($needle) {
                    return str_contains(mb_strtolower($row['title']), $needle)
                        || str_contains(mb_strtolower($row['identifier']), $needle)
                        || str_contains(mb_strtolower($row['code']), $needle)
                        || str_contains(mb_strtolower((string) ($row['group'] ?? '')), $needle)
                        || str_contains(mb_strtolower((string) ($row['hint'] ?? '')), $needle);
                })->values();
            });
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $items
     * @return Collection<int, array<string, mixed>>
     */
    private function sorted(Collection $items, string $sort): Collection
    {
        return match ($sort) {
            'name-asc' => $items->sortBy(fn (array $row) => mb_strtolower($row['title']), SORT_NATURAL)->values(),
            'name-desc' => $items->sortByDesc(fn (array $row) => mb_strtolower($row['title']), SORT_NATURAL)->values(),
            'newest' => $items->sortByDesc('created_at')->values(),
            'updated' => $items->sortByDesc('updated_at')->values(),
            default => $items->sortBy([
                ['type', 'asc'],
                ['position', 'asc'],
                ['id', 'asc'],
            ])->values(),
        };
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $items
     * @return array<string, int>
     */
    private function stats(Collection $items): array
    {
        $byType = $items->countBy('type');

        return [
            'total' => $items->count(),
            'navigation' => $byType['nav-links'] ?? 0,
            'policies' => $byType['policy-types'] ?? 0,
            'settings' => $byType['setting-definitions'] ?? 0,
            'social' => $byType['social-platforms'] ?? 0,
            'notifications' => ($byType['notification-topics'] ?? 0) + ($byType['notification-channels'] ?? 0),
            'categories' => $byType['categories'] ?? 0,
            'active' => $items->where('is_active', true)->count(),
            'inactive' => $items->where('is_active', false)->count(),
            'translated_fields' => $items->sum(fn (array $row) => $row['translation']['done']),
            'missing_fields' => $items->sum(fn (array $row) => $row['translation']['incomplete']),
        ];
    }

    /**
     * @return list<array{context: string, groups: list<array{name: string, items: list<array<string, mixed>>}>}>
     */
    private function navigationTree(): array
    {
        return NavLink::query()
            ->orderBy('context')
            ->orderBy('position')
            ->get()
            ->groupBy('context')
            ->map(function (Collection $links, string $context) {
                return [
                    'context' => $context,
                    'groups' => $links->groupBy('group')->map(fn (Collection $group, string $name) => [
                        'name' => $name,
                        'items' => $group->map(fn (NavLink $link) => [
                            'id' => $link->id,
                            'title' => $link->label,
                            'is_active' => $link->is_active,
                        ])->values()->all(),
                    ])->values()->all(),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(Model $row, string $type, string $prefix, string $title, string $identifier, bool $canToggle, string $locale): array
    {
        $progress = $this->translationProgress($row, $locale);

        return [
            'id' => $row->getKey(),
            'type' => $type,
            'code' => $prefix.'-'.str_pad((string) $row->getKey(), 5, '0', STR_PAD_LEFT),
            'title' => $row->{$title},
            'identifier' => (string) $row->{$identifier},
            'hint' => $row->hint ?? $row->placeholder ?? null,
            'group' => $row->group ?? $row->context ?? null,
            'context' => $row->context ?? null,
            'tone' => $row->tone ?? null,
            'position' => (int) ($row->position ?? 0),
            'is_active' => $canToggle ? (bool) $row->is_active : true,
            'can_toggle' => $canToggle,
            'translation' => $progress,
            'created_at' => optional($row->created_at)?->toIso8601String(),
            'updated_at' => optional($row->updated_at)?->toIso8601String(),
        ];
    }

    /**
     * @return array{locale: string, done: int, total: int, incomplete: int, percent: int}
     */
    private function translationProgress(Model $row, string $locale): array
    {
        $done = 0;
        $total = 0;

        foreach ($row->translatableFields() as $field) {
            if (blank($row->{$field})) {
                continue;
            }

            $total++;

            if (filled($row->translationsFor($locale)[$field] ?? null)) {
                $done++;
            }
        }

        return [
            'locale' => $locale,
            'done' => $done,
            'total' => $total,
            'incomplete' => max(0, $total - $done),
            'percent' => $total > 0 ? (int) round(($done / $total) * 100) : 100,
        ];
    }

    /**
     * @return array{0: class-string<Model>, 1: string, 2: string, 3: string, 4: bool}
     */
    private function type(string $type): array
    {
        abort_unless(isset(self::TYPES[$type]), 404);

        return self::TYPES[$type];
    }

    private function targetLocale(): string
    {
        $locales = array_keys(config('locales.supported'));
        $targets = array_values(array_diff($locales, [config('app.fallback_locale')]));

        return $targets[0] ?? 'es';
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Category administration.
 *
 * Categories are the shared taxonomy stores, listings and member interests
 * already use. Commissions, SEO, media, attributes and vendor-eligibility
 * rules are not here — those domains do not exist yet.
 */
class CategoryController extends Controller
{
    private const SORTS = [
        'position' => ['position', 'asc'],
        'name-asc' => ['name', 'asc'],
        'name-desc' => ['name', 'desc'],
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'updated' => ['updated_at', 'desc'],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'roots' => ['nullable', 'boolean'],
            'children' => ['nullable', 'boolean'],
            'active' => ['nullable', 'boolean'],
            'empty' => ['nullable', 'boolean'],
            'kind' => ['nullable', Rule::in(['product', 'service'])],
            'sort' => ['nullable', Rule::in(array_keys(self::SORTS))],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        [$column, $direction] = self::SORTS[$filters['sort'] ?? 'position'];

        $categories = $this->filtered($request)
            ->with(['parent'])
            ->withCount($this->countRelations())
            ->orderBy($column, $direction)
            ->orderBy('id')
            ->paginate($filters['per_page'] ?? 25)
            ->withQueryString();

        $all = Category::query()
            ->with(['parent'])
            ->withCount($this->countRelations())
            ->orderBy('position')
            ->orderBy('name')
            ->get();

        return response()->json([
            'categories' => $categories->getCollection()->map(fn (Category $category) => $this->summarise($category))->all(),
            'tree' => $this->nest($all),
            'meta' => [
                'page' => $categories->currentPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
                'last_page' => $categories->lastPage(),
                'from' => $categories->firstItem(),
                'to' => $categories->lastItem(),
            ],
            'stats' => $this->stats(),
            'tones' => Category::TONES,
            'parents' => $all->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'parent_id' => $category->parent_id,
            ])->all(),
        ]);
    }

    public function show(Category $category): JsonResponse
    {
        $category->load(['parent', 'children'])->loadCount($this->countRelations());

        return response()->json([
            'category' => $this->detail($category),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validated($request);
        $validated['slug'] = $this->uniqueSlug($validated['slug'] ?? Str::slug($validated['name']));
        $validated['position'] = $validated['position'] ?? $this->nextPosition($validated['parent_id'] ?? null);
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['tone'] = $validated['tone'] ?? 'amber';

        $category = Category::query()->create($validated);

        return response()->json([
            'message' => __('app.categories.created'),
            'category' => $this->detail($category->fresh()->load(['parent', 'children'])->loadCount($this->countRelations())),
        ], 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $this->validated($request, $category);

        if (array_key_exists('parent_id', $validated)) {
            $this->assertAcyclic($category, $validated['parent_id']);
        }

        if (isset($validated['slug'])) {
            $validated['slug'] = $this->uniqueSlug($validated['slug'], $category->id);
        }

        $category->fill($validated)->save();

        return response()->json([
            'message' => __('app.categories.updated'),
            'category' => $this->detail($category->fresh()->load(['parent', 'children'])->loadCount($this->countRelations())),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Category $category = null): array
    {
        $creating = $category === null;

        return $request->validate([
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:120'],
            'slug' => [$creating ? 'nullable' : 'sometimes', 'string', 'max:120', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'tone' => ['nullable', Rule::in(Category::TONES)],
            'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['nullable', 'boolean'],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
        ]);
    }

    private function assertAcyclic(Category $category, mixed $parentId): void
    {
        if ($parentId === null) {
            return;
        }

        $parentId = (int) $parentId;

        if ($parentId === (int) $category->getKey() || in_array($parentId, $category->descendantIds(), true)) {
            throw ValidationException::withMessages([
                'parent_id' => __('app.categories.invalid_parent'),
            ]);
        }
    }

    private function uniqueSlug(string $slug, ?int $ignore = null): string
    {
        $base = Str::slug($slug) ?: 'category';
        $candidate = $base;
        $suffix = 2;

        while (Category::query()
            ->when($ignore, fn ($query, $id) => $query->where('id', '!=', $id))
            ->where('slug', $candidate)
            ->exists()) {
            $candidate = $base.'-'.$suffix;
            $suffix++;
        }

        return $candidate;
    }

    private function nextPosition(?int $parentId): int
    {
        return (int) Category::query()
            ->where('parent_id', $parentId)
            ->max('position') + 1;
    }

    private function filtered(Request $request)
    {
        return Category::query()
            ->when($request->input('search'), function ($query, $term): void {
                $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';
                $query->where(function ($query) use ($like, $term): void {
                    $query->where('name', 'like', $like)
                        ->orWhere('slug', 'like', $like);

                    if (preg_match('/^CAT-?(\d+)$/i', trim($term), $matches)) {
                        $query->orWhere('id', (int) $matches[1]);
                    } elseif (ctype_digit($term)) {
                        $query->orWhere('id', (int) $term);
                    }
                });
            })
            ->when($request->filled('parent_id'), fn ($query) => $query->where('parent_id', $request->integer('parent_id')))
            ->when($request->boolean('roots'), fn ($query) => $query->whereNull('parent_id'))
            ->when($request->boolean('children'), fn ($query) => $query->whereNotNull('parent_id'))
            ->when($request->has('active'), fn ($query) => $query->where('is_active', $request->boolean('active')))
            ->when($request->boolean('empty'), fn ($query) => $query
                ->whereDoesntHave('products')
                ->whereDoesntHave('stores'))
            ->when($request->input('kind') === 'product', fn ($query) => $query->whereHas(
                'products',
                fn ($products) => $products->where('type', '!=', Product::TYPE_SERVICE),
            ))
            ->when($request->input('kind') === 'service', fn ($query) => $query->whereHas(
                'products',
                fn ($products) => $products->where('type', Product::TYPE_SERVICE),
            ));
    }

    /**
     * @return array<int|string, mixed>
     */
    private function countRelations(): array
    {
        return [
            'stores',
            'children',
            'products as product_listings_count' => fn ($query) => $query->where('type', '!=', Product::TYPE_SERVICE),
            'products as service_listings_count' => fn ($query) => $query->where('type', Product::TYPE_SERVICE),
        ];
    }

    /**
     * @return array<string, int>
     */
    private function stats(): array
    {
        return [
            'total' => Category::query()->count(),
            'active' => Category::query()->where('is_active', true)->count(),
            'inactive' => Category::query()->where('is_active', false)->count(),
            'roots' => Category::query()->whereNull('parent_id')->count(),
            'children' => Category::query()->whereNotNull('parent_id')->count(),
            'empty' => Category::query()->whereDoesntHave('products')->whereDoesntHave('stores')->count(),
            'product_listings' => Product::query()->whereNotNull('category_id')->where('type', '!=', Product::TYPE_SERVICE)->count(),
            'service_listings' => Product::query()->whereNotNull('category_id')->where('type', Product::TYPE_SERVICE)->count(),
            'stores' => Category::query()->has('stores')->count(),
        ];
    }

    /**
     * @param  \Illuminate\Support\Collection<int, Category>  $categories
     * @return list<array<string, mixed>>
     */
    private function nest($categories, mixed $parentId = null): array
    {
        return $categories
            ->where('parent_id', $parentId)
            ->values()
            ->map(fn (Category $category) => array_merge($this->summarise($category), [
                'children' => $this->nest($categories, $category->id),
            ]))
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(Category $category): array
    {
        $products = (int) ($category->product_listings_count ?? 0);
        $services = (int) ($category->service_listings_count ?? 0);
        $stores = (int) ($category->stores_count ?? 0);

        return [
            'id' => $category->id,
            'code' => $category->code(),
            'name' => $category->name,
            'slug' => $category->slug,
            'tone' => $category->tone,
            'position' => $category->position,
            'is_active' => $category->is_active,
            'parent_id' => $category->parent_id,
            'parent' => $category->parent ? [
                'id' => $category->parent->id,
                'name' => $category->parent->name,
                'slug' => $category->parent->slug,
            ] : null,
            'level' => $category->relationLoaded('parent') ? $category->level() : 0,
            'children_count' => (int) ($category->children_count ?? 0),
            'product_listings' => $products,
            'service_listings' => $services,
            'store_count' => $stores,
            'is_empty' => $products === 0 && $services === 0 && $stores === 0,
            'created_at' => $category->created_at?->toIso8601String(),
            'updated_at' => $category->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detail(Category $category): array
    {
        $children = $category->relationLoaded('children')
            ? $category->children
            : $category->children()->get();

        return array_merge($this->summarise($category), [
            'spanish_name' => $category->translationsFor('es')['name'] ?? null,
            'children' => $children->map(fn (Category $child) => [
                'id' => $child->id,
                'name' => $child->name,
                'slug' => $child->slug,
                'is_active' => $child->is_active,
            ])->all(),
        ]);
    }
}

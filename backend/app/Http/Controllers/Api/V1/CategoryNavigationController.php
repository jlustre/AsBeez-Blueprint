<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

/**
 * The full category tree, for the storefront's category navigation.
 *
 * Separate from /home, which sends roots only: the homepage grid wants the
 * seven markets and nothing else, while the mega menu wants all ~180 rows.
 * Keeping them apart means every page load does not carry a payload only one
 * menu uses, and the menu can fetch once, lazily, when opened.
 *
 * Public on purpose — browsing the catalogue is what an anonymous visitor
 * comes to do.
 */
class CategoryNavigationController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            // Translations eagerly: tr() otherwise queries once per row, and
            // there are ~150 of them.
            ->with('translations')
            ->withCount([
                'products as listing_count' => fn ($query) => $query->where('status', Product::STATUS_PUBLISHED),
            ])
            ->orderBy('position')
            ->orderBy('name')
            ->get();

        $byParent = $categories->groupBy('parent_id');

        return response()->json([
            'categories' => $this->branch($byParent, null),
        ]);
    }

    /**
     * Builds one level and recurses, rolling descendant listings upward.
     *
     * `listing_count` is what sits directly in the category; `total_count`
     * includes everything filed beneath it, which is the number a shopper
     * reads as "how much is in here".
     *
     * @param  Collection<int|string, Collection<int, Category>>  $byParent
     * @return list<array<string, mixed>>
     */
    private function branch(Collection $byParent, ?int $parentId): array
    {
        return $byParent->get($parentId, collect())
            ->map(function (Category $category) use ($byParent): array {
                $children = $this->branch($byParent, $category->id);

                return [
                    'id' => $category->id,
                    'parent_id' => $category->parent_id,
                    'name' => $category->tr('name'),
                    'slug' => $category->slug,
                    'tone' => $category->tone,
                    'listing_count' => (int) $category->listing_count,
                    'total_count' => (int) $category->listing_count
                        + array_sum(array_column($children, 'total_count')),
                    'children' => $children,
                ];
            })
            ->values()
            ->all();
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\HomeSlide;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

/**
 * Public marketplace homepage.
 *
 * Slides, categories, stores and published listings only. Ratings, review
 * counts, distances, carts and personalization scores are omitted — those
 * domains do not exist yet.
 */
class HomeController extends Controller
{
    public function index(): JsonResponse
    {
        $listings = Product::query()
            ->with(['store.owner', 'category'])
            ->where('status', Product::STATUS_PUBLISHED)
            ->orderByDesc('published_at')
            ->orderBy('id')
            ->get();

        $deals = $listings
            ->filter(fn (Product $product) => $product->type !== Product::TYPE_SERVICE
                && $product->compare_at_price !== null
                && (float) $product->compare_at_price > (float) $product->price)
            ->values();

        $services = $listings
            ->where('type', Product::TYPE_SERVICE)
            ->values();

        $products = $listings
            ->where('type', '!=', Product::TYPE_SERVICE)
            ->values();

        $stores = Store::query()
            ->with('owner:id,name')
            ->where('status', Store::STATUS_ACTIVE)
            ->whereNotNull('banner_path')
            ->orderBy('name')
            ->get();

        $categories = Category::query()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->withCount([
                'products as listing_count' => fn ($query) => $query->where('status', Product::STATUS_PUBLISHED),
                'children as children_count',
            ])
            ->orderBy('position')
            ->orderBy('name')
            ->get();

        return response()->json([
            'slides' => HomeSlide::query()
                ->where('is_active', true)
                ->orderBy('position')
                ->get()
                ->map(fn (HomeSlide $slide) => [
                    'id' => $slide->id,
                    'slug' => $slide->slug,
                    'copy_key' => $slide->copy_key,
                    'href' => $slide->href,
                    'image_url' => $slide->imageUrl(),
                ])->all(),
            'categories' => $categories->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->tr('name'),
                'slug' => $category->slug,
                'tone' => $category->tone,
                'listing_count' => (int) $category->listing_count,
                'children_count' => (int) $category->children_count,
            ])->all(),
            'panels' => [
                'deals' => $deals->take(4)->map(fn (Product $product) => $product->imageUrl())->filter()->values()->all(),
                'services' => $services->take(4)->map(fn (Product $product) => $product->imageUrl())->filter()->values()->all(),
                'stores' => $stores->take(4)->map(fn (Store $store) => $store->bannerUrl())->filter()->values()->all(),
                'selling' => $stores->take(4)->map(fn (Store $store) => $store->logoUrl())->filter()->values()->all(),
            ],
            'deals' => $deals->map(fn (Product $product) => $this->listing($product))->all(),
            'services' => $services->map(fn (Product $product) => $this->listing($product))->all(),
            'products' => $products->map(fn (Product $product) => $this->listing($product))->all(),
            'stores' => $stores->map(fn (Store $store) => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'tagline' => $store->tagline,
                'banner_url' => $store->bannerUrl(),
                'logo_url' => $store->logoUrl(),
                'verified' => $store->verified_at !== null,
            ])->all(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function listing(Product $product): array
    {
        $price = (float) $product->price;
        $compare = $product->compare_at_price !== null ? (float) $product->compare_at_price : null;
        $discount = $compare && $compare > $price
            ? (int) round((($compare - $price) / $compare) * 100)
            : null;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'type' => $product->type,
            'tagline' => $product->tagline,
            'price' => $price,
            'compare_at_price' => $compare,
            'discount_percent' => $discount,
            'currency' => $product->currency ?: 'USD',
            'image_url' => $product->imageUrl(),
            'store' => $product->store ? [
                'id' => $product->store->id,
                'name' => $product->store->name,
                'slug' => $product->store->slug,
                'verified' => $product->store->verified_at !== null,
            ] : null,
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->tr('name'),
                'slug' => $product->category->slug,
            ] : null,
        ];
    }
}

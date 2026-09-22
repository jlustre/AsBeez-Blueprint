<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\HomeSlide;
use App\Models\Product;
use App\Models\Store;
use Database\Seeders\Support\PlaceholderImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Homepage fixtures: hero slides and listing photographs.
 *
 * Prefers photography in database/seeders/assets (fetched by
 * `php artisan demo:fetch-images`) and draws generated art when a file is
 * missing. Ratings, reviews and distances are not invented.
 */
class DemoHomepageSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->seedSlides();
        $this->seedExtraListings();
        $this->seedListingImages();

        $this->command?->info('Seeded homepage slides and catalog images.');
    }

    private function seedSlides(): void
    {
        $slides = [
            ['shop', 'hero.slide1', '?store=golden-hive-market#storefront', 'home-slide-shop.jpg', 0],
            ['services', 'hero.slide2', '?store=hive-home-services#storefront', 'home-slide-services.jpg', 1],
            ['sell', 'hero.slide3', '#marketplace', 'home-slide-sell.jpg', 2],
        ];

        foreach ($slides as $index => [$slug, $copyKey, $href, $asset, $position]) {
            $slide = HomeSlide::updateOrCreate(
                ['slug' => $slug],
                ['copy_key' => $copyKey, 'href' => $href, 'position' => $position, 'is_active' => true],
            );

            $this->writeImage($slide, 'image_path', "home/slides/{$slug}", $asset, PlaceholderImage::cover(1600, 800, $index));
        }
    }

    /**
     * A few extra published rows so the homepage rails are not a pair of cards.
     * These sit on stores DemoStoreSeeder already created.
     */
    private function seedExtraListings(): void
    {
        $extras = [
            [
                'store' => 'golden-hive-market',
                'category' => 'honey-pantry',
                'name' => 'Orange Blossom Honey Jar',
                'sku' => 'GH-HNY-OB',
                'type' => Product::TYPE_PHYSICAL,
                'tagline' => 'Single 12-ounce jar',
                'description' => 'Raw orange-blossom honey from the Austin metro. A single-jar companion to the three-pack.',
                'price' => 16.00,
                'compare_at_price' => 19.00,
                'stock_qty' => 48,
                'asset' => 'product-honey-jar.jpg',
            ],
            [
                'store' => 'northern-pro',
                'category' => 'kitchen-dining',
                'name' => 'Cast Iron Skillet 10-inch',
                'sku' => 'NPS-SKILLET-10',
                'type' => Product::TYPE_PHYSICAL,
                'tagline' => 'Pre-seasoned skillet',
                'description' => 'A 10-inch pre-seasoned skillet listed by Northern Pro Supply.',
                'price' => 42.00,
                'compare_at_price' => 54.00,
                'stock_qty' => 27,
                'asset' => 'product-skillet.jpg',
            ],
            [
                'store' => 'golden-hive-market',
                'category' => 'home-decor',
                'name' => 'Beeswax Votive Set',
                'sku' => 'GH-VOTE-6',
                'type' => Product::TYPE_PHYSICAL,
                'tagline' => 'Six unscented votives',
                'description' => 'A six-pack of unscented beeswax votives from Hive Home Goods.',
                'price' => 22.00,
                'stock_qty' => 61,
                'asset' => 'product-votive.jpg',
            ],
            [
                'store' => 'pacific-pixel',
                'category' => 'digital-templates',
                'name' => 'Store Hours Sign Template',
                'sku' => 'PP-HOURS-TPL',
                'type' => Product::TYPE_DIGITAL,
                'tagline' => 'Printable hours card',
                'description' => 'A printable store-hours template. File delivery is not wired yet.',
                'price' => 8.00,
                'track_inventory' => false,
                'asset' => 'product-template.jpg',
            ],
            [
                'store' => 'northern-pro',
                'category' => 'workshop-tools',
                'name' => 'Shop Apron with Tool Loops',
                'sku' => 'NPS-APRON-01',
                'type' => Product::TYPE_PHYSICAL,
                'tagline' => 'Canvas shop apron',
                'description' => 'A canvas shop apron with tool loops, listed by Northern Pro Supply.',
                'price' => 28.00,
                'stock_qty' => 19,
                'asset' => 'product-workshop.jpg',
            ],
            [
                'store' => 'golden-hive-market',
                'category' => 'home-cleaning',
                'name' => 'Porch and Entry Refresh',
                'sku' => 'GH-PORCH-01',
                'type' => Product::TYPE_SERVICE,
                'tagline' => 'Exterior tidy-up visit',
                'description' => 'A listed porch and entry tidy-up. Bookings are not taken from this row yet.',
                'price' => 65.00,
                'track_inventory' => false,
                'duration_minutes' => 60,
                'delivery_method' => Product::DELIVERY_ON_SITE,
                'booking_model' => Product::BOOKING_REQUEST,
                'asset' => 'product-porch.jpg',
            ],
        ];

        foreach ($extras as $listing) {
            $store = Store::where('slug', $listing['store'])->first();

            if (! $store) {
                continue;
            }

            $track = $listing['track_inventory'] ?? true;

            Product::updateOrCreate(
                ['sku' => $listing['sku']],
                [
                    'store_id' => $store->getKey(),
                    'category_id' => Category::where('slug', $listing['category'])->value('id'),
                    'name' => $listing['name'],
                    'slug' => Str::slug($listing['name']),
                    'type' => $listing['type'],
                    'status' => Product::STATUS_PUBLISHED,
                    'brand' => $store->name,
                    'tagline' => $listing['tagline'],
                    'description' => $listing['description'],
                    'country' => $store->country,
                    'price' => $listing['price'],
                    'compare_at_price' => $listing['compare_at_price'] ?? null,
                    'currency' => $store->currency ?: 'USD',
                    'track_inventory' => $track,
                    'stock_qty' => $track ? ($listing['stock_qty'] ?? 0) : null,
                    'duration_minutes' => $listing['duration_minutes'] ?? null,
                    'delivery_method' => $listing['delivery_method'] ?? null,
                    'booking_model' => $listing['booking_model'] ?? null,
                    'published_at' => now()->subDays(5),
                ],
            );
        }
    }

    private function seedListingImages(): void
    {
        $assets = [
            'GH-HNY-3' => 'product-honey-pack.jpg',
            'GH-BOARD-01' => 'product-board.jpg',
            'HHS-CLEAN-DEEP' => 'product-cleaning.jpg',
            'PP-WCAG-AUDIT' => 'product-audit.jpg',
            'MD-EBOOK-ONBOARD' => 'product-ebook.jpg',
            'NPS-DRILL-20' => 'product-drill.jpg',
            'UT-CLAMP-6' => 'product-clamps.jpg',
            'GH-HNY-OB' => 'product-honey-jar.jpg',
            'NPS-SKILLET-10' => 'product-skillet.jpg',
            'GH-VOTE-6' => 'product-votive.jpg',
            'PP-HOURS-TPL' => 'product-template.jpg',
            'NPS-APRON-01' => 'product-workshop.jpg',
            'GH-PORCH-01' => 'product-porch.jpg',
        ];

        $variant = 0;

        foreach (Product::query()->orderBy('id')->get() as $product) {
            $asset = $assets[$product->sku] ?? null;
            $this->writeImage(
                $product,
                'image_path',
                "products/{$product->id}/image",
                $asset,
                PlaceholderImage::cover(800, 600, $variant % 5),
            );
            $variant++;
        }
    }

    private function writeImage(Product|HomeSlide $model, string $column, string $directory, ?string $asset, string $fallback): void
    {
        $disk = Storage::disk(Store::MEDIA_DISK);
        $bytes = $asset ? $this->asset($asset) : null;
        $extension = $bytes ? 'jpg' : 'png';
        $path = "{$directory}/demo.{$extension}";

        if ($model->{$column} && $model->{$column} !== $path) {
            $disk->delete($model->{$column});
        }

        $disk->put($path, $bytes ?? $fallback);
        $model->update([$column => $path]);
    }

    private function asset(string $file): ?string
    {
        $path = database_path("seeders/assets/{$file}");

        return is_file($path) ? (string) file_get_contents($path) : null;
    }
}

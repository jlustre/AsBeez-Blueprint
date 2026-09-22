<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Catalog fixtures so the admin product directory is not empty after a seed.
 *
 * These listings sit on stores created by DemoStoreSeeder. They are not a
 * commerce catalog: no orders, ratings or warehouses ride along.
 */
class DemoProductSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $listings = [
            [
                'store' => 'golden-hive-market',
                'category' => 'honey-pantry',
                'name' => 'Wildflower Honey Three-Pack',
                'sku' => 'GH-HNY-3',
                'type' => Product::TYPE_BUNDLE,
                'status' => Product::STATUS_PUBLISHED,
                'brand' => 'Golden Hive',
                'tagline' => 'Local artisan food',
                'description' => 'Three 12-ounce jars of raw wildflower honey from the Austin metro apiaries, packed as a gift set.',
                'price' => 42.00,
                'compare_at_price' => 48.00,
                'stock_qty' => 0,
                'low_stock_threshold' => 8,
            ],
            [
                'store' => 'golden-hive-market2',
                'category' => 'kitchen-dining',
                'name' => 'Beeswax Serving Board',
                'sku' => 'GH-BOARD-01',
                'type' => Product::TYPE_PHYSICAL,
                'status' => Product::STATUS_PUBLISHED,
                'brand' => 'Golden Hive',
                'tagline' => 'Food-safe oak board',
                'description' => 'A hand-finished oak serving board treated with food-safe beeswax oil. Sold as a single listing without variants yet.',
                'price' => 74.00,
                'compare_at_price' => 89.00,
                'stock_qty' => 86,
                'low_stock_threshold' => 15,
            ],
            [
                'store' => 'hive-home-services',
                'category' => 'home-cleaning',
                'name' => 'Home Cleaning Visit',
                'sku' => 'HHS-CLEAN-01',
                'type' => Product::TYPE_SERVICE,
                'status' => Product::STATUS_DRAFT,
                'brand' => 'Hive Home',
                'tagline' => 'Trusted local cleaning',
                'description' => 'A two-hour residential cleaning visit booked through Hive Home Services. Inventory is not tracked for services.',
                'price' => 120.00,
                'track_inventory' => false,
                'duration_minutes' => 120,
                'delivery_method' => Product::DELIVERY_ON_SITE,
                'booking_model' => Product::BOOKING_REQUEST,
            ],
            [
                'store' => 'hive-home-services',
                'category' => 'home-cleaning',
                'name' => 'Complete Home Deep Cleaning',
                'sku' => 'HHS-CLEAN-DEEP',
                'type' => Product::TYPE_SERVICE,
                'status' => Product::STATUS_PUBLISHED,
                'brand' => 'Hive Home',
                'tagline' => 'Whole-home deep clean',
                'description' => 'A listed deep-cleaning visit for the Austin metro. Bookings and staff calendars are not wired yet; this is the catalog row.',
                'price' => 149.00,
                'track_inventory' => false,
                'duration_minutes' => 240,
                'delivery_method' => Product::DELIVERY_ON_SITE,
                'booking_model' => Product::BOOKING_INSTANT,
            ],
            [
                'store' => 'pacific-pixel',
                'category' => 'design-audit',
                'name' => 'Website Accessibility Review',
                'sku' => 'PP-WCAG-AUDIT',
                'type' => Product::TYPE_SERVICE,
                'status' => Product::STATUS_PUBLISHED,
                'brand' => 'Pacific Pixel',
                'tagline' => 'Remote audit with a written report',
                'description' => 'A remote accessibility review of a public website. Delivery is the report, not a calendar slot.',
                'price' => 450.00,
                'track_inventory' => false,
                'duration_minutes' => null,
                'delivery_method' => Product::DELIVERY_REMOTE,
                'booking_model' => Product::BOOKING_QUOTE,
            ],
            [
                'store' => 'maple-digital',
                'category' => 'consulting',
                'name' => 'Small Business Strategy Consultation',
                'sku' => 'MD-STRATEGY-90',
                'type' => Product::TYPE_SERVICE,
                'status' => Product::STATUS_PENDING,
                'brand' => 'Maple Digital',
                'tagline' => 'Discovery and 90-minute session',
                'description' => 'A remote strategy consultation awaiting catalog review. No bookings are taken yet.',
                'price' => 225.00,
                'track_inventory' => false,
                'duration_minutes' => 90,
                'delivery_method' => Product::DELIVERY_REMOTE,
                'booking_model' => Product::BOOKING_REQUEST,
            ],
            [
                'store' => 'urban-tool',
                'category' => 'trades-repair',
                'name' => 'Same-Day Electrical Panel Repair',
                'sku' => 'UT-ELECTRIC',
                'type' => Product::TYPE_SERVICE,
                'status' => Product::STATUS_REJECTED,
                'status_reason' => 'Required license not provided.',
                'brand' => 'Urban Tool',
                'tagline' => 'Rejected listing',
                'description' => 'Rejected because the listing claimed licensed electrical work without documents on file.',
                'price' => 180.00,
                'track_inventory' => false,
                'delivery_method' => Product::DELIVERY_ON_SITE,
                'booking_model' => Product::BOOKING_QUOTE,
            ],
            [
                'store' => 'nova-style',
                'category' => 'consulting',
                'name' => 'Guaranteed Investment Returns Coaching',
                'sku' => 'NS-INVEST-01',
                'type' => Product::TYPE_SERVICE,
                'status' => Product::STATUS_HIDDEN,
                'status_reason' => 'Misleading financial claims reported.',
                'brand' => 'Nova Style',
                'tagline' => 'Hidden pending review',
                'description' => 'Hidden after a report of guaranteed-return claims. Kept so administrators can review the listing.',
                'price' => 499.00,
                'track_inventory' => false,
                'duration_minutes' => 120,
                'delivery_method' => Product::DELIVERY_REMOTE,
                'booking_model' => Product::BOOKING_REQUEST,
            ],
            [
                'store' => 'golden-hive-market',
                'category' => 'local-events',
                'name' => 'Holiday Event Photography',
                'sku' => 'GH-HOLIDAY-PHOTO',
                'type' => Product::TYPE_SERVICE,
                'status' => Product::STATUS_ARCHIVED,
                'status_reason' => 'Seasonal listing archived.',
                'brand' => 'Golden Hive',
                'tagline' => 'Seasonal event coverage',
                'description' => 'An archived seasonal photography listing. Calendars and packages are not a separate table yet.',
                'price' => 650.00,
                'track_inventory' => false,
                'duration_minutes' => 360,
                'delivery_method' => Product::DELIVERY_HYBRID,
                'booking_model' => Product::BOOKING_REQUEST,
            ],
            [
                'store' => 'pacific-pixel',
                'category' => 'digital-templates',
                'name' => 'Small Business Invoice Template',
                'sku' => 'PP-INV-001',
                'type' => Product::TYPE_DIGITAL,
                'status' => Product::STATUS_PENDING,
                'brand' => 'Pacific Pixel',
                'tagline' => 'Excel, Sheets, and PDF',
                'description' => 'A reusable invoice workbook for small studios. Digital delivery is not wired yet; this row is the listing record.',
                'price' => 18.00,
                'track_inventory' => false,
            ],
            [
                'store' => 'maple-digital',
                'category' => 'digital-ebooks',
                'name' => 'Client Onboarding Checklist',
                'sku' => 'MD-EBOOK-ONBOARD',
                'type' => Product::TYPE_DIGITAL,
                'status' => Product::STATUS_PUBLISHED,
                'brand' => 'Maple Digital',
                'tagline' => 'PDF guide for studios',
                'description' => 'A downloadable onboarding checklist for small studios. File delivery is not wired yet; this is the catalog row.',
                'price' => 12.00,
                'track_inventory' => false,
            ],
            [
                'store' => 'northern-pro',
                'category' => 'workshop-tools',
                'name' => 'ProGrade 20V Cordless Drill',
                'sku' => 'NPS-DRILL-20',
                'type' => Product::TYPE_PHYSICAL,
                'status' => Product::STATUS_PUBLISHED,
                'brand' => 'Northern Pro',
                'tagline' => 'Battery included',
                'description' => 'A 20-volt cordless drill listed by Northern Pro Supply. Variants and warehouse bins are not modelled yet.',
                'price' => 189.00,
                'stock_qty' => 642,
                'low_stock_threshold' => 25,
            ],
            [
                'store' => 'urban-tool',
                'category' => 'workshop-tools',
                'name' => 'Workshop Clamp Set',
                'sku' => 'UT-CLAMP-6',
                'type' => Product::TYPE_PHYSICAL,
                'status' => Product::STATUS_PUBLISHED,
                'brand' => 'Urban Tool',
                'tagline' => 'Six-piece clamp kit',
                'description' => 'A six-piece bar clamp set for small workshops. Stock is low so the directory can exercise that filter.',
                'price' => 54.00,
                'stock_qty' => 6,
                'low_stock_threshold' => 10,
            ],
            [
                'store' => 'nova-style',
                'category' => 'bags-accessories',
                'name' => 'Designer-Inspired Luxury Handbag',
                'sku' => 'NS-BAG-221',
                'type' => Product::TYPE_PHYSICAL,
                'status' => Product::STATUS_HIDDEN,
                'status_reason' => 'Trademark report received.',
                'brand' => 'Nova Style',
                'tagline' => 'Under review',
                'description' => 'Hidden after a trademark report. The listing stays in the catalog so administrators can review it.',
                'price' => 249.00,
                'stock_qty' => 14,
            ],
            [
                'store' => 'maple-digital',
                'category' => 'supplements',
                'name' => 'Rapid Herbal Detox Capsules',
                'sku' => 'MD-DTX-30',
                'type' => Product::TYPE_PHYSICAL,
                'status' => Product::STATUS_REJECTED,
                'status_reason' => 'Unsubstantiated health claims.',
                'brand' => 'Maple Digital',
                'tagline' => 'Rejected listing',
                'description' => 'Rejected for unsubstantiated health claims. Kept as a fixture for the rejected filter.',
                'price' => 39.00,
                'stock_qty' => 0,
            ],
            [
                'store' => 'golden-hive-market',
                'category' => 'home-decor',
                'name' => 'Personalized Family Welcome Sign',
                'sku' => 'GH-SIGN-CUSTOM',
                'type' => Product::TYPE_CUSTOM,
                'status' => Product::STATUS_ARCHIVED,
                'status_reason' => 'Seasonal listing archived.',
                'brand' => 'Golden Hive',
                'tagline' => 'Custom text',
                'description' => 'An archived custom sign listing. Personalization fields are not a separate table yet.',
                'price' => 110.00,
                'track_inventory' => false,
            ],
        ];

        foreach ($listings as $listing) {
            $store = Store::where('slug', $listing['store'])->first();

            if (! $store) {
                $this->command?->warn("DemoProductSeeder skipped \"{$listing['name']}\": store {$listing['store']} is missing.");

                continue;
            }

            $categoryId = Category::where('slug', $listing['category'])->value('id');
            $status = $listing['status'];
            $track = $listing['track_inventory'] ?? true;

            Product::updateOrCreate(
                ['sku' => $listing['sku']],
                [
                    'store_id' => $store->getKey(),
                    'category_id' => $categoryId,
                    'name' => $listing['name'],
                    'slug' => Str::slug($listing['name']),
                    'type' => $listing['type'],
                    'status' => $status,
                    'status_reason' => $listing['status_reason'] ?? null,
                    'status_changed_at' => in_array($status, Product::STATUSES_NEEDING_REASON, true) ? now()->subDays(2) : null,
                    'brand' => $listing['brand'],
                    'tagline' => $listing['tagline'],
                    'description' => $listing['description'],
                    'country' => $store->country,
                    'price' => $listing['price'],
                    'compare_at_price' => $listing['compare_at_price'] ?? null,
                    'currency' => $store->currency ?: 'USD',
                    'track_inventory' => $track,
                    'stock_qty' => $track ? ($listing['stock_qty'] ?? 0) : null,
                    'low_stock_threshold' => $track ? ($listing['low_stock_threshold'] ?? 10) : null,
                    'duration_minutes' => $listing['duration_minutes'] ?? null,
                    'delivery_method' => $listing['delivery_method'] ?? null,
                    'booking_model' => $listing['booking_model'] ?? null,
                    'published_at' => $status === Product::STATUS_PUBLISHED ? now()->subDays(12) : null,
                ],
            );
        }

        $this->command?->info('Seeded catalog listings for the admin product directory.');
    }
}

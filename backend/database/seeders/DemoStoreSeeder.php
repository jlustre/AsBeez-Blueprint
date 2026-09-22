<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PolicyType;
use App\Models\SettingDefinition;
use App\Models\SocialPlatform;
use App\Models\Store;
use App\Models\StoreHour;
use App\Models\StorePolicy;
use App\Models\StoreSettingValue;
use App\Models\StoreSocial;
use App\Models\StoreVerification;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\Support\PlaceholderImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Seeds the vendor-side CONTENT for one example store — the values the React
 * page currently hard-codes — so the page has something real to read once it is
 * rewired.
 *
 * Two stores are created for the seeded vendor to exercise the multi-store rule:
 * a vendor may own several, and each is an independent entity.
 */
class DemoStoreSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $vendor = User::whereEmail('vendor@asbeez.test')->first();

        if (! $vendor) {
            $this->command?->warn('DemoStoreSeeder skipped: run UserSeeder first.');

            return;
        }

        $store = $this->seedGoldenHive($vendor);
        $this->seedSecondStore($vendor);
        $this->seedDirectoryFixtures();

        $this->command?->info("Seeded store \"{$store->name}\" (/{$store->slug}) for {$vendor->email}.");
    }

    /**
     * Extra vendor rows so the admin directory is not a single account after
     * a fresh seed. These are fixtures, not sign-in targets.
     */
    private function seedDirectoryFixtures(): void
    {
        $fixtures = [
            [
                'email' => 'maya@pacificpixel.test',
                'name' => 'Maya Chen',
                'status' => User::STATUS_PENDING,
                'verified' => false,
                'store' => [
                    'name' => 'Pacific Pixel Studio',
                    'slug' => 'pacific-pixel',
                    'status' => Store::STATUS_DRAFT,
                    'city' => 'Vancouver',
                    'state' => 'BC',
                    'country' => 'CA',
                    'public_email' => 'maya@pacificpixel.ca',
                    'categories' => ['electronics', 'digital-products'],
                ],
            ],
            [
                'email' => 'sales@northernpro.test',
                'name' => 'Gabriel Santos',
                'status' => User::STATUS_ACTIVE,
                'verified' => true,
                'store' => [
                    'name' => 'Northern Pro Supply',
                    'slug' => 'northern-pro',
                    'status' => Store::STATUS_ACTIVE,
                    'city' => 'Calgary',
                    'state' => 'AB',
                    'country' => 'CA',
                    'public_email' => 'sales@northernpro.com',
                    'verified' => true,
                    'categories' => ['home-living'],
                ],
            ],
            [
                'email' => 'omar@urbantool.test',
                'name' => 'Omar Haddad',
                'status' => User::STATUS_RESTRICTED,
                'verified' => true,
                'status_reason' => 'Open marketplace dispute.',
                'store' => [
                    'name' => 'Urban Tool Exchange',
                    'slug' => 'urban-tool',
                    'status' => Store::STATUS_PAUSED,
                    'city' => 'Toronto',
                    'state' => 'ON',
                    'country' => 'CA',
                    'public_email' => 'omar@urbantool.com',
                    'categories' => ['local-services'],
                ],
            ],
            [
                'email' => 'nina@novastyle.test',
                'name' => 'Nina Brooks',
                'status' => User::STATUS_SUSPENDED,
                'verified' => true,
                'status_reason' => 'Compliance review.',
                'store' => [
                    'name' => 'Nova Style Depot',
                    'slug' => 'nova-style',
                    'status' => Store::STATUS_SUSPENDED,
                    'city' => 'Seattle',
                    'state' => 'WA',
                    'country' => 'US',
                    'public_email' => 'nina@novastyle.com',
                    'categories' => ['health-beauty'],
                ],
            ],
            [
                'email' => 'linda@mapledigital.test',
                'name' => 'Linda Patel',
                'status' => User::STATUS_DEACTIVATED,
                'verified' => true,
                'status_reason' => 'Vendor requested deactivation.',
                'store' => [
                    'name' => 'Maple Digital Works',
                    'slug' => 'maple-digital',
                    'status' => Store::STATUS_DRAFT,
                    'city' => 'Burnaby',
                    'state' => 'BC',
                    'country' => 'CA',
                    'public_email' => 'linda@mapledigital.ca',
                    'categories' => ['electronics', 'digital-products'],
                ],
            ],
        ];

        foreach ($fixtures as $index => $fixture) {
            $account = User::updateOrCreate(
                ['email' => $fixture['email']],
                [
                    'name' => $fixture['name'],
                    'role' => User::ROLE_VENDOR,
                    'password' => UserSeeder::PASSWORD,
                ],
            );

            $account->forceFill([
                'status' => $fixture['status'],
                'status_reason' => $fixture['status_reason'] ?? null,
                'status_changed_at' => now()->subHours(8),
                'email_verified_at' => $fixture['verified'] ? now()->subDays(4) : null,
                'last_active_at' => now()->subHours(2),
            ])->save();

            $storeData = $fixture['store'];
            $store = Store::updateOrCreate(
                ['slug' => $storeData['slug']],
                [
                    'owner_id' => $account->getKey(),
                    'name' => $storeData['name'],
                    'status' => $storeData['status'],
                    'city' => $storeData['city'],
                    'state' => $storeData['state'],
                    'country' => $storeData['country'],
                    'public_email' => $storeData['public_email'],
                    'timezone' => 'America/Vancouver',
                    'verified_at' => ($storeData['verified'] ?? false) ? now() : null,
                ],
            );

            $this->seedCategories($store, $storeData['categories']);
            $this->seedMedia($store, $index + 2, $storeData['slug']);

            if ($account->email === 'maya@pacificpixel.test') {
                StoreVerification::updateOrCreate(
                    ['store_id' => $store->getKey(), 'kind' => 'business'],
                    [
                        'status' => StoreVerification::STATUS_PENDING,
                        'reference' => 'Business documents uploaded',
                    ],
                );
            }
        }
    }

    private function seedGoldenHive(User $vendor): Store
    {
        $store = Store::updateOrCreate(
            ['slug' => 'golden-hive-market'],
            [
                'owner_id' => $vendor->getKey(),
                'name' => 'Golden Hive Market',
                'tagline' => 'Pure, raw, and locally-sourced honey and beeswax goods.',
                'description' => 'Golden Hive Market is a family-owned apiary and marketplace providing raw honey, beeswax products, and artisan goods sourced from local beekeepers. We also offer home cleaning, business consulting, and senior-care services through trusted AsBeez providers in the Austin area.',
                'public_email' => 'hello@goldenhivemarket.com',
                'public_phone' => '+1 (512) 555-0142',
                'website' => 'https://goldenhivemarket.com',
                'country' => 'US',
                'state' => 'TX',
                'city' => 'Austin',
                'postal_code' => '78701',
                'address_line' => '1842 Honeycomb Lane, Suite 4',
                'hide_address' => false,
                'service_area' => 'Greater Austin metro area, within 40 miles of downtown',
                'latitude' => 30.2672,
                'longitude' => -97.7431,
                'timezone' => 'America/Chicago',
                'currency' => 'USD',
                'language' => 'en',
                'min_order_amount' => 15.00,
                'status' => Store::STATUS_ACTIVE,
                'verified_at' => now(),
            ],
        );

        $this->seedMedia($store, 0, 'golden-hive');
        $this->seedHours($store);
        $this->seedCategories($store, ['food-beverage', 'home-living', 'local-services']);
        $this->seedSocials($store);
        $this->seedPolicies($store);
        $this->seedSettings($store);
        $this->seedVerifications($store);

        return $store;
    }

    /** A second, independent store proves nothing is scoped to the owner. */
    private function seedSecondStore(User $vendor): void
    {
        $store = Store::updateOrCreate(
            ['slug' => 'hive-home-services'],
            [
                'owner_id' => $vendor->getKey(),
                'name' => 'Hive Home Services',
                'tagline' => 'Trusted local cleaning and handyman work.',
                'description' => 'A separate service-only storefront operated by the same owner, with its own policies, hours and verification.',
                'public_email' => 'book@hivehomeservices.com',
                'country' => 'US',
                'state' => 'TX',
                'city' => 'Austin',
                'timezone' => 'America/Chicago',
                'status' => Store::STATUS_DRAFT,
            ],
        );

        $this->seedMedia($store, 1, 'hive-home');
        $this->seedHours($store);
        $this->seedCategories($store, ['local-services']);
    }

    /**
     * Puts a banner and logo on the store_media disk.
     *
     * Prefers the real photography in database/seeders/assets (fetched once by
     * `php artisan demo:fetch-images`) and draws a generated placeholder when a
     * file is missing, so seeding never depends on the network or on those
     * binaries being committed.
     *
     * Paths are deterministic so re-seeding overwrites in place rather than
     * piling up files, and they follow the same stores/{id}/{kind} convention
     * the upload endpoint uses, so removing an image through the UI still
     * cleans it up.
     */
    private function seedMedia(Store $store, int $variant, string $assetPrefix): void
    {
        $disk = Storage::disk(Store::MEDIA_DISK);
        $id = $store->getKey();

        $banner = $this->asset("{$assetPrefix}-banner.jpg");
        $logo = $this->asset("{$assetPrefix}-logo.jpg");

        $files = [
            'banner_path' => $banner
                ? ["stores/{$id}/banner/demo-banner.jpg", $banner]
                : ["stores/{$id}/banner/demo-banner.png", PlaceholderImage::banner(1600, 400, $variant)],
            'logo_path' => $logo
                ? ["stores/{$id}/logo/demo-logo.jpg", $logo]
                : ["stores/{$id}/logo/demo-logo.png", PlaceholderImage::logo(400, $variant)],
        ];

        foreach ($files as $column => [$path, $bytes]) {
            // A previous seed may have written a different extension; the
            // superseded file would otherwise sit on the disk forever.
            if ($store->{$column} && $store->{$column} !== $path) {
                $disk->delete($store->{$column});
            }

            $disk->put($path, $bytes);
        }

        $store->update([
            'banner_path' => $files['banner_path'][0],
            'logo_path' => $files['logo_path'][0],
        ]);
    }

    /** Returns the bytes of a seeder asset, or null when it has not been fetched. */
    private function asset(string $file): ?string
    {
        $path = database_path("seeders/assets/{$file}");

        return is_file($path) ? (string) file_get_contents($path) : null;
    }

    private function seedHours(Store $store): void
    {
        // 0 = Sunday. Weekdays 09:00–18:00, Saturday short, Sunday closed.
        $schedule = [
            0 => ['10:00', '14:00', true],
            1 => ['09:00', '18:00', false],
            2 => ['09:00', '18:00', false],
            3 => ['09:00', '18:00', false],
            4 => ['09:00', '18:00', false],
            5 => ['09:00', '18:00', false],
            6 => ['10:00', '16:00', false],
        ];

        foreach ($schedule as $weekday => [$opens, $closes, $closed]) {
            StoreHour::updateOrCreate(
                ['store_id' => $store->getKey(), 'weekday' => $weekday],
                ['opens_at' => $opens, 'closes_at' => $closes, 'is_closed' => $closed],
            );
        }
    }

    /**
     * @param  list<string>  $slugs
     */
    private function seedCategories(Store $store, array $slugs): void
    {
        $ids = Category::whereIn('slug', $slugs)->pluck('id', 'slug');

        $store->categories()->sync(
            collect($slugs)
                ->filter(fn (string $slug) => isset($ids[$slug]))
                ->values()
                ->mapWithKeys(fn (string $slug, int $index) => [$ids[$slug] => ['position' => $index]])
                ->all(),
        );
    }

    private function seedSocials(Store $store): void
    {
        $values = [
            'facebook' => 'https://facebook.com/goldenhivemarket',
            'instagram' => 'https://instagram.com/goldenhivemarket',
            'tiktok' => 'https://tiktok.com/@goldenhivemarket',
            'youtube' => 'https://youtube.com/@goldenhivemarket',
            'linkedin' => 'https://linkedin.com/company/goldenhivemarket',
            'x' => 'https://x.com/goldenhivemkt',
            'whatsapp' => '+1 (512) 555-0142',
            'messenger' => 'goldenhivemarket',
        ];

        $platforms = SocialPlatform::whereIn('key', array_keys($values))->pluck('id', 'key');

        foreach ($values as $key => $value) {
            if (! isset($platforms[$key])) {
                continue;
            }

            StoreSocial::updateOrCreate(
                ['store_id' => $store->getKey(), 'social_platform_id' => $platforms[$key]],
                ['value' => $value],
            );
        }
    }

    private function seedPolicies(Store $store): void
    {
        $states = [
            'shipping' => StorePolicy::STATUS_PUBLISHED,
            'return_refund' => StorePolicy::STATUS_PUBLISHED,
            'cancellation' => StorePolicy::STATUS_DRAFT,
            'privacy' => StorePolicy::STATUS_PUBLISHED,
            'warranty' => StorePolicy::STATUS_DRAFT,
            'custom' => StorePolicy::STATUS_PUBLISHED,
            // "terms_and_conditions" is intentionally absent: the page shows it
            // as "Not configured", which is simply the missing row.
        ];

        $types = PolicyType::whereIn('key', array_keys($states))->pluck('id', 'key');

        foreach ($states as $key => $status) {
            if (! isset($types[$key])) {
                continue;
            }

            StorePolicy::updateOrCreate(
                ['store_id' => $store->getKey(), 'policy_type_id' => $types[$key]],
                [
                    'body' => 'Placeholder policy body — replace from the vendor policy editor.',
                    'status' => $status,
                    'published_at' => $status === StorePolicy::STATUS_PUBLISHED ? now() : null,
                ],
            );
        }
    }

    private function seedSettings(Store $store): void
    {
        // Only values that differ from the admin-defined default are stored;
        // everything else resolves through SettingDefinition.
        $overrides = [
            'vacation_mode' => '0',
            'display_sales_count' => '0',
            'display_customer_service_phone_number' => '0',
            'min_order_amount' => '15.00',
        ];

        $known = SettingDefinition::whereIn('key', array_keys($overrides))->pluck('key')->all();

        foreach ($overrides as $key => $value) {
            if (! in_array($key, $known, true)) {
                continue;
            }

            StoreSettingValue::updateOrCreate(
                ['store_id' => $store->getKey(), 'setting_key' => $key],
                ['value' => $value],
            );
        }
    }

    private function seedVerifications(Store $store): void
    {
        $rows = [
            ['business', StoreVerification::STATUS_VERIFIED, 'Business license #TX-884201'],
            ['identity', StoreVerification::STATUS_VERIFIED, 'Government ID and selfie confirmed'],
            ['email', StoreVerification::STATUS_VERIFIED, 'hello@goldenhivemarket.com'],
            ['phone', StoreVerification::STATUS_PENDING, null],
            ['payment', StoreVerification::STATUS_VERIFIED, 'AsBeez Secure Payments'],
        ];

        foreach ($rows as [$kind, $status, $reference]) {
            StoreVerification::updateOrCreate(
                ['store_id' => $store->getKey(), 'kind' => $kind],
                [
                    'status' => $status,
                    'reference' => $reference,
                    'verified_at' => $status === StoreVerification::STATUS_VERIFIED ? now() : null,
                ],
            );
        }
    }
}

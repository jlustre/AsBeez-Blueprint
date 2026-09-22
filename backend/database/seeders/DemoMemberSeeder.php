<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MemberAddress;
use App\Models\MemberProfile;
use App\Models\User;
use Database\Seeders\Support\PlaceholderImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Fills in the seeded member so the profile page has something real to read.
 */
class DemoMemberSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $member = User::whereEmail('member@asbeez.test')->first();

        if (! $member) {
            $this->command?->warn('DemoMemberSeeder skipped: run UserSeeder first.');

            return;
        }

        $profile = MemberProfile::updateOrCreate(
            ['user_id' => $member->getKey()],
            [
                'first_name' => 'Joey',
                'middle_name' => 'M.',
                'last_name' => 'Lustre',
                'display_name' => 'Joey L.',
                'username' => 'joey-lustre',
                'birth_date' => '1990-06-15',
                'gender' => 'prefer-not-to-say',
                'pronouns' => 'They/Them',
                'occupation' => 'IT Director and Web Developer',
                'company' => 'AsBeez Marketplace',
                'website' => 'https://joeylustre.com',
                'bio' => 'Technology professional, entrepreneur, and community supporter who enjoys discovering dependable local businesses and thoughtfully made products.',
                'phone' => '+1 (604) 555-0148',
                'language' => 'en',
                'timezone' => 'America/Vancouver',
                'is_public' => true,
                'show_activity' => true,
                'show_reviews' => true,
                'allow_vendor_contact' => false,
                'favorite_business' => 'Honeycomb Home Market',
                'shopping_radius_km' => 25,
            ],
        );

        $this->seedAvatar($profile);
        $this->seedInterests($member);
        $this->seedAddresses($member);

        $this->seedDirectoryFixtures();

        $this->command?->info("Seeded member profile @{$profile->username} for {$member->email}.");
    }

    /**
     * Extra directory rows so the admin members screen is not a single-line list
     * after a fresh seed. These accounts are fixtures, not sign-in targets.
     */
    private function seedDirectoryFixtures(): void
    {
        $fixtures = [
            [
                'email' => 'maya.chen@asbeez.test',
                'name' => 'Maya Chen',
                'status' => User::STATUS_PENDING,
                'verified' => false,
                'username' => 'mayac',
                'phone' => '+1 (604) 555-6702',
                'last_active_minutes' => 12,
            ],
            [
                'email' => 'gabriel.santos@asbeez.test',
                'name' => 'Gabriel Santos',
                'status' => User::STATUS_ACTIVE,
                'verified' => true,
                'username' => 'gabrielshops',
                'phone' => '+1 (604) 555-9921',
                'last_active_minutes' => 3,
            ],
            [
                'email' => 'nina.brooks@asbeez.test',
                'name' => 'Nina Brooks',
                'status' => User::STATUS_SUSPENDED,
                'verified' => true,
                'username' => 'ninab',
                'phone' => '+1 (604) 555-4419',
                'last_active_minutes' => 60 * 24,
                'status_reason' => 'Identity mismatch under review.',
            ],
            [
                'email' => 'omar.haddad@asbeez.test',
                'name' => 'Omar Haddad',
                'status' => User::STATUS_RESTRICTED,
                'verified' => false,
                'username' => 'omarh',
                'phone' => '+1 (604) 555-3112',
                'last_active_minutes' => 60 * 18,
                'status_reason' => 'Open marketplace dispute.',
            ],
            [
                'email' => 'linda.patel@asbeez.test',
                'name' => 'Linda Patel',
                'status' => User::STATUS_DEACTIVATED,
                'verified' => true,
                'username' => 'lindap',
                'phone' => '+1 (604) 555-8061',
                'last_active_minutes' => 60 * 24 * 90,
                'status_reason' => 'Member requested deactivation.',
            ],
        ];

        foreach ($fixtures as $fixture) {
            $account = User::updateOrCreate(
                ['email' => $fixture['email']],
                [
                    'name' => $fixture['name'],
                    'role' => User::ROLE_MEMBER,
                    'password' => UserSeeder::PASSWORD,
                ],
            );

            $account->forceFill([
                'status' => $fixture['status'],
                'status_reason' => $fixture['status_reason'] ?? null,
                'status_changed_at' => now()->subHours(6),
                'email_verified_at' => $fixture['verified'] ? now()->subDays(3) : null,
                'last_active_at' => now()->subMinutes($fixture['last_active_minutes']),
            ])->save();

            MemberProfile::updateOrCreate(
                ['user_id' => $account->getKey()],
                [
                    'first_name' => explode(' ', $fixture['name'])[0],
                    'last_name' => explode(' ', $fixture['name'])[1] ?? '',
                    'display_name' => $fixture['name'],
                    'username' => $fixture['username'],
                    'phone' => $fixture['phone'],
                    'language' => 'en',
                    'timezone' => 'America/Vancouver',
                ],
            );
        }
    }

    private function seedAvatar(MemberProfile $profile): void
    {
        $path = "members/{$profile->user_id}/avatar/demo-avatar.png";
        $disk = Storage::disk(MemberProfile::MEDIA_DISK);

        if ($profile->avatar_path && $profile->avatar_path !== $path) {
            $disk->delete($profile->avatar_path);
        }

        // Same generated artwork as the stores: no network, no committed binary.
        $disk->put($path, PlaceholderImage::logo(400, 2));
        $profile->update(['avatar_path' => $path]);
    }

    private function seedInterests(User $member): void
    {
        $slugs = ['home-living', 'electronics', 'health-beauty', 'local-services'];
        $ids = Category::whereIn('slug', $slugs)->pluck('id', 'slug');

        $member->interests()->sync(
            collect($slugs)
                ->filter(fn (string $slug) => isset($ids[$slug]))
                ->values()
                ->mapWithKeys(fn (string $slug, int $index) => [$ids[$slug] => ['position' => $index]])
                ->all(),
        );
    }

    private function seedAddresses(User $member): void
    {
        $addresses = [
            [
                'label' => 'Home',
                'recipient' => 'Joey Lustre',
                'line1' => '4567 Beechnut Avenue',
                'city' => 'Burnaby',
                'state' => 'BC',
                'postal_code' => 'V5G 3H2',
                'country' => 'CA',
                'phone' => '+1 (604) 555-0148',
                'is_default_shipping' => true,
                'is_default_billing' => true,
                'position' => 0,
            ],
            [
                'label' => 'Family',
                'recipient' => 'Family Recipient',
                'line1' => '1820 Maple Street',
                'city' => 'Vancouver',
                'state' => 'BC',
                'postal_code' => 'V6B 2W2',
                'country' => 'CA',
                'phone' => '+1 (604) 555-0194',
                'is_default_shipping' => false,
                'is_default_billing' => false,
                'position' => 1,
            ],
        ];

        foreach ($addresses as $address) {
            MemberAddress::updateOrCreate(
                ['user_id' => $member->getKey(), 'label' => $address['label']],
                $address,
            );
        }
    }
}

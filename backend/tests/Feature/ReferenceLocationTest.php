<?php

namespace Tests\Feature;

use App\Models\Country;
use App\Models\CountryRegion;
use App\Models\Store;
use App\Models\User;
use Database\Seeders\ReferenceLocationSeeder;
use Database\Seeders\StoreStructureSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReferenceLocationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ReferenceLocationSeeder::class);
    }

    /* ---------------------------------------------------------------- */
    /* Seeded data                                                       */
    /* ---------------------------------------------------------------- */

    public function test_it_seeds_the_whole_iso_country_list(): void
    {
        // ICU carries every assigned alpha-2 code plus a few exceptional
        // reservations, so this is a floor rather than an exact figure.
        $this->assertGreaterThan(240, Country::count());

        foreach (['US', 'PH', 'CA', 'AU', 'GB', 'MX', 'JP', 'DE', 'BR'] as $code) {
            $this->assertTrue(Country::whereKey($code)->exists(), "{$code} is missing.");
        }

        $this->assertSame('United States', Country::whereKey('US')->value('name'));
        $this->assertSame('Philippines', Country::whereKey('PH')->value('name'));
    }

    public function test_it_stores_only_real_alpha_two_codes(): void
    {
        // ICU also exposes numeric macro-regions such as 001 (World) and 150
        // (Europe); those must not end up in a country dropdown.
        foreach (Country::pluck('code') as $code) {
            $this->assertMatchesRegularExpression('/^[A-Z]{2}$/', $code);
        }
    }

    public function test_it_excludes_the_things_icu_lists_that_are_not_places(): void
    {
        // ICU's region bundle also carries macro-regions, political unions and
        // its own pseudo-locales. A seller must never be able to pick
        // "Unknown Region" or "Pseudo-Bidi" as their country.
        foreach (['ZZ', 'QO', 'EU', 'EZ', 'UN', 'XA', 'XB'] as $code) {
            $this->assertFalse(Country::whereKey($code)->exists(), "{$code} should not be offered as a country.");
        }

        // Exceptionally reserved codes for real territories do stay.
        $this->assertTrue(Country::whereKey('AC')->exists());
        $this->assertTrue(Country::whereKey('XK')->exists());
    }

    public function test_served_markets_sort_above_the_alphabetical_list(): void
    {
        $first = Country::active()->orderBy('position')->orderBy('name')->limit(6)->pluck('code')->all();

        $this->assertSame(['PH', 'US', 'CA', 'AU', 'GB', 'MX'], $first);
    }

    public function test_it_seeds_subdivisions_for_the_served_markets(): void
    {
        $expected = ['US' => 56, 'PH' => 82, 'MX' => 32, 'CA' => 13, 'AU' => 8, 'GB' => 4];

        foreach ($expected as $country => $count) {
            $this->assertSame($count, CountryRegion::where('country_code', $country)->count(), "{$country} region count");
        }

        $this->assertSame('Texas', CountryRegion::where('country_code', 'US')->where('code', 'TX')->value('name'));
        $this->assertSame('Laguna', CountryRegion::where('country_code', 'PH')->where('code', 'LAG')->value('name'));
    }

    public function test_subdivision_types_describe_what_each_country_calls_them(): void
    {
        $this->assertSame('province', CountryRegion::where('country_code', 'CA')->where('code', 'ON')->value('type'));
        $this->assertSame('territory', CountryRegion::where('country_code', 'CA')->where('code', 'YT')->value('type'));
        $this->assertSame('district', CountryRegion::where('country_code', 'US')->where('code', 'DC')->value('type'));
        $this->assertSame('country', CountryRegion::where('country_code', 'GB')->where('code', 'SCT')->value('type'));
    }

    public function test_reseeding_does_not_duplicate(): void
    {
        $countries = Country::count();
        $regions = CountryRegion::count();

        $this->seed(ReferenceLocationSeeder::class);

        $this->assertSame($countries, Country::count());
        $this->assertSame($regions, CountryRegion::count());
    }

    public function test_reseeding_leaves_an_administrators_deactivations_alone(): void
    {
        Country::whereKey('AQ')->update(['is_active' => false]);

        $this->seed(ReferenceLocationSeeder::class);

        $this->assertFalse((bool) Country::whereKey('AQ')->value('is_active'));
    }

    /* ---------------------------------------------------------------- */
    /* Exposure                                                          */
    /* ---------------------------------------------------------------- */

    public function test_structure_serves_countries_and_regions_keyed_by_country(): void
    {
        $this->seed(StoreStructureSeeder::class);

        $payload = $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/structure')
            ->assertOk()
            ->json();

        $this->assertGreaterThan(240, count($payload['countries']));
        $this->assertSame('PH', $payload['countries'][0]['code']);

        $this->assertArrayHasKey('US', $payload['regions']);
        $this->assertArrayNotHasKey('DE', $payload['regions'], 'Germany has no seeded list and should fall back to free text.');
        $this->assertSame(['code', 'name', 'type'], array_keys($payload['regions']['US'][0]));
    }

    public function test_inactive_countries_are_not_offered(): void
    {
        $this->seed(StoreStructureSeeder::class);
        Country::whereKey('PH')->update(['is_active' => false]);

        $codes = collect(
            $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
                ->getJson('/api/v1/structure')
                ->json('countries'),
        )->pluck('code');

        $this->assertFalse($codes->contains('PH'));
    }

    /* ---------------------------------------------------------------- */
    /* Validation                                                        */
    /* ---------------------------------------------------------------- */

    public function test_it_rejects_a_country_that_is_not_in_the_list(): void
    {
        [$vendor, $store] = $this->vendorWithStore();

        $this->actingAs($vendor)
            ->putJson("/api/v1/vendor/stores/{$store->id}", ['country' => 'ZZ'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('country');
    }

    public function test_it_rejects_a_country_an_administrator_has_switched_off(): void
    {
        [$vendor, $store] = $this->vendorWithStore();
        Country::whereKey('MX')->update(['is_active' => false]);

        $this->actingAs($vendor)
            ->putJson("/api/v1/vendor/stores/{$store->id}", ['country' => 'MX'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('country');
    }

    public function test_it_rejects_a_state_that_belongs_to_a_different_country(): void
    {
        [$vendor, $store] = $this->vendorWithStore();

        // TX is a US state, not a Canadian province.
        $this->actingAs($vendor)
            ->putJson("/api/v1/vendor/stores/{$store->id}", ['country' => 'CA', 'state' => 'TX'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('state');
    }

    public function test_it_accepts_a_valid_country_and_state_pair(): void
    {
        [$vendor, $store] = $this->vendorWithStore();

        $this->actingAs($vendor)
            ->putJson("/api/v1/vendor/stores/{$store->id}", ['country' => 'PH', 'state' => 'LAG'])
            ->assertOk()
            ->assertJsonPath('store.location.state', 'LAG')
            // The code is stored; the name is resolved for display.
            ->assertJsonPath('store.location.state_name', 'Laguna')
            ->assertJsonPath('store.location.country_name', 'Philippines');
    }

    public function test_a_country_without_a_seeded_list_keeps_free_text(): void
    {
        [$vendor, $store] = $this->vendorWithStore();

        $this->actingAs($vendor)
            ->putJson("/api/v1/vendor/stores/{$store->id}", ['country' => 'DE', 'state' => 'Bayern'])
            ->assertOk()
            ->assertJsonPath('store.location.state', 'Bayern')
            // With nothing to resolve against, the stored value is the display value.
            ->assertJsonPath('store.location.state_name', 'Bayern');
    }

    /**
     * @return array{0: User, 1: Store}
     */
    private function vendorWithStore(): array
    {
        $this->seed(StoreStructureSeeder::class);
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();

        return [$vendor, Store::factory()->ownedBy($vendor)->create()];
    }
}

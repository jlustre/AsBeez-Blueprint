<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Translation;
use App\Models\User;
use Database\Seeders\MemberStructureSeeder;
use Database\Seeders\StoreStructureSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTranslationApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(StoreStructureSeeder::class);
        $this->seed(MemberStructureSeeder::class);
        $this->admin = User::factory()->role(User::ROLE_SUPER_ADMIN)->create();
    }

    /* ---------------------------------------------------------------- */
    /* Access                                                            */
    /* ---------------------------------------------------------------- */

    public function test_it_requires_authentication(): void
    {
        $this->getJson('/api/v1/admin/translations')->assertUnauthorized();
    }

    public function test_only_administrators_may_translate(): void
    {
        foreach ([User::ROLE_VENDOR, User::ROLE_MEMBER] as $role) {
            $this->actingAs(User::factory()->role($role)->create())
                ->getJson('/api/v1/admin/translations')
                ->assertForbidden();
        }
    }

    /* ---------------------------------------------------------------- */
    /* Listing                                                           */
    /* ---------------------------------------------------------------- */

    public function test_it_lists_every_translatable_registry_with_progress(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/translations')->assertOk();

        $this->assertSame('en', $response->json('fallback'));
        $this->assertSame(['es'], $response->json('locales'));

        $slugs = collect($response->json('registries'))->pluck('slug');

        foreach (['categories', 'policy-types', 'nav-links', 'notification-topics'] as $expected) {
            $this->assertTrue($slugs->contains($expected), "{$expected} is not offered.");
        }

        // Nothing translated yet.
        $categories = collect($response->json('registries'))->firstWhere('slug', 'categories');
        $this->assertSame(0, $categories['progress']['es']['percent']);
    }

    public function test_progress_rises_as_rows_are_translated(): void
    {
        $this->actingAs($this->admin);

        foreach (Category::all() as $category) {
            $category->setTranslation('es', 'name', 'Traducido');
        }

        $categories = collect($this->getJson('/api/v1/admin/translations')->json('registries'))
            ->firstWhere('slug', 'categories');

        $this->assertSame(100, $categories['progress']['es']['percent']);
    }

    public function test_it_returns_source_text_beside_the_translation(): void
    {
        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/translations/categories?locale=es')
            ->assertOk();

        $row = collect($response->json('rows'))->firstWhere('identifier', 'food-beverage');

        $this->assertSame('Grocery and Specialty Food', $row['fields'][0]['source']);
        $this->assertSame('', $row['fields'][0]['value']);
    }

    public function test_fields_with_no_source_text_are_omitted(): void
    {
        // Most social platforms have no placeholder, so only fields that hold
        // text are offered — an empty optional field is not work to be done.
        $rows = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/translations/social-platforms?locale=es')
            ->assertOk()
            ->json('rows');

        foreach ($rows as $row) {
            $this->assertNotEmpty($row['fields']);

            foreach ($row['fields'] as $field) {
                $this->assertNotSame('', $field['source']);
            }
        }
    }

    public function test_an_unknown_registry_is_a_404(): void
    {
        // A model class from the client would reach anything in the app, so
        // registries are addressed by an allow-listed slug.
        $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/translations/users?locale=es')
            ->assertNotFound();
    }

    public function test_the_source_language_cannot_be_translated_into_itself(): void
    {
        $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/translations/categories?locale=en')
            ->assertStatus(422);
    }

    public function test_an_unsupported_locale_is_rejected(): void
    {
        $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/translations/categories?locale=zz')
            ->assertStatus(422);
    }

    /* ---------------------------------------------------------------- */
    /* Writing                                                           */
    /* ---------------------------------------------------------------- */

    public function test_it_saves_a_translation(): void
    {
        $category = Category::whereSlug('food-beverage')->firstOrFail();

        $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/translations/categories/{$category->id}", [
                'locale' => 'es',
                'values' => ['name' => 'Comida y bebida'],
            ])
            ->assertOk()
            ->assertJsonPath('row.values.name', 'Comida y bebida');

        $this->assertSame('Comida y bebida', $category->fresh()->tr('name', 'es'));
    }

    public function test_clearing_a_value_restores_the_fallback(): void
    {
        $category = Category::whereSlug('food-beverage')->firstOrFail();
        $category->setTranslation('es', 'name', 'Comida y bebida');

        $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/translations/categories/{$category->id}", [
                'locale' => 'es',
                'values' => ['name' => ''],
            ])
            ->assertOk();

        $this->assertSame('Grocery and Specialty Food', $category->fresh()->tr('name', 'es'));
        $this->assertSame(0, Translation::count());
    }

    public function test_it_refuses_a_field_that_is_not_translatable(): void
    {
        $category = Category::first();

        $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/translations/categories/{$category->id}", [
                'locale' => 'es',
                // slug is structural, not text a reader sees.
                'values' => ['slug' => 'comida'],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('values');

        $this->assertSame(0, Translation::count());
    }

    public function test_a_vendor_cannot_write_translations(): void
    {
        $category = Category::first();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->putJson("/api/v1/admin/translations/categories/{$category->id}", [
                'locale' => 'es',
                'values' => ['name' => 'Hijacked'],
            ])
            ->assertForbidden();

        $this->assertSame(0, Translation::count());
    }

    public function test_a_saved_translation_reaches_the_structure_endpoint(): void
    {
        $category = Category::whereSlug('electronics')->firstOrFail();

        $this->actingAs($this->admin)->putJson("/api/v1/admin/translations/categories/{$category->id}", [
            'locale' => 'es',
            'values' => ['name' => 'Electrónica'],
        ])->assertOk();

        // The whole point: editing here changes what every client renders.
        $structure = $this->actingAs($this->admin)->getJson('/api/v1/structure?lang=es')->json('categories');

        $this->assertSame('Electrónica', collect($structure)->firstWhere('slug', 'electronics')['name']);
    }
}

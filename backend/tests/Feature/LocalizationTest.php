<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\NavLink;
use App\Models\PolicyType;
use App\Models\Translation;
use App\Models\User;
use Database\Seeders\MemberStructureSeeder;
use Database\Seeders\ReferenceLocationSeeder;
use Database\Seeders\SpanishContentSeeder;
use Database\Seeders\StoreStructureSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocalizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(StoreStructureSeeder::class);
        $this->seed(MemberStructureSeeder::class);
        $this->seed(ReferenceLocationSeeder::class);
    }

    /* ---------------------------------------------------------------- */
    /* Locale negotiation                                                */
    /* ---------------------------------------------------------------- */

    public function test_it_advertises_the_supported_locales_without_a_token(): void
    {
        $response = $this->getJson('/api/v1/locales')->assertOk();

        $this->assertSame('en', $response->json('current'));
        $this->assertSame(['en', 'es'], collect($response->json('locales'))->pluck('code')->all());
        // Each language is named in itself, for a switcher a reader can use.
        $this->assertSame('Español', collect($response->json('locales'))->firstWhere('code', 'es')['native']);
    }

    public function test_it_honours_the_accept_language_header(): void
    {
        $this->withHeader('Accept-Language', 'es')
            ->getJson('/api/v1/locales')
            ->assertOk()
            ->assertJsonPath('current', 'es')
            ->assertHeader('Content-Language', 'es');
    }

    public function test_it_matches_a_base_language_and_respects_quality_weights(): void
    {
        // "es-MX" is unknown, but its base language is offered.
        $this->withHeader('Accept-Language', 'es-MX,es;q=0.9')
            ->getJson('/api/v1/locales')
            ->assertJsonPath('current', 'es');

        // German is not offered, so the lower-weighted entry decides.
        $this->withHeader('Accept-Language', 'de,es;q=0.8')
            ->getJson('/api/v1/locales')
            ->assertJsonPath('current', 'es');
    }

    public function test_an_explicit_query_parameter_beats_the_header(): void
    {
        $this->withHeader('Accept-Language', 'en')
            ->getJson('/api/v1/locales?lang=es')
            ->assertJsonPath('current', 'es');
    }

    public function test_an_unsupported_locale_falls_back_rather_than_being_trusted(): void
    {
        // The locale reaches translation file paths, so it must never be used
        // unvalidated.
        foreach (['xx', '../../etc/passwd', '', 'zz-ZZ'] as $attempt) {
            $this->getJson('/api/v1/locales?lang='.urlencode($attempt))
                ->assertOk()
                ->assertJsonPath('current', 'en');
        }
    }

    public function test_a_members_saved_language_decides_when_no_header_is_sent(): void
    {
        $member = User::factory()->role(User::ROLE_MEMBER)->create();
        $member->profileOrNew()->update(['language' => 'es']);

        $this->actingAs($member)
            ->getJson('/api/v1/locales')
            ->assertJsonPath('current', 'es');
    }

    public function test_responses_vary_by_language_for_caches(): void
    {
        $this->getJson('/api/v1/locales')->assertHeader('Vary', 'Accept-Language');
    }

    /* ---------------------------------------------------------------- */
    /* Framework messages                                                */
    /* ---------------------------------------------------------------- */

    public function test_validation_messages_follow_the_locale(): void
    {
        $english = $this->postJson('/api/v1/auth/login', ['email' => 'not-an-email'])
            ->assertStatus(422)
            ->json('errors.email.0');

        $spanish = $this->withHeader('Accept-Language', 'es')
            ->postJson('/api/v1/auth/login', ['email' => 'not-an-email'])
            ->assertStatus(422)
            ->json('errors.email.0');

        $this->assertNotSame($english, $spanish);
        $this->assertStringContainsString('correo', $spanish);
    }

    public function test_application_messages_follow_the_locale(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->withHeader('Accept-Language', 'es')
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Sesión cerrada correctamente.');
    }

    /* ---------------------------------------------------------------- */
    /* Outbound mail                                                     */
    /* ---------------------------------------------------------------- */

    public function test_a_member_declares_the_language_their_mail_should_use(): void
    {
        $member = User::factory()->create();

        // No preference saved yet, so the application default applies.
        $this->assertSame('en', $member->preferredLocale());

        $member->profileOrNew()->update(['language' => 'es']);
        $this->assertSame('es', $member->fresh()->preferredLocale());
    }

    public function test_an_unsupported_saved_language_does_not_reach_the_mailer(): void
    {
        $member = User::factory()->create();
        // The profile language select can offer more than the app can render.
        $member->profileOrNew()->update(['language' => 'fil']);

        $this->assertSame('en', $member->fresh()->preferredLocale());
    }

    /**
     * Sends for real against the array mailer rather than faking the
     * notification: `locale()` only takes effect while the channel renders the
     * message, so a test that calls toMail() directly proves nothing.
     */
    public function test_verification_mail_is_written_in_the_members_language(): void
    {
        $member = User::factory()->unverified()->create();
        $member->profileOrNew()->update(['language' => 'es']);

        $member->fresh()->sendEmailVerificationNotification();

        $this->assertStringContainsString('Verifique su direcci', $this->lastMailSubject());
    }

    public function test_reset_mail_is_written_in_the_members_language(): void
    {
        $member = User::factory()->create();
        $member->profileOrNew()->update(['language' => 'es']);

        $member->fresh()->sendPasswordResetNotification('token-123');

        $this->assertStringContainsString('Restablezca su contrase', $this->lastMailSubject());
    }

    public function test_mail_stays_in_english_for_a_member_with_no_preference(): void
    {
        $member = User::factory()->unverified()->create();

        $member->sendEmailVerificationNotification();

        $this->assertSame('Verify your email address', $this->lastMailSubject());
    }

    public function test_the_mail_body_is_translated_not_just_the_subject(): void
    {
        $member = User::factory()->unverified()->create();
        $member->profileOrNew()->update(['language' => 'es']);

        $member->fresh()->sendEmailVerificationNotification();

        $body = $this->lastMailBody();

        // Greeting and sign-off come from lang/es.json, the action button from
        // the same file, so all three prove the layout itself is localized.
        $this->assertStringContainsString('Hola', $body);
        $this->assertStringContainsString('Verificar direcci', $body);
        $this->assertStringContainsString('saludo', $body);
    }

    /** Subject of the message the array transport last collected. */
    private function lastMailSubject(): string
    {
        return $this->lastMail()->getSubject() ?? '';
    }

    private function lastMailBody(): string
    {
        return $this->lastMail()->getHtmlBody() ?? '';
    }

    private function lastMail(): \Symfony\Component\Mime\Email
    {
        $messages = app('mailer')->getSymfonyTransport()->messages();

        $this->assertNotEmpty($messages, 'No mail was sent.');

        return $messages[count($messages) - 1]->getOriginalMessage();
    }

    /* ---------------------------------------------------------------- */
    /* Translated content                                                */
    /* ---------------------------------------------------------------- */

    public function test_a_model_falls_back_to_its_own_value_without_a_translation(): void
    {
        $category = Category::whereSlug('electronics')->firstOrFail();

        $this->assertSame('Electronics and Computers', $category->tr('name', 'es'));
    }

    public function test_it_returns_the_translation_when_one_exists(): void
    {
        $this->seed(SpanishContentSeeder::class);
        $category = Category::whereSlug('food-beverage')->firstOrFail();

        $this->assertSame('Grocery and Specialty Food', $category->tr('name', 'en'));
        $this->assertSame('Alimentación y comida especializada', $category->tr('name', 'es'));
    }

    public function test_clearing_a_translation_restores_the_fallback(): void
    {
        $category = Category::whereSlug('electronics')->firstOrFail();
        $category->setTranslation('es', 'name', 'Electrónica');

        $this->assertSame('Electrónica', $category->tr('name', 'es'));

        // A blank value removes the row rather than storing an empty string,
        // so the label never renders as nothing.
        $category->setTranslation('es', 'name', '');

        $this->assertSame('Electronics and Computers', $category->tr('name', 'es'));
        $this->assertSame(0, Translation::where('field', 'name')->where('locale', 'es')->count());
    }

    public function test_an_untranslatable_field_is_refused(): void
    {
        $category = Category::first();

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);
        $category->setTranslation('es', 'slug', 'comida');
    }

    public function test_the_structure_endpoint_serves_translated_content(): void
    {
        $this->seed(SpanishContentSeeder::class);
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();

        $english = $this->actingAs($vendor)->getJson('/api/v1/structure')->json();
        $spanish = $this->actingAs($vendor)->getJson('/api/v1/structure?lang=es')->json();

        $this->assertSame('en', $english['locale']);
        $this->assertSame('es', $spanish['locale']);

        $this->assertSame('Grocery and Specialty Food', collect($english['categories'])->firstWhere('slug', 'food-beverage')['name']);
        $this->assertSame('Alimentación y comida especializada', collect($spanish['categories'])->firstWhere('slug', 'food-beverage')['name']);

        $this->assertSame('Shipping policy', collect($english['policy_types'])->firstWhere('key', 'shipping')['label']);
        $this->assertSame('Política de envío', collect($spanish['policy_types'])->firstWhere('key', 'shipping')['label']);
    }

    public function test_country_names_come_from_icu_in_the_active_locale(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();

        $english = collect($this->actingAs($vendor)->getJson('/api/v1/structure')->json('countries'));
        $spanish = collect($this->actingAs($vendor)->getJson('/api/v1/structure?lang=es')->json('countries'));

        // 249 countries translated with no stored translation rows at all.
        $this->assertSame('United States', $english->firstWhere('code', 'US')['name']);
        $this->assertSame('Estados Unidos', $spanish->firstWhere('code', 'US')['name']);
        $this->assertSame('Philippines', $english->firstWhere('code', 'PH')['name']);
        $this->assertSame('Filipinas', $spanish->firstWhere('code', 'PH')['name']);
    }

    public function test_navigation_groups_are_translated(): void
    {
        $this->seed(SpanishContentSeeder::class);
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();

        $groups = collect($this->actingAs($vendor)->getJson('/api/v1/structure?lang=es')->json('nav_links.vendor'))
            ->pluck('group')
            ->unique();

        $this->assertTrue($groups->contains('Catálogo'));
        $this->assertFalse($groups->contains('Catalog'));
    }

    public function test_every_translatable_registry_has_spanish_coverage(): void
    {
        $this->seed(SpanishContentSeeder::class);

        foreach ([Category::class, PolicyType::class, NavLink::class] as $model) {
            $translated = Translation::where('translatable_type', $model)->where('locale', 'es')->count();

            $this->assertGreaterThan(0, $translated, "{$model} has no Spanish translations.");
        }
    }

    public function test_reseeding_translations_does_not_duplicate(): void
    {
        $this->seed(SpanishContentSeeder::class);
        $before = Translation::count();

        $this->seed(SpanishContentSeeder::class);

        $this->assertSame($before, Translation::count());
    }
}

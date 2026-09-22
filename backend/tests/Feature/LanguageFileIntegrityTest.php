<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Guards the message files themselves.
 *
 * A missing key is not a runtime error — it silently falls back to English —
 * which makes drift between locales easy to ship without noticing.
 */
class LanguageFileIntegrityTest extends TestCase
{
    public function test_every_supported_locale_has_the_same_app_keys_as_english(): void
    {
        $english = $this->flatten(require lang_path('en/app.php'));

        foreach (array_keys(config('locales.supported')) as $locale) {
            $path = lang_path("{$locale}/app.php");

            $this->assertFileExists($path, "Locale {$locale} has no app.php.");

            $missing = array_diff($english, $this->flatten(require $path));
            $extra = array_diff($this->flatten(require $path), $english);

            $this->assertSame([], array_values($missing), "Locale {$locale} is missing: ".implode(', ', $missing));
            $this->assertSame([], array_values($extra), "Locale {$locale} has stale keys: ".implode(', ', $extra));
        }
    }

    public function test_every_supported_locale_ships_laravels_own_files(): void
    {
        foreach (array_keys(config('locales.supported')) as $locale) {
            foreach (['validation', 'auth', 'passwords', 'pagination'] as $file) {
                $this->assertFileExists(lang_path("{$locale}/{$file}.php"), "{$locale}/{$file}.php is missing.");
            }
        }
    }

    public function test_no_message_is_left_untranslated_by_accident(): void
    {
        $english = require lang_path('en/app.php');
        $spanish = require lang_path('es/app.php');

        $identical = [];

        foreach ($this->flatten($english) as $key) {
            $en = data_get($english, $key);
            $es = data_get($spanish, $key);

            // A handful of strings legitimately match across languages; none
            // do here, so any match means a forgotten translation.
            if (is_string($en) && $en === $es) {
                $identical[] = $key;
            }
        }

        $this->assertSame([], $identical, 'Untranslated Spanish strings: '.implode(', ', $identical));
    }

    /**
     * The React bundle ships its own flat JSON message files; nothing in the
     * frontend build fails on a missing key either, so they are guarded here
     * alongside the PHP ones rather than left to a reviewer's eye.
     */
    public function test_the_frontend_message_bundles_match_english(): void
    {
        $directory = base_path('../frontend/src/i18n/messages');

        if (! is_dir($directory)) {
            $this->markTestSkipped('Frontend is not present in this checkout.');
        }

        $english = $this->readJson("{$directory}/en.json");

        // Strings that are legitimately the same in both languages: words
        // spelled alike, and templates that are nothing but placeholders.
        // Listing them keeps the "nothing was forgotten" check meaningful.
        $sameInBoth = [
            'admin.badge', 'admin.roleAdmin', 'member.colTotal',
            'profile.visible', 'vendor.marketing',
            'admin.fieldTarget', 'profile.radiusKm',
            // The market's nav label; the word is spelled alike in Spanish.
            'nav.digital',
        ];

        foreach (array_keys(config('locales.supported')) as $locale) {
            if ($locale === config('app.fallback_locale')) {
                continue;
            }

            $path = "{$directory}/{$locale}.json";
            $this->assertFileExists($path, "Frontend locale {$locale} has no bundle.");

            $translated = $this->readJson($path);

            $this->assertSame([], array_values(array_diff(array_keys($english), array_keys($translated))),
                "Frontend locale {$locale} is missing keys.");
            $this->assertSame([], array_values(array_diff(array_keys($translated), array_keys($english))),
                "Frontend locale {$locale} has stale keys.");

            $untranslated = array_values(array_diff(
                array_keys(array_intersect_assoc($english, $translated)),
                $sameInBoth,
            ));

            $this->assertSame([], $untranslated,
                "Untranslated {$locale} strings: ".implode(', ', $untranslated));
        }
    }

    /**
     * @return array<string, string>
     */
    private function readJson(string $path): array
    {
        return json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * @return list<string>
     */
    private function flatten(array $messages, string $prefix = ''): array
    {
        $keys = [];

        foreach ($messages as $key => $value) {
            $full = $prefix === '' ? (string) $key : "{$prefix}.{$key}";
            $keys = [...$keys, ...(is_array($value) ? $this->flatten($value, $full) : [$full])];
        }

        return $keys;
    }
}

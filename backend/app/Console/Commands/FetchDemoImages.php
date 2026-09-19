<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

/**
 * Downloads the demo storefront photography named in the seeder manifest.
 *
 * Deliberately a one-off command rather than part of seeding: seeding must work
 * offline and in CI, so DemoStoreSeeder falls back to generated artwork when
 * these files are absent. Run this once and commit the results if you want the
 * richer demo.
 */
class FetchDemoImages extends Command
{
    protected $signature = 'demo:fetch-images {--force : Re-download files that already exist}';

    protected $description = 'Download demo storefront images listed in database/seeders/assets/manifest.json';

    public function handle(): int
    {
        $directory = database_path('seeders/assets');
        $manifestPath = $directory.'/manifest.json';

        if (! is_file($manifestPath)) {
            $this->error("No manifest at {$manifestPath}.");

            return self::FAILURE;
        }

        $manifest = json_decode((string) file_get_contents($manifestPath), true);
        $images = $manifest['images'] ?? [];

        if ($images === []) {
            $this->warn('The manifest lists no images.');

            return self::SUCCESS;
        }

        $rows = [];

        foreach ($images as $image) {
            $target = $directory.'/'.$image['file'];

            if (is_file($target) && ! $this->option('force')) {
                $rows[] = [$image['file'], 'skipped', $this->readableSize(filesize($target))];

                continue;
            }

            // Ask Unsplash for the exact crop, so nothing needs resizing locally.
            $url = sprintf(
                'https://images.unsplash.com/%s?w=%d&h=%d&fit=crop&q=80&fm=jpg',
                $image['photo_id'],
                $image['width'],
                $image['height'],
            );

            try {
                $response = Http::timeout(30)->get($url);
            } catch (\Throwable $e) {
                $rows[] = [$image['file'], 'failed', $e->getMessage()];

                continue;
            }

            if (! $response->successful()) {
                $rows[] = [$image['file'], 'failed', 'HTTP '.$response->status()];

                continue;
            }

            $bytes = $response->body();
            $size = @getimagesizefromstring($bytes);

            // Guard against a redirect or error page being saved as a .jpg.
            if ($size === false) {
                $rows[] = [$image['file'], 'failed', 'response was not an image'];

                continue;
            }

            file_put_contents($target, $bytes);
            $rows[] = [$image['file'], "saved {$size[0]}×{$size[1]}", $this->readableSize(strlen($bytes))];
        }

        $this->table(['File', 'Result', 'Size'], $rows);

        $failed = count(array_filter($rows, fn (array $r) => $r[1] === 'failed'));

        if ($failed > 0) {
            $this->warn("{$failed} image(s) could not be fetched — the seeder will draw placeholders for those.");
        }

        return self::SUCCESS;
    }

    private function readableSize(int $bytes): string
    {
        return $bytes >= 1048576
            ? sprintf('%.1f MB', $bytes / 1048576)
            : sprintf('%.0f KB', $bytes / 1024);
    }
}

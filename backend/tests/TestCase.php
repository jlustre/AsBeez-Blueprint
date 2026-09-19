<?php

namespace Tests;

use App\Models\Store;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Storage;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // No test should write to the real media disk. DemoStoreSeeder draws
        // actual PNGs, so without this a plain `artisan test` would litter
        // storage/app/public/store-media with seeded artwork.
        Storage::fake(Store::MEDIA_DISK);
    }
}

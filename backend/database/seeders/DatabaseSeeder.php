<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            // Reference geography the address fields select from.
            ReferenceLocationSeeder::class,
            // Admin-curated option lists. Must run before any store content,
            // which references these rows.
            StoreStructureSeeder::class,
            MemberStructureSeeder::class,
            DemoStoreSeeder::class,
            DemoProductSeeder::class,
            DemoHomepageSeeder::class,
            DemoMemberSeeder::class,
            PpfSeeder::class,
            // Locale overrides for the admin-curated registries.
            SpanishContentSeeder::class,
        ]);
    }
}

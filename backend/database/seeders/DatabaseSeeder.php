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
            // Admin-curated option lists. Must run before any store content,
            // which references these rows.
            StoreStructureSeeder::class,
            DemoStoreSeeder::class,
        ]);
    }
}

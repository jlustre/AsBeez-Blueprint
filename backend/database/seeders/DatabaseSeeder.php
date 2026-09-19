<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'AsBeez Super Admin',
                'email' => 'admin@asbeez.test',
                'role' => User::ROLE_SUPER_ADMIN,
            ],
            [
                'name' => 'Golden Hive Market',
                'email' => 'vendor@asbeez.test',
                'role' => User::ROLE_VENDOR,
            ],
            [
                'name' => 'AsBeez Member',
                'email' => 'member@asbeez.test',
                'role' => User::ROLE_MEMBER,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'role' => $user['role'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}

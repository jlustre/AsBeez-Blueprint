<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * One ready-to-use account per role, so every dashboard can be opened
     * straight after a fresh migrate.
     *
     * The shared password satisfies the app's own policy (Password::defaults(),
     * min 12) — a shorter fixture would be rejected the moment anyone tried to
     * change it through the UI.
     */
    public const PASSWORD = 'asbeez-password';

    /**
     * @var list<array{name: string, email: string, role: string}>
     */
    public const ACCOUNTS = [
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

    public function run(): void
    {
        foreach (self::ACCOUNTS as $account) {
            // Keyed on email so re-seeding refreshes these accounts instead of
            // failing on the unique index or duplicating them.
            User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'role' => $account['role'],
                    // The model's "hashed" cast hashes this on the way in.
                    'password' => self::PASSWORD,
                    'email_verified_at' => now(),
                ],
            );
        }

        $this->command?->table(
            ['Role', 'Email', 'Password'],
            array_map(
                fn (array $account) => [$account['role'], $account['email'], self::PASSWORD],
                self::ACCOUNTS,
            ),
        );
    }
}

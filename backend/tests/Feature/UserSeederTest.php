<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_one_verified_account_per_role(): void
    {
        $this->seed(UserSeeder::class);

        $expected = [
            'admin@asbeez.test' => User::ROLE_SUPER_ADMIN,
            'vendor@asbeez.test' => User::ROLE_VENDOR,
            'member@asbeez.test' => User::ROLE_MEMBER,
        ];

        $this->assertSame(count($expected), User::count());

        foreach ($expected as $email => $role) {
            $user = User::whereEmail($email)->first();

            $this->assertNotNull($user, "Expected a seeded account for {$email}.");
            $this->assertSame($role, $user->role);
            $this->assertNotNull($user->email_verified_at);
            $this->assertTrue(Hash::check(UserSeeder::PASSWORD, $user->password));
        }
    }

    public function test_seeded_accounts_can_sign_in_and_reach_their_own_dashboard_role(): void
    {
        $this->seed(UserSeeder::class);

        foreach (UserSeeder::ACCOUNTS as $account) {
            $this->postJson('/api/v1/auth/login', [
                'email' => $account['email'],
                'password' => UserSeeder::PASSWORD,
            ])
                ->assertOk()
                ->assertJsonPath('user.role', $account['role']);
        }
    }

    public function test_seeding_twice_refreshes_rather_than_duplicates(): void
    {
        $this->seed(UserSeeder::class);

        User::whereEmail('member@asbeez.test')->update(['name' => 'Renamed By Hand']);

        $this->seed(UserSeeder::class);

        $this->assertSame(count(UserSeeder::ACCOUNTS), User::count());
        $this->assertSame('AsBeez Member', User::whereEmail('member@asbeez.test')->value('name'));
    }

    public function test_seeded_password_satisfies_the_apps_own_policy(): void
    {
        // A fixture password the app would reject on reset is a trap, so hold the
        // seeder to the same rule registration and reset use.
        $this->seed(UserSeeder::class);

        $user = User::whereEmail('member@asbeez.test')->firstOrFail();
        $token = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => UserSeeder::PASSWORD,
        ])->json('token');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson('/api/v1/auth/password', [
                'current_password' => UserSeeder::PASSWORD,
                'password' => UserSeeder::PASSWORD.'-rotated',
                'password_confirmation' => UserSeeder::PASSWORD.'-rotated',
            ])->assertOk();
    }
}

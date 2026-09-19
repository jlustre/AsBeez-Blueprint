<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_login_view_profile_and_logout(): void
    {
        $registration = $this->postJson('/api/v1/auth/register', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'password' => 'correct-horse-battery',
            'password_confirmation' => 'correct-horse-battery',
        ]);

        $registration->assertCreated()
            ->assertJsonPath('user.email', 'ada@example.com')
            ->assertJsonStructure(['user', 'token']);

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => 'ada@example.com',
            'password' => 'correct-horse-battery',
        ]);

        $login->assertOk()->assertJsonStructure(['user', 'token']);
        $token = $login->json('token');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'ada@example.com');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJson(['message' => 'Logged out successfully.']);

        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->assertDatabaseHas('users', ['email' => 'ada@example.com']);
    }
}

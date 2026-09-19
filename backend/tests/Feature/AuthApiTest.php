<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    private const PASSWORD = 'correct-horse-battery';

    public function test_user_can_register_login_view_profile_and_logout(): void
    {
        $registration = $this->postJson('/api/v1/auth/register', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
        ]);

        $registration->assertCreated()
            ->assertJsonPath('user.email', 'ada@example.com')
            ->assertJsonPath('user.role', User::ROLE_MEMBER)
            ->assertJsonPath('user.email_verified_at', null)
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'role', 'email_verified_at'], 'token']);

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => 'ada@example.com',
            'password' => self::PASSWORD,
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

        $this->assertDatabaseHas('users', ['email' => 'ada@example.com']);
    }

    public function test_register_never_leaks_the_password_hash(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
        ])->assertCreated()->assertJsonMissingPath('user.password');
    }

    public function test_visitor_may_register_as_a_vendor_but_not_as_an_admin(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Vendor',
            'email' => 'vendor@example.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
            'role' => User::ROLE_VENDOR,
        ])->assertCreated()->assertJsonPath('user.role', User::ROLE_VENDOR);

        $this->postJson('/api/v1/auth/register', [
            'name' => 'Sneaky',
            'email' => 'sneaky@example.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
            'role' => User::ROLE_SUPER_ADMIN,
        ])->assertStatus(422)->assertJsonValidationErrors('role');

        $this->assertDatabaseMissing('users', ['email' => 'sneaky@example.com']);
    }

    public function test_register_rejects_a_short_password(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Ada',
            'email' => 'ada@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ])->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_login_rejects_bad_credentials(): void
    {
        User::factory()->create(['email' => 'ada@example.com', 'password' => self::PASSWORD]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'ada@example.com',
            'password' => 'not-the-password',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_me_requires_a_token(): void
    {
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_logout_revokes_only_the_calling_token(): void
    {
        $user = User::factory()->create();
        $phone = $user->createToken('phone')->plainTextToken;
        $laptop = $user->createToken('laptop')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$phone}")
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->forgetResolvedUser();
        $this->withHeader('Authorization', "Bearer {$phone}")->getJson('/api/v1/auth/me')->assertUnauthorized();

        $this->forgetResolvedUser();
        $this->withHeader('Authorization', "Bearer {$laptop}")->getJson('/api/v1/auth/me')->assertOk();
    }

    public function test_logout_all_revokes_every_token(): void
    {
        $user = User::factory()->create();
        $phone = $user->createToken('phone')->plainTextToken;
        $laptop = $user->createToken('laptop')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$phone}")
            ->postJson('/api/v1/auth/logout-all')
            ->assertOk();

        $this->forgetResolvedUser();
        $this->withHeader('Authorization', "Bearer {$phone}")->getJson('/api/v1/auth/me')->assertUnauthorized();

        $this->forgetResolvedUser();
        $this->withHeader('Authorization', "Bearer {$laptop}")->getJson('/api/v1/auth/me')->assertUnauthorized();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_registration_sends_a_verification_mail(): void
    {
        Notification::fake();

        $this->postJson('/api/v1/auth/register', [
            'name' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
        ])->assertCreated();

        Notification::assertSentTo(User::whereEmail('ada@example.com')->firstOrFail(), VerifyEmail::class);
    }

    public function test_signed_link_verifies_the_email_address(): void
    {
        $user = User::factory()->unverified()->create();

        $this->get($this->verificationUrl($user))->assertRedirectContains('status=verified');

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_verification_link_rejects_a_tampered_signature(): void
    {
        $user = User::factory()->unverified()->create();

        $this->get($this->verificationUrl($user).'&tampered=1')->assertForbidden();

        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_verification_link_rejects_a_hash_from_another_address(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute('verification.verify', now()->addHour(), [
            'id' => $user->getKey(),
            'hash' => sha1('someone-else@example.com'),
        ]);

        $this->get($url)->assertRedirectContains('status=failed');

        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_user_can_request_another_verification_mail(): void
    {
        Notification::fake();
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/auth/email/verification-notification')
            ->assertOk();

        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_verification_status_reports_a_usable_link(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->getJson('/api/v1/auth/email/status')->assertOk();

        $this->assertFalse($response->json('verified'));
        $this->get($response->json('verification_url'))->assertRedirectContains('status=verified');
    }

    public function test_forgot_password_mails_a_reset_link(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])->assertOk();

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_forgot_password_does_not_reveal_whether_the_account_exists(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $known = $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])->assertOk();
        $unknown = $this->postJson('/api/v1/auth/forgot-password', ['email' => 'nobody@example.com'])->assertOk();

        $this->assertSame($known->json('message'), $unknown->json('message'));
        Notification::assertCount(1);
    }

    public function test_user_can_reset_their_password_with_a_mailed_token(): void
    {
        Notification::fake();
        $user = User::factory()->create();
        $user->createToken('stale-session');

        $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])->assertOk();

        $this->postJson('/api/v1/auth/reset-password', [
            'token' => $this->capturedResetToken($user),
            'email' => $user->email,
            'password' => 'brand-new-passphrase',
            'password_confirmation' => 'brand-new-passphrase',
        ])->assertOk();

        $this->assertTrue(Hash::check('brand-new-passphrase', $user->fresh()->password));

        // A reset is the recovery path from a compromise, so it cuts every session.
        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'brand-new-passphrase',
        ])->assertOk();
    }

    public function test_reset_rejects_an_invalid_token(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/v1/auth/reset-password', [
            'token' => 'not-a-real-token',
            'email' => $user->email,
            'password' => 'brand-new-passphrase',
            'password_confirmation' => 'brand-new-passphrase',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_reset_link_points_at_the_spa(): void
    {
        Notification::fake();
        config(['app.frontend_url' => 'http://localhost:5173']);
        $user = User::factory()->create();

        $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])->assertOk();

        Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user) {
            $url = $notification->toMail($user)->actionUrl;

            return str_starts_with($url, 'http://localhost:5173/?')
                && str_contains($url, 'token='.$notification->token)
                && str_ends_with($url, '#reset-password');
        });
    }

    public function test_signed_in_user_can_change_their_password(): void
    {
        $user = User::factory()->create(['password' => self::PASSWORD]);
        $current = $user->createToken('current')->plainTextToken;
        $other = $user->createToken('other')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$current}")
            ->putJson('/api/v1/auth/password', [
                'current_password' => self::PASSWORD,
                'password' => 'brand-new-passphrase',
                'password_confirmation' => 'brand-new-passphrase',
            ])->assertOk();

        $this->assertTrue(Hash::check('brand-new-passphrase', $user->fresh()->password));

        // The caller stays signed in; every other device is cut off.
        $this->forgetResolvedUser();
        $this->withHeader('Authorization', "Bearer {$current}")->getJson('/api/v1/auth/me')->assertOk();

        $this->forgetResolvedUser();
        $this->withHeader('Authorization', "Bearer {$other}")->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_change_password_rejects_a_wrong_current_password(): void
    {
        $user = User::factory()->create(['password' => self::PASSWORD]);

        $this->actingAs($user)
            ->putJson('/api/v1/auth/password', [
                'current_password' => 'not-the-password',
                'password' => 'brand-new-passphrase',
                'password_confirmation' => 'brand-new-passphrase',
            ])->assertStatus(422)->assertJsonValidationErrors('current_password');

        $this->assertTrue(Hash::check(self::PASSWORD, $user->fresh()->password));
    }

    public function test_login_is_rate_limited(): void
    {
        foreach (range(1, 10) as $ignored) {
            $this->postJson('/api/v1/auth/login', ['email' => 'ada@example.com', 'password' => 'wrong'])
                ->assertStatus(422);
        }

        $this->postJson('/api/v1/auth/login', ['email' => 'ada@example.com', 'password' => 'wrong'])
            ->assertStatus(429);
    }

    /**
     * The test client keeps one application instance alive for the whole test, so
     * the sanctum guard caches the user it resolved on the previous request. Drop
     * the resolved guards to make the next request authenticate from scratch.
     */
    private function forgetResolvedUser(): void
    {
        $this->app['auth']->forgetGuards();
    }

    private function verificationUrl(User $user): string
    {
        return URL::temporarySignedRoute('verification.verify', now()->addHour(), [
            'id' => $user->getKey(),
            'hash' => sha1($user->getEmailForVerification()),
        ]);
    }

    private function capturedResetToken(User $user): string
    {
        $token = null;

        Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use (&$token) {
            $token = $notification->token;

            return true;
        });

        return $token;
    }
}

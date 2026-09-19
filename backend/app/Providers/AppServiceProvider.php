<?php

namespace App\Providers;

use App\Models\Store;
use App\Models\User;
use App\Policies\StoreAccessPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Avoid "Specified key was too long" errors on utf8mb4 indexes (MySQL/MariaDB 1000/767 byte key limit).
        Schema::defaultStringLength(191);

        // Registered explicitly: name-based discovery would look for
        // App\Policies\StorePolicy, which collides with the StorePolicy model.
        Gate::policy(Store::class, StoreAccessPolicy::class);

        $this->configureRateLimiting();
        $this->configureNotificationUrls();

        // One definition of "strong enough", shared by registration, reset and change.
        Password::defaults(fn () => Password::min(12));
    }

    private function configureRateLimiting(): void
    {
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        // Mail-sending endpoints are cheap to call and expensive to serve, so they
        // are limited per recipient as well as per caller.
        RateLimiter::for('auth-mail', function (Request $request) {
            return [
                Limit::perMinute(3)->by($request->ip()),
                Limit::perMinute(3)->by((string) ($request->user()?->getAuthIdentifier() ?? $request->input('email'))),
            ];
        });
    }

    /**
     * Password resets happen in the SPA, not in a Blade view, so the mailed link
     * has to point at the frontend with the token in the query string. The route
     * key stays in the hash to match the SPA's hash router.
     */
    private function configureNotificationUrls(): void
    {
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            $query = http_build_query([
                'token' => $token,
                'email' => $user->getEmailForPasswordReset(),
            ]);

            return rtrim(config('app.frontend_url'), '/').'/?'.$query.'#reset-password';
        });
    }
}

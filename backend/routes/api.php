<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EmailVerificationController;
use App\Http\Controllers\Api\V1\PasswordController;
use App\Http\Controllers\Api\V1\PublicStoreController;
use App\Http\Controllers\Api\V1\StructureController;
use App\Http\Controllers\Api\V1\Vendor\StoreContentController;
use App\Http\Controllers\Api\V1\Vendor\StoreController;
use App\Http\Controllers\Api\V1\Vendor\StoreMediaController;
use App\Http\Controllers\Api\V1\Vendor\StorePolicyController;
use App\Http\Controllers\Api\V1\Vendor\StoreVerificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {

    /* ---------------------------------------------------------------- */
    /* Authentication                                                    */
    /* ---------------------------------------------------------------- */

    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:auth');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:auth');

    Route::post('/auth/forgot-password', [PasswordController::class, 'forgot'])->middleware('throttle:auth-mail');
    Route::post('/auth/reset-password', [PasswordController::class, 'reset'])->middleware('throttle:auth');

    // Opened from the mailed link, so it carries a signature instead of a token.
    Route::get('/auth/verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware(['signed', 'throttle:auth'])
        ->name('verification.verify');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);
        Route::put('/auth/password', [PasswordController::class, 'update']);

        Route::get('/auth/email/status', [EmailVerificationController::class, 'status']);
        Route::post('/auth/email/verification-notification', [EmailVerificationController::class, 'resend'])
            ->middleware('throttle:auth-mail');
    });

    /* ---------------------------------------------------------------- */
    /* Public storefront                                                 */
    /* ---------------------------------------------------------------- */

    // Bound by slug (Store::getRouteKeyName), so this is a shareable URL.
    Route::get('/stores/{store}', [PublicStoreController::class, 'show']);

    /* ---------------------------------------------------------------- */
    /* Admin-curated structure (read side)                               */
    /* ---------------------------------------------------------------- */

    Route::get('/structure', [StructureController::class, 'index'])->middleware('auth:sanctum');

    /* ---------------------------------------------------------------- */
    /* Vendor workspace                                                  */
    /* ---------------------------------------------------------------- */

    Route::middleware(['auth:sanctum', 'role:vendor'])->prefix('vendor')->group(function (): void {
        Route::get('/stores', [StoreController::class, 'index']);
        Route::post('/stores', [StoreController::class, 'store']);

        // Bound by id, not slug: renaming a store must not break the page the
        // vendor is currently editing it on.
        Route::prefix('stores/{store:id}')->group(function (): void {
            Route::get('/', [StoreController::class, 'show']);
            Route::put('/', [StoreController::class, 'update']);
            Route::delete('/', [StoreController::class, 'destroy']);
            Route::get('/completeness', [StoreController::class, 'completeness']);

            Route::put('/hours', [StoreContentController::class, 'hours']);
            Route::put('/socials', [StoreContentController::class, 'socials']);
            Route::put('/categories', [StoreContentController::class, 'categories']);
            Route::put('/settings', [StoreContentController::class, 'settings']);

            Route::post('/media/{kind}', [StoreMediaController::class, 'upload']);
            Route::delete('/media/{kind}', [StoreMediaController::class, 'destroy']);

            Route::get('/policies', [StorePolicyController::class, 'index']);
            Route::put('/policies', [StorePolicyController::class, 'upsert']);
            Route::delete('/policies/{policy}', [StorePolicyController::class, 'destroy']);

            Route::get('/verifications', [StoreVerificationController::class, 'index']);
            Route::post('/verifications', [StoreVerificationController::class, 'request']);
        });
    });
});

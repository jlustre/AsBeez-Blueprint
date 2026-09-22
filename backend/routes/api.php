<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EmailVerificationController;
use App\Http\Controllers\Api\V1\Admin\MemberController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\CommissionController;
use App\Http\Controllers\Api\V1\Admin\ContentController;
use App\Http\Controllers\Api\V1\Admin\DisputeController;
use App\Http\Controllers\Api\V1\Admin\FinancialController;
use App\Http\Controllers\Api\V1\Admin\OrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\ServiceController;
use App\Http\Controllers\Api\V1\Admin\TranslationController;
use App\Http\Controllers\Api\V1\Admin\VendorController;
use App\Http\Controllers\Api\V1\LocaleController;
use App\Http\Controllers\Api\V1\PartnerApplicationController;
use App\Http\Controllers\Api\V1\PasswordController;
use App\Http\Controllers\Api\V1\Member\AddressController;
use App\Http\Controllers\Api\V1\Member\ProfileController as MemberProfileController;
use App\Http\Controllers\Api\V1\PublicMemberController;
use App\Http\Controllers\Api\V1\CategoryNavigationController;
use App\Http\Controllers\Api\V1\Admin\PpfController as AdminPpfController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\PpfController;
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

    Route::get('/home', [HomeController::class, 'index']);
    Route::get('/ppf', [PpfController::class, 'show']);
    Route::get('/categories', [CategoryNavigationController::class, 'index']);

    // Bound by slug (Store::getRouteKeyName), so this is a shareable URL.
    Route::get('/stores/{store}', [PublicStoreController::class, 'show']);
    Route::get('/members/{username}', [PublicMemberController::class, 'show']);

    // Public: the sign-in screens need a language switcher before there is an
    // account to hang a preference on.
    Route::get('/locales', [LocaleController::class, 'index']);

    /* ---------------------------------------------------------------- */
    /* Admin-curated structure (read side)                               */
    /* ---------------------------------------------------------------- */

    Route::get('/structure', [StructureController::class, 'index'])->middleware('auth:sanctum');

    /* ---------------------------------------------------------------- */
    /* Administration                                                    */
    /* ---------------------------------------------------------------- */

    Route::middleware(['auth:sanctum', 'role:super-admin'])->prefix('admin')->group(function (): void {
        Route::get('/content', [ContentController::class, 'index']);
        Route::get('/content/{type}/{id}', [ContentController::class, 'show']);
        Route::put('/content/{type}/{id}', [ContentController::class, 'update']);

        Route::get('/translations', [TranslationController::class, 'registries']);
        Route::get('/translations/{registry}', [TranslationController::class, 'index']);
        Route::put('/translations/{registry}/{id}', [TranslationController::class, 'update']);

        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/categories/{category}', [CategoryController::class, 'show']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);

        Route::get('/members', [MemberController::class, 'index']);
        Route::get('/members/events', [MemberController::class, 'events']);
        Route::get('/members/{member}', [MemberController::class, 'show']);
        Route::put('/members/{member}/status', [MemberController::class, 'updateStatus']);
        Route::post('/members/{member}/notes', [MemberController::class, 'storeNote']);

        Route::get('/vendors', [VendorController::class, 'index']);
        Route::get('/vendors/events', [VendorController::class, 'events']);
        Route::get('/vendors/{vendor}', [VendorController::class, 'show']);
        Route::put('/vendors/{vendor}/status', [VendorController::class, 'updateStatus']);
        Route::post('/vendors/{vendor}/notes', [VendorController::class, 'storeNote']);
        Route::put('/vendors/{vendor}/stores/{store:id}/status', [VendorController::class, 'updateStoreStatus']);

        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/events', [ProductController::class, 'events']);
        Route::get('/products/{product}', [ProductController::class, 'show']);
        Route::put('/products/{product}/status', [ProductController::class, 'updateStatus']);
        Route::post('/products/{product}/notes', [ProductController::class, 'storeNote']);

        Route::get('/services', [ServiceController::class, 'index']);
        Route::get('/services/events', [ServiceController::class, 'events']);
        Route::get('/services/{product}', [ServiceController::class, 'show']);
        Route::put('/services/{product}/status', [ServiceController::class, 'updateStatus']);
        Route::post('/services/{product}/notes', [ServiceController::class, 'storeNote']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/events', [OrderController::class, 'events']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::post('/orders/{order}/notes', [OrderController::class, 'storeNote']);

        Route::get('/disputes', [DisputeController::class, 'index']);
        Route::get('/disputes/events', [DisputeController::class, 'events']);
        Route::get('/disputes/{dispute}', [DisputeController::class, 'show']);
        Route::put('/disputes/{dispute}/status', [DisputeController::class, 'updateStatus']);
        Route::post('/disputes/{dispute}/notes', [DisputeController::class, 'storeNote']);

        Route::get('/financials', [FinancialController::class, 'index']);
        Route::get('/financials/events', [FinancialController::class, 'events']);
        Route::get('/financials/{entry}', [FinancialController::class, 'show']);
        Route::put('/financials/{entry}/status', [FinancialController::class, 'updateStatus']);
        Route::post('/financials/{entry}/notes', [FinancialController::class, 'storeNote']);

        Route::get('/ppf', [AdminPpfController::class, 'index']);
        Route::put('/ppf/settings', [AdminPpfController::class, 'updateSettings']);
        Route::post('/ppf/tiers', [AdminPpfController::class, 'storeTier']);
        Route::put('/ppf/tiers/{tier}', [AdminPpfController::class, 'updateTier']);
        Route::delete('/ppf/tiers/{tier}', [AdminPpfController::class, 'destroyTier']);
        Route::post('/ppf/markets', [AdminPpfController::class, 'storeMarket']);
        Route::put('/ppf/markets/{market}', [AdminPpfController::class, 'updateMarket']);
        Route::delete('/ppf/markets/{market}', [AdminPpfController::class, 'destroyMarket']);
        Route::post('/ppf/plans', [AdminPpfController::class, 'storePlan']);
        Route::put('/ppf/plans/{plan}', [AdminPpfController::class, 'updatePlan']);
        Route::delete('/ppf/plans/{plan}', [AdminPpfController::class, 'destroyPlan']);
        Route::post('/ppf/faqs', [AdminPpfController::class, 'storeFaq']);
        Route::put('/ppf/faqs/{faq}', [AdminPpfController::class, 'updateFaq']);
        Route::delete('/ppf/faqs/{faq}', [AdminPpfController::class, 'destroyFaq']);

        Route::get('/commissions', [CommissionController::class, 'index']);
        Route::post('/commissions', [CommissionController::class, 'store']);
        Route::get('/commissions/events', [CommissionController::class, 'events']);
        Route::put('/commissions/settings', [CommissionController::class, 'updateSettings']);
        Route::get('/commissions/{rule}', [CommissionController::class, 'show']);
        Route::put('/commissions/{rule}', [CommissionController::class, 'update']);
        Route::put('/commissions/{rule}/status', [CommissionController::class, 'updateStatus']);
        Route::post('/commissions/{rule}/notes', [CommissionController::class, 'storeNote']);
    });

    /* ---------------------------------------------------------------- */
    /* Partner application (Sell on AsBeez)                              */
    /* ---------------------------------------------------------------- */

    Route::middleware('auth:sanctum')->prefix('partner-application')->group(function (): void {
        Route::get('/', [PartnerApplicationController::class, 'show']);
        Route::put('/', [PartnerApplicationController::class, 'update']);
        Route::post('/submit', [PartnerApplicationController::class, 'submit']);
        Route::post('/files', [PartnerApplicationController::class, 'upload']);
        Route::delete('/files/{file}', [PartnerApplicationController::class, 'destroyFile']);
    });

    /* ---------------------------------------------------------------- */
    /* Member workspace                                                  */
    /* ---------------------------------------------------------------- */

    // No member id appears in any of these: everything is scoped to the
    // authenticated user, so one member cannot address another's profile.
    Route::middleware('auth:sanctum')->prefix('member')->group(function (): void {
        Route::get('/profile', [MemberProfileController::class, 'show']);
        Route::put('/profile', [MemberProfileController::class, 'update']);
        Route::get('/profile/completeness', [MemberProfileController::class, 'completeness']);

        Route::post('/profile/avatar', [MemberProfileController::class, 'uploadAvatar']);
        Route::delete('/profile/avatar', [MemberProfileController::class, 'removeAvatar']);

        Route::put('/profile/interests', [MemberProfileController::class, 'interests']);
        Route::put('/profile/notifications', [MemberProfileController::class, 'notifications']);

        Route::post('/addresses', [AddressController::class, 'store']);
        Route::put('/addresses/{address}', [AddressController::class, 'update']);
        Route::delete('/addresses/{address}', [AddressController::class, 'destroy']);
        Route::put('/addresses/{address}/default', [AddressController::class, 'makeDefault']);
    });

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

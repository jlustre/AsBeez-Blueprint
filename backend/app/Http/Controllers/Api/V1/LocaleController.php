<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\App;

/**
 * Which languages the application offers.
 *
 * Public, because the sign-in screens need a language switcher before anyone
 * has an account to store a preference on.
 */
class LocaleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'current' => App::getLocale(),
            'fallback' => config('app.fallback_locale'),
            'locales' => collect(config('locales.supported'))
                ->map(fn (array $meta, string $code) => [
                    'code' => $code,
                    'name' => $meta['name'],
                    // What a speaker of that language calls it — someone who
                    // cannot read the current language cannot read "Spanish".
                    'native' => $meta['native'],
                    'dir' => $meta['dir'] ?? 'ltr',
                ])
                ->values(),
        ]);
    }
}

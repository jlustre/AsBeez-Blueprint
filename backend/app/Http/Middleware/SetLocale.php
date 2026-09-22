<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

/**
 * Decides which language this request is answered in.
 *
 * Order of preference, most explicit first:
 *   1. ?lang= on the request — lets a shared link carry its own language.
 *   2. The signed-in member's saved profile language.
 *   3. The browser's Accept-Language header.
 *   4. The application default.
 *
 * Anything not in config('locales.supported') is ignored rather than trusted:
 * the locale reaches translation file paths, so an unvalidated value is a
 * path-traversal vector.
 */
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->fromQuery($request)
            ?? $this->fromUser($request)
            ?? $this->fromHeader($request)
            ?? config('app.locale');

        App::setLocale($locale);

        $response = $next($request);

        // Tells caches that the body varies by language, and lets the client
        // confirm which language it actually got.
        $response->headers->set('Content-Language', $locale);
        $response->headers->set('Vary', 'Accept-Language', false);

        return $response;
    }

    private function fromQuery(Request $request): ?string
    {
        return $this->supported($request->query('lang'));
    }

    private function fromUser(Request $request): ?string
    {
        return $this->supported($request->user()?->profile?->language);
    }

    /**
     * Parses Accept-Language, honouring quality weights and matching a base
     * language when the exact tag is unknown ("es-MX" → "es").
     */
    private function fromHeader(Request $request): ?string
    {
        $header = $request->header('Accept-Language');

        if (blank($header)) {
            return null;
        }

        $candidates = [];

        foreach (explode(',', $header) as $part) {
            $bits = explode(';q=', trim($part));
            $tag = strtolower(trim($bits[0]));

            if ($tag === '' || $tag === '*') {
                continue;
            }

            $candidates[$tag] = (float) ($bits[1] ?? 1.0);
        }

        arsort($candidates);

        foreach (array_keys($candidates) as $tag) {
            if ($match = $this->supported($tag) ?? $this->supported(explode('-', $tag)[0])) {
                return $match;
            }
        }

        return null;
    }

    private function supported(?string $locale): ?string
    {
        $locale = is_string($locale) ? strtolower(trim($locale)) : null;

        return $locale !== null && array_key_exists($locale, config('locales.supported', []))
            ? $locale
            : null;
    }
}

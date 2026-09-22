<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Records that an account was in use.
 *
 * Throttled: writing on every authenticated request would put a write on the
 * read path of the whole API for a column nobody reads more precisely than
 * "today". Once every few minutes is as much resolution as the administration
 * screen shows, and costs one cheap comparison the rest of the time.
 *
 * Updated with a bare query rather than the model so it raises no events and
 * does not move `updated_at` — being seen is not a change to the account.
 */
class TouchLastActive
{
    private const EVERY_MINUTES = 5;

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user instanceof User) {
            $last = $user->last_active_at;

            if ($last === null || $last->diffInMinutes(now()) >= self::EVERY_MINUTES) {
                $now = now();

                DB::table('users')->where('id', $user->id)->update(['last_active_at' => $now]);

                // Keep the in-memory model honest for the rest of the request.
                $user->setAttribute('last_active_at', $now)->syncOriginalAttribute('last_active_at');
            }
        }

        return $next($request);
    }
}

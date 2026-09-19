<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Coarse role gate for whole route groups. Ownership is a separate question,
 * answered by StoreAccessPolicy on each individual store.
 */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Administrators are never locked out of a role-gated area.
        if ($user && ($user->isAdmin() || in_array($user->role, $roles, true))) {
            return $next($request);
        }

        abort(403, 'This area requires one of the following roles: '.implode(', ', $roles).'.');
    }
}

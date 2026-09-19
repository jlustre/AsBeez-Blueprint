<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;

/**
 * Authorization for store ownership.
 *
 * Named StoreAccessPolicy rather than the conventional StorePolicy because
 * App\Models\StorePolicy already exists (a store's shipping/returns document).
 * Two classes called StorePolicy in the same codebase would be a permanent
 * source of wrong imports, so this one is registered explicitly in
 * AppServiceProvider instead of relying on name-based discovery.
 */
class StoreAccessPolicy
{
    /**
     * Administrators can reach every store; everyone else falls through to the
     * ownership checks below.
     */
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasRole(User::ROLE_VENDOR);
    }

    public function create(User $user): bool
    {
        return $user->hasRole(User::ROLE_VENDOR);
    }

    public function view(User $user, Store $store): bool
    {
        return $store->isOwnedBy($user);
    }

    public function update(User $user, Store $store): bool
    {
        return $store->isOwnedBy($user);
    }

    public function delete(User $user, Store $store): bool
    {
        return $store->isOwnedBy($user);
    }
}

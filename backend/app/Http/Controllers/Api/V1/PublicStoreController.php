<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

class PublicStoreController extends Controller
{
    /**
     * The storefront as a shopper sees it, resolved by slug.
     *
     * A store that is not active is a 404 in public — except for the people
     * entitled to preview it before it goes live: its owner, and admins. The
     * response says which of the two happened, so the page can badge a preview
     * rather than passing a draft off as a live storefront.
     */
    public function show(Store $store): JsonResponse
    {
        $isLive = $store->status === Store::STATUS_ACTIVE;

        // Resolved through the guard directly: this route sits outside the
        // auth middleware, so a bearer token is optional rather than required.
        $viewer = auth('sanctum')->user();
        $mayPreview = $viewer !== null && ($viewer->isAdmin() || $store->isOwnedBy($viewer));

        abort_unless($isLive || $mayPreview, 404);

        $store->load(['categories', 'hours', 'socials.platform', 'policies.type', 'verifications']);

        $payload = (new StoreResource($store))->toArray(request());

        // Nothing here is the vendor's private workspace.
        unset($payload['completeness']);

        if ($store->hide_address) {
            $payload['location']['address_line'] = null;
        }

        // Only published policies are public.
        $payload['policies'] = collect($payload['policies'])
            ->where('status', 'published')
            ->values();

        return response()->json([
            'store' => $payload,
            'preview' => ! $isLive,
        ]);
    }
}

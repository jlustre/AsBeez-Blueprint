<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\StorePolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StorePolicyController extends Controller
{
    public function index(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        return response()->json([
            'policies' => $store->policies()->with('type')->get()->map(fn (StorePolicy $p) => [
                'id' => $p->id,
                'policy_type_id' => $p->policy_type_id,
                'type_key' => $p->type?->key,
                'label' => $p->type?->label,
                'status' => $p->status,
                'body' => $p->body,
                'published_at' => $p->published_at?->toIso8601String(),
            ])->values(),
        ]);
    }

    /**
     * Upsert by policy type: a store has at most one document per type, so
     * "create" and "edit" are the same call from the page's point of view.
     */
    public function upsert(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $validated = $request->validate([
            'policy_type_id' => ['required', 'integer', Rule::exists('policy_types', 'id')],
            'body' => ['nullable', 'string', 'max:50000'],
            'status' => ['required', Rule::in([StorePolicy::STATUS_DRAFT, StorePolicy::STATUS_PUBLISHED])],
        ]);

        $publishing = $validated['status'] === StorePolicy::STATUS_PUBLISHED;

        if ($publishing && blank($validated['body'] ?? null)) {
            return response()->json([
                'message' => 'A policy needs a body before it can be published.',
                'errors' => ['body' => ['A policy needs a body before it can be published.']],
            ], 422);
        }

        $policy = $store->policies()->updateOrCreate(
            ['policy_type_id' => $validated['policy_type_id']],
            [
                'body' => $validated['body'] ?? null,
                'status' => $validated['status'],
                'published_at' => $publishing ? now() : null,
            ],
        );

        return response()->json(['policy' => $policy->load('type')], $policy->wasRecentlyCreated ? 201 : 200);
    }

    public function destroy(Store $store, StorePolicy $policy): JsonResponse
    {
        $this->authorize('update', $store);

        // Route-model binding resolves the policy independently of the store,
        // so confirm it actually belongs to this one before deleting.
        abort_unless($policy->store_id === $store->getKey(), 404);

        $policy->delete();

        return response()->json(['message' => 'Policy removed.']);
    }
}

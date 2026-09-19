<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\StoreVerification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StoreVerificationController extends Controller
{
    public function index(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        return response()->json(['verifications' => $store->verifications()->get([
            'kind', 'status', 'reference', 'verified_at',
        ])]);
    }

    /**
     * Vendors may only ever move a check to "pending" — an admin decides the
     * outcome. Anything already verified is left alone.
     */
    public function request(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $validated = $request->validate([
            'kind' => ['required', Rule::in(Store::VERIFICATION_KINDS)],
            'reference' => ['nullable', 'string', 'max:255'],
            'document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ]);

        $existing = $store->verifications()->where('kind', $validated['kind'])->first();

        if ($existing?->isVerified()) {
            return response()->json(['message' => 'That check is already verified.'], 409);
        }

        $path = $request->hasFile('document')
            ? $request->file('document')->store("stores/{$store->getKey()}/verification", Store::MEDIA_DISK)
            : $existing?->document_path;

        $verification = $store->verifications()->updateOrCreate(
            ['kind' => $validated['kind']],
            [
                'status' => StoreVerification::STATUS_PENDING,
                'reference' => $validated['reference'] ?? $existing?->reference,
                'document_path' => $path,
                'verified_at' => null,
            ],
        );

        return response()->json([
            'message' => 'Verification requested. An administrator will review it.',
            'verification' => $verification->only(['kind', 'status', 'reference', 'verified_at']),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PartnerApplicationResource;
use App\Models\PartnerApplication;
use App\Models\PartnerApplicationFile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PartnerApplicationController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return $this->payload($this->current($request->user()));
    }

    public function update(Request $request): JsonResponse
    {
        $application = $this->current($request->user());
        $this->assertEditable($application);

        $validated = $request->validate($this->rules());
        $validated = $this->normalizePrices($validated);

        if (($validated['accepted_terms'] ?? false)
            && ($validated['accepted_ppa'] ?? false)
            && ($validated['accepted_seller_standards'] ?? false)
            && ! $application->agreements_accepted_at) {
            $validated['agreements_accepted_at'] = now();
        }

        $application->fill($validated);
        $application->save();
        $application->recordEvent('draft_saved', 'applicant', (int) ($validated['current_step'] ?? $application->current_step));

        return $this->payload($application->fresh(['files', 'events']));
    }

    public function submit(Request $request): JsonResponse
    {
        $application = $this->current($request->user());
        $this->assertEditable($application);

        if (! $application->completeness()->applicantStepsDone()) {
            throw ValidationException::withMessages([
                'application' => __('The application is missing required steps.'),
            ]);
        }

        $application->update([
            'status' => PartnerApplication::STATUS_SUBMITTED,
            'current_step' => PartnerApplication::TOTAL_STEPS,
            'submitted_at' => now(),
        ]);
        $application->recordEvent('submitted', 'applicant', PartnerApplication::TOTAL_STEPS);

        return $this->payload($application->fresh(['files', 'events']));
    }

    public function upload(Request $request): JsonResponse
    {
        $application = $this->current($request->user());
        $this->assertEditable($application);

        $request->validate([
            'kind' => ['required', Rule::in(PartnerApplication::FILE_KINDS)],
            'file' => ['required', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png,csv,doc,docx'],
        ]);

        $kind = (string) $request->input('kind');
        $uploaded = $request->file('file');
        $path = $uploaded->store("applications/{$application->getKey()}/{$kind}", PartnerApplication::MEDIA_DISK);

        $application->files()->create([
            'kind' => $kind,
            'path' => $path,
            'original_name' => $uploaded->getClientOriginalName(),
            'mime' => $uploaded->getClientMimeType(),
            'size' => $uploaded->getSize() ?: 0,
        ]);
        $application->recordEvent('file_uploaded', 'applicant', (int) $application->current_step);

        return $this->payload($application->fresh(['files', 'events']));
    }

    public function destroyFile(Request $request, PartnerApplicationFile $file): JsonResponse
    {
        $application = $this->current($request->user());
        $this->assertEditable($application);

        abort_unless($file->partner_application_id === $application->getKey(), 404);

        Storage::disk(PartnerApplication::MEDIA_DISK)->delete($file->path);
        $file->delete();
        $application->recordEvent('file_removed', 'applicant', (int) $application->current_step);

        return $this->payload($application->fresh(['files', 'events']));
    }

    private function current(User $user): PartnerApplication
    {
        $application = $user->partnerApplications()->with(['files', 'events'])->latest()->first();

        if ($application) {
            return $application;
        }

        $application = $user->partnerApplications()->create([
            'reference' => PartnerApplication::nextReference(),
            'status' => PartnerApplication::STATUS_DRAFT,
            'current_step' => 1,
            'contact_name' => $user->name,
            'contact_email' => $user->email,
        ]);
        $application->recordEvent('started', 'applicant', 1);

        return $application->load(['files', 'events']);
    }

    private function assertEditable(PartnerApplication $application): void
    {
        abort_unless($application->canEdit(), 409, 'This application can no longer be edited.');
    }

    private function payload(PartnerApplication $application): JsonResponse
    {
        return response()->json([
            'application' => new PartnerApplicationResource($application->loadMissing(['files', 'events'])),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        return [
            'current_step' => ['sometimes', 'integer', 'min:1', 'max:12'],
            'partnership_type' => ['sometimes', 'nullable', Rule::in(PartnerApplication::PARTNERSHIP_TYPES)],
            'business_name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'display_name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'tagline' => ['sometimes', 'nullable', 'string', 'max:160'],
            'about' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'website' => ['sometimes', 'nullable', 'url', 'max:255'],
            'profile_country' => ['sometimes', 'nullable', 'string', 'size:2'],
            'contact_name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'contact_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'contact_phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'contact_role' => ['sometimes', 'nullable', 'string', 'max:100'],
            'legal_name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'entity_type' => ['sometimes', 'nullable', Rule::in(PartnerApplication::ENTITY_TYPES)],
            'registration_number' => ['sometimes', 'nullable', 'string', 'max:80'],
            'year_established' => ['sometimes', 'nullable', 'integer', 'min:1800', 'max:'.now()->year],
            'address_line' => ['sometimes', 'nullable', 'string', 'max:255'],
            'city' => ['sometimes', 'nullable', 'string', 'max:100'],
            'state' => ['sometimes', 'nullable', 'string', 'max:100'],
            'postal_code' => ['sometimes', 'nullable', 'string', 'max:20'],
            'business_country' => ['sometimes', 'nullable', 'string', 'size:2'],
            'offering' => ['sometimes', 'nullable', Rule::in(PartnerApplication::OFFERINGS)],
            'categories' => ['sometimes', 'nullable', 'array'],
            'categories.*' => ['string', Rule::in(PartnerApplication::CATEGORIES)],
            'primary_product_category' => ['sometimes', 'nullable', Rule::in(PartnerApplication::CATEGORIES)],
            'product_count' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:1000000'],
            'product_condition' => ['sometimes', 'nullable', Rule::in(PartnerApplication::CONDITIONS)],
            'avg_product_price' => ['sometimes', 'nullable'],
            'low_price' => ['sometimes', 'nullable'],
            'high_price' => ['sometimes', 'nullable'],
            'inventory_ownership' => ['sometimes', 'nullable', Rule::in(PartnerApplication::INVENTORY)],
            'seller_relationship' => ['sometimes', 'nullable', Rule::in(PartnerApplication::RELATIONSHIPS)],
            'product_origin' => ['sometimes', 'nullable', 'string', 'max:150'],
            'regulated' => ['sometimes', 'nullable', 'boolean'],
            'primary_service_category' => ['sometimes', 'nullable', Rule::in(PartnerApplication::CATEGORIES)],
            'delivery_method' => ['sometimes', 'nullable', Rule::in(PartnerApplication::DELIVERIES)],
            'service_area' => ['sometimes', 'nullable', 'string', 'max:150'],
            'booking_duration' => ['sometimes', 'nullable', 'string', 'max:50'],
            'avg_service_price' => ['sometimes', 'nullable'],
            'team_size' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100000'],
            'professional_licenses' => ['sometimes', 'nullable', 'string', 'max:255'],
            'insurance_coverage' => ['sometimes', 'nullable', Rule::in(PartnerApplication::INSURANCE)],
            'store_name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'store_slug' => ['sometimes', 'nullable', 'string', 'max:80', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'brand_story' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'public_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'public_phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'fulfillment_method' => ['sometimes', 'nullable', Rule::in(PartnerApplication::FULFILLMENT)],
            'ships_from' => ['sometimes', 'nullable', 'string', 'max:150'],
            'handling_days' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:60'],
            'service_radius_km' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:20000'],
            'operates_remotely' => ['sometimes', 'nullable', 'boolean'],
            'payout_method' => ['sometimes', 'nullable', Rule::in(PartnerApplication::PAYOUT_METHODS)],
            'payout_account_holder' => ['sometimes', 'nullable', 'string', 'max:150'],
            'payout_country' => ['sometimes', 'nullable', 'string', 'size:2'],
            'payout_currency' => ['sometimes', 'nullable', 'string', 'size:3'],
            'tax_registered' => ['sometimes', 'nullable', 'boolean'],
            'tax_id' => ['sometimes', 'nullable', 'string', 'max:80'],
            'tax_country' => ['sometimes', 'nullable', 'string', 'size:2'],
            'identity_document_type' => ['sometimes', 'nullable', Rule::in(PartnerApplication::IDENTITY_TYPES)],
            'identity_full_name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'accepted_terms' => ['sometimes', 'boolean'],
            'accepted_ppa' => ['sometimes', 'boolean'],
            'accepted_seller_standards' => ['sometimes', 'boolean'],
            'applicant_reply' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function normalizePrices(array $validated): array
    {
        foreach (['avg_product_price', 'low_price', 'high_price', 'avg_service_price'] as $field) {
            if (! array_key_exists($field, $validated) || $validated[$field] === null || $validated[$field] === '') {
                continue;
            }

            $validated[$field] = is_numeric($validated[$field])
                ? $validated[$field]
                : preg_replace('/[^0-9.]/', '', (string) $validated[$field]);
        }

        if (isset($validated['profile_country'])) {
            $validated['profile_country'] = strtoupper((string) $validated['profile_country']);
        }

        foreach (['business_country', 'payout_country', 'tax_country'] as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = strtoupper((string) $validated[$field]);
            }
        }

        if (isset($validated['payout_currency'])) {
            $validated['payout_currency'] = strtoupper((string) $validated['payout_currency']);
        }

        return $validated;
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\MemberProfileResource;
use App\Models\CountryRegion;
use App\Models\MemberAddress;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * The signed-in member's address book.
 *
 * Addresses are read and written through $request->user(), and every route that
 * names one re-checks ownership: route-model binding resolves by id alone and
 * would otherwise hand over anyone's address.
 */
class AddressController extends Controller
{
    private const RELATIONS = ['profile', 'interests', 'addresses', 'notificationPreferences'];

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate($this->rules());

        $address = DB::transaction(function () use ($user, $validated) {
            $address = $user->addresses()->create([
                ...$validated,
                'position' => (int) $user->addresses()->max('position') + 1,
            ]);

            $this->enforceSingleDefaults($user, $address);

            return $address;
        });

        return $this->profile($user, 201, __('app.member.address_added', ['label' => $address->label]));
    }

    public function update(Request $request, MemberAddress $address): JsonResponse
    {
        $user = $request->user();
        abort_unless($address->isOwnedBy($user), 404);

        $validated = $request->validate($this->rules(false));

        DB::transaction(function () use ($user, $address, $validated) {
            $address->update($validated);
            $this->enforceSingleDefaults($user, $address);
        });

        return $this->profile($user, 200, __('app.member.address_updated'));
    }

    public function destroy(Request $request, MemberAddress $address): JsonResponse
    {
        $user = $request->user();
        abort_unless($address->isOwnedBy($user), 404);

        $address->delete();

        // Never leave the book without a default while addresses remain.
        if ($user->addresses()->where('is_default_shipping', true)->doesntExist()) {
            $user->addresses()->oldest('position')->first()?->update(['is_default_shipping' => true]);
        }

        return $this->profile($user, 200, __('app.member.address_removed'));
    }

    /** Promotes one address to default without the caller editing the others. */
    public function makeDefault(Request $request, MemberAddress $address): JsonResponse
    {
        $user = $request->user();
        abort_unless($address->isOwnedBy($user), 404);

        $validated = $request->validate([
            'kind' => ['required', Rule::in(['shipping', 'billing'])],
        ]);

        $column = $validated['kind'] === 'billing' ? 'is_default_billing' : 'is_default_shipping';

        DB::transaction(function () use ($user, $address, $column) {
            $user->addresses()->update([$column => false]);
            $address->update([$column => true]);
        });

        return $this->profile($user, 200, __('app.member.address_default_updated'));
    }

    /**
     * Exactly one shipping and one billing default, enforced after any write
     * that could have set a second one.
     */
    private function enforceSingleDefaults(User $user, MemberAddress $keep): void
    {
        foreach (['is_default_shipping', 'is_default_billing'] as $column) {
            if ($keep->{$column}) {
                $user->addresses()->whereKeyNot($keep->getKey())->update([$column => false]);
            }
        }

        // A first address is the default whether or not the caller said so.
        if ($user->addresses()->count() === 1) {
            $keep->update(['is_default_shipping' => true, 'is_default_billing' => true]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(bool $creating = true): array
    {
        $required = $creating ? 'required' : 'sometimes';

        return [
            'label' => [$required, 'string', 'max:50'],
            'recipient' => [$required, 'string', 'max:150'],
            'line1' => [$required, 'string', 'max:255'],
            'line2' => ['sometimes', 'nullable', 'string', 'max:255'],
            'city' => [$required, 'string', 'max:120'],
            'state' => ['sometimes', 'nullable', 'string', 'max:120', $this->regionRule()],
            'postal_code' => ['sometimes', 'nullable', 'string', 'max:20'],
            'country' => [
                $required, 'string', 'size:2',
                Rule::exists('countries', 'code')->where('is_active', true),
            ],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'is_default_shipping' => ['sometimes', 'boolean'],
            'is_default_billing' => ['sometimes', 'boolean'],
        ];
    }

    /** Same rule as the store address: a seeded country constrains its states. */
    private function regionRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail) {
            $country = request()->input('country');

            if (blank($value) || blank($country)) {
                return;
            }

            $available = CountryRegion::where('country_code', $country);

            if ($available->exists() && ! (clone $available)->where('code', $value)->exists()) {
                $fail(__('app.location.region_mismatch'));
            }
        };
    }

    private function profile(User $user, int $status, string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'profile' => new MemberProfileResource($user->load(self::RELATIONS)),
        ], $status);
    }
}

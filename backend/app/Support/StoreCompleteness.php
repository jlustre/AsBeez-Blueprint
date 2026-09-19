<?php

namespace App\Support;

use App\Models\PolicyType;
use App\Models\Store;
use App\Models\StorePolicy;
use App\Models\StoreVerification;

/**
 * Works out how finished a store profile is.
 *
 * The page used to display a hard-coded "82% complete" with a hard-coded task
 * list. Both are derived here from the store's actual rows, so the number moves
 * when the vendor fills something in.
 */
class StoreCompleteness
{
    public function __construct(private readonly Store $store)
    {
    }

    public static function for(Store $store): self
    {
        return new self($store);
    }

    /**
     * @return array{percent: int, completed: int, total: int, remaining: int, tasks: list<array<string, mixed>>}
     */
    public function toArray(): array
    {
        $tasks = $this->tasks();
        $completed = count(array_filter($tasks, fn (array $t) => $t['done']));
        $total = count($tasks);

        return [
            'percent' => $total > 0 ? (int) round($completed / $total * 100) : 0,
            'completed' => $completed,
            'total' => $total,
            'remaining' => $total - $completed,
            'tasks' => $tasks,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function tasks(): array
    {
        $store = $this->store->loadMissing(['categories', 'hours', 'policies.type', 'verifications']);

        return [
            $this->task(
                'logo',
                'Upload store logo',
                'Recommended 400×400px PNG or SVG',
                filled($store->logo_path),
                'Upload now',
                '#store-identity',
            ),
            $this->task(
                'banner',
                'Upload store banner',
                'Recommended 1600 × 400px JPG or PNG',
                filled($store->banner_path),
                'Upload now',
                '#store-identity',
            ),
            $this->task(
                'description',
                'Add store description',
                'Tell customers what makes your store unique',
                mb_strlen((string) $store->description) >= 50,
                'Add description',
                '#store-identity',
            ),
            $this->task(
                'categories',
                'Choose store categories',
                'Helps customers find you in the right places',
                $store->categories->isNotEmpty(),
                'Choose categories',
                '#store-identity',
            ),
            $this->task(
                'contact',
                'Add contact details',
                'A public email and phone number',
                filled($store->public_email) && filled($store->public_phone),
                'Add contact details',
                '#contact-location',
            ),
            $this->task(
                'hours',
                'Set business hours',
                'Tell customers when you are open',
                $store->hours->isNotEmpty(),
                'Set hours',
                '#business-hours',
            ),
            $this->task(
                'policies',
                'Publish required policies',
                $this->policyHint($store),
                $this->requiredPoliciesPublished($store),
                'Add policies',
                '#store-policies',
            ),
            $this->task(
                'verification',
                'Verify your business',
                'Verified stores rank higher and earn more trust',
                $store->verifications
                    ->firstWhere('kind', 'business')?->status === StoreVerification::STATUS_VERIFIED,
                'Start verification',
                '#verification-trust',
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function task(string $key, string $label, string $hint, bool $done, string $cta, string $href): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'hint' => $hint,
            'done' => $done,
            'cta' => $cta,
            'href' => $href,
        ];
    }

    private function requiredPoliciesPublished(Store $store): bool
    {
        $required = PolicyType::where('is_required', true)->pluck('id');

        if ($required->isEmpty()) {
            return true;
        }

        $published = $store->policies
            ->where('status', StorePolicy::STATUS_PUBLISHED)
            ->pluck('policy_type_id');

        return $required->diff($published)->isEmpty();
    }

    private function policyHint(Store $store): string
    {
        $missing = PolicyType::where('is_required', true)
            ->whereNotIn('id', $store->policies
                ->where('status', StorePolicy::STATUS_PUBLISHED)
                ->pluck('policy_type_id'))
            ->pluck('label');

        return $missing->isEmpty()
            ? 'All required policies are published'
            : 'Still needed: '.$missing->implode(', ');
    }
}

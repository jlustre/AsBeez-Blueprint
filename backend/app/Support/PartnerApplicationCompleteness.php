<?php

namespace App\Support;

use App\Models\PartnerApplication;

class PartnerApplicationCompleteness
{
    public function __construct(private readonly PartnerApplication $application)
    {
    }

    public static function for(PartnerApplication $application): self
    {
        return new self($application);
    }

    /**
     * @return array{percent: int, completed: int, total: int, remaining: int, steps: list<array<string, mixed>>}
     */
    public function toArray(): array
    {
        $steps = $this->steps();
        $completed = count(array_filter($steps, fn (array $step) => $step['done']));
        $total = count($steps);

        return [
            'percent' => $total > 0 ? (int) round($completed / $total * 100) : 0,
            'completed' => $completed,
            'total' => $total,
            'remaining' => $total - $completed,
            'steps' => $steps,
        ];
    }

    public function applicantStepsDone(): bool
    {
        foreach ($this->steps() as $step) {
            if ($step['id'] < 12 && ! $step['done']) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function steps(): array
    {
        $app = $this->application;
        $current = (int) $app->current_step;
        $changesStep = $app->status === PartnerApplication::STATUS_CHANGES_REQUESTED
            ? (int) $app->changes_step
            : null;

        $definitions = [
            1 => filled($app->partnership_type),
            2 => filled($app->business_name),
            3 => filled($app->contact_name) && filled($app->contact_email),
            4 => filled($app->legal_name) && filled($app->entity_type) && filled($app->city) && filled($app->business_country),
            5 => $this->offeringDone(),
            6 => filled($app->store_name),
            7 => filled($app->fulfillment_method),
            8 => filled($app->payout_method) && filled($app->payout_account_holder),
            9 => $app->tax_registered !== null && (! $app->tax_registered || filled($app->tax_id)),
            10 => filled($app->identity_document_type) && filled($app->identity_full_name),
            11 => $app->accepted_terms && $app->accepted_ppa && $app->accepted_seller_standards,
            12 => $app->submitted_at !== null,
        ];

        $steps = [];

        foreach ($definitions as $id => $done) {
            $status = 'todo';

            if ($done) {
                $status = 'completed';
            } elseif ($changesStep === $id) {
                $status = 'attention';
            } elseif ($id === $current) {
                $status = 'current';
            }

            $steps[] = [
                'id' => $id,
                'done' => $done,
                'status' => $status,
            ];
        }

        return $steps;
    }

    private function offeringDone(): bool
    {
        $app = $this->application;

        if (! filled($app->offering) || empty($app->categories)) {
            return false;
        }

        if (in_array($app->offering, ['products', 'both'], true) && ! filled($app->primary_product_category)) {
            return false;
        }

        if (in_array($app->offering, ['services', 'both'], true) && ! filled($app->primary_service_category)) {
            return false;
        }

        return true;
    }
}

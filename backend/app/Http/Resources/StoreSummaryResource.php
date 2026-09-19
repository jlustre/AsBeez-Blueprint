<?php

namespace App\Http\Resources;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The shape the vendor store-switcher needs: enough to label a store, nothing more.
 *
 * @mixin Store
 */
class StoreSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'status' => $this->status,
            'logo_url' => $this->logoUrl(),
            'verified' => $this->verified_at !== null,
        ];
    }
}

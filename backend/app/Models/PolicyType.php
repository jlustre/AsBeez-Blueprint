<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['key', 'label', 'hint', 'icon', 'tone', 'is_required', 'position'])]
class PolicyType extends Model
{
    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function storePolicies(): HasMany
    {
        return $this->hasMany(StorePolicy::class);
    }
}

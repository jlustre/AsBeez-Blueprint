<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['key', 'label', 'icon', 'icon_path', 'input_type', 'placeholder', 'tone', 'position', 'is_active'])]
class SocialPlatform extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function storeSocials(): HasMany
    {
        return $this->hasMany(StoreSocial::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

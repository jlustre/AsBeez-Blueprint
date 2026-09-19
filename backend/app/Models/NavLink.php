<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['group', 'label', 'hint', 'icon', 'tone', 'route', 'badge_source', 'roles', 'position', 'is_active'])]
class NavLink extends Model
{
    protected function casts(): array
    {
        return [
            'roles' => 'array',
            'is_active' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

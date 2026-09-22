<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['group', 'label', 'hint', 'icon', 'tone', 'route', 'badge_source', 'roles', 'position', 'is_active'])]
class NavLink extends Model
{
    use HasTranslations;

    /**
     * Fields an administrator may translate per locale.
     *
     * @var list<string>
     */
    protected array $translatable = ['label', 'hint', 'group'];

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

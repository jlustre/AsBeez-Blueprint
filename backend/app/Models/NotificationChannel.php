<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'label', 'requires', 'position', 'is_active'])]
class NotificationChannel extends Model
{
    use HasTranslations;

    /**
     * Fields an administrator may translate per locale.
     *
     * @var list<string>
     */
    protected array $translatable = ['label'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'position' => 'integer'];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

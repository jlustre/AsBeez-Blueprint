<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['store_id', 'setting_key', 'value'])]
class StoreSettingValue extends Model
{
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function definition(): BelongsTo
    {
        return $this->belongsTo(SettingDefinition::class, 'setting_key', 'key');
    }
}

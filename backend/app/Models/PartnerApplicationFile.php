<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['partner_application_id', 'kind', 'path', 'original_name', 'mime', 'size'])]
class PartnerApplicationFile extends Model
{
    public function application(): BelongsTo
    {
        return $this->belongsTo(PartnerApplication::class, 'partner_application_id');
    }

    public function url(): ?string
    {
        if (! $this->path) {
            return null;
        }

        return Storage::disk(PartnerApplication::MEDIA_DISK)->url($this->path);
    }
}

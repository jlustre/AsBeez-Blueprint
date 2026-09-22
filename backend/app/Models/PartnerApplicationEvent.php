<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['partner_application_id', 'action', 'actor', 'step'])]
class PartnerApplicationEvent extends Model
{
    public function application(): BelongsTo
    {
        return $this->belongsTo(PartnerApplication::class, 'partner_application_id');
    }
}

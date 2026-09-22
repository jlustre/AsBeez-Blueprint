<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One auditable thing an administrator did to a dispute case.
 */
class DisputeAdminEvent extends Model
{
    public const TYPE_NOTE = 'note';

    public const TYPE_STATUS = 'status';

    protected $fillable = ['dispute_id', 'author_id', 'type', 'body', 'from_status', 'to_status'];

    public function dispute(): BelongsTo
    {
        return $this->belongsTo(Dispute::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}

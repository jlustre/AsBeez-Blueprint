<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One auditable thing an administrator did to a commercial commitment.
 */
class OrderAdminEvent extends Model
{
    public const TYPE_NOTE = 'note';

    public const TYPE_STATUS = 'status';

    protected $fillable = ['order_id', 'author_id', 'type', 'body', 'from_status', 'to_status'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}

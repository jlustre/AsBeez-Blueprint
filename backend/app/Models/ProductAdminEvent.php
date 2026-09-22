<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One auditable thing an administrator did to a catalog listing.
 *
 * Append-only by intent: the point of the record is that it cannot be tidied away.
 */
class ProductAdminEvent extends Model
{
    public const TYPE_NOTE = 'note';

    public const TYPE_STATUS = 'status';

    protected $fillable = ['product_id', 'author_id', 'type', 'body', 'from_status', 'to_status'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}

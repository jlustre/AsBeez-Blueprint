<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One auditable thing an administrator did to a member account.
 *
 * Append-only by intent: nothing in the application updates or deletes these
 * rows, because the point of the record is that it cannot be tidied away.
 */
class MemberAdminEvent extends Model
{
    use HasFactory;

    public const TYPE_NOTE = 'note';

    public const TYPE_STATUS = 'status';

    protected $fillable = ['user_id', 'author_id', 'type', 'body', 'from_status', 'to_status'];

    /** The member the event is about. */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** The administrator who did it; null once their account is gone. */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}

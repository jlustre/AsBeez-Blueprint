<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One auditable thing an administrator did to a financial entry.
 */
class FinancialEntryAdminEvent extends Model
{
    public const TYPE_NOTE = 'note';

    public const TYPE_STATUS = 'status';

    protected $fillable = ['financial_entry_id', 'author_id', 'type', 'body', 'from_status', 'to_status'];

    public function entry(): BelongsTo
    {
        return $this->belongsTo(FinancialEntry::class, 'financial_entry_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
